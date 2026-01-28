const OpenAI = require('openai');
const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const path = require('path');

let _groq;
const getGroqClient = () => {
    if (!_groq) {
        if (!process.env.GROQ_API_KEY) {
            console.error('[AI] GROQ_API_KEY is missing from environment variables!');
            throw new Error('Groq API key not configured');
        }
        _groq = new OpenAI({
            apiKey: process.env.GROQ_API_KEY,
            baseURL: process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
        });
    }
    return _groq;
};

const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

const extractText = async (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const buffer = fs.readFileSync(filePath);

    try {
        if (ext === '.pdf') {
            const data = await pdf(buffer);
            return data.text;
        } else if (ext === '.docx') {
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        } else {
            return buffer.toString('utf-8'); // Assume text file
        }
    } catch (error) {
        console.error('Text extraction failed:', error);
        throw new Error('Could not extract text from document');
    }
};

const transcribeAudio = async (filePath) => {
    // Note: Groq has its own transcription API, but if keeping OpenAI for Whisper:
    // In this context, we'll focus on Groq for text generation as requested.
    // If user specifically wants Groq for everything, we'd need to adjust this.
    // For now, let's make it production ready by ensuring it doesn't just return mock if key exists.

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key missing for transcription');
    }

    try {
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: "whisper-1",
        });
        return transcription.text;
    } catch (error) {
        console.error('Transcription failed:', error);
        throw new Error('Audio transcription failed');
    }
};

const generateContent = async (text, type = 'flashcards') => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error('Groq API key not configured');
    }

    const systemPrompt = "You are a specialized educational assistant. Generate high-quality study materials in JSON format.";
    const userPrompt = type === 'flashcards'
        ? `Create exactly 5 flashcards from this text. Return JSON: { "flashcards": [{ "front": "...", "back": "..." }] }. Text: ${text.substring(0, 8000)}`
        : `Create 5 multiple choice questions from this text. Return JSON: { "questions": [{ "question": "...", "options": ["...", "..."], "answer": "..." }] }. Text: ${text.substring(0, 8000)}`;

    try {
        const completion = await getGroqClient().chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: DEFAULT_MODEL,
            response_format: { type: "json_object" },
        });

        return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        console.error('Groq Generation failed:', error);
        throw new Error('AI generation failed. Please try again later.');
    }
};

const generateQuestionsByTopic = async (topic) => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error('Groq API key not configured');
    }

    const systemPrompt = "You are an expert educator. Generate challenging exam-style questions for a specific topic.";
    const userPrompt = `Generate a comprehensive exam for the topic: "${topic}".
    Include the following sections:
    1. 10 Objective/Multiple Choice Questions (with 4 options and answer)
    2. 4 Essay Questions (with detailed model answer)
    3. 2 Case Studies (each with a scenario and a specific question)

    Return ONLY a JSON object with this EXACT structure:
    { 
        "objective": [{ "question": "...", "options": ["A", "B", "C", "D"], "answer": "..." }],
        "essay": [{ "question": "...", "answer": "..." }],
        "caseStudy": [{ "scenario": "...", "question": "...", "answer": "..." }]
    }`;

    try {
        const completion = await getGroqClient().chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: DEFAULT_MODEL,
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content);

        // Ensure consistent structure even if AI varies keys slightly
        return {
            objective: result.objective || result.questions || [],
            essay: result.essay || [],
            caseStudy: result.caseStudy || result.caseStudies || []
        };
    } catch (error) {
        console.error('Groq Topic Generation failed:', error);
        throw new Error('Failed to generate questions for this topic.');
    }
};

async function generateFlashcardsByTopic(topic) {
    if (!process.env.GROQ_API_KEY) {
        throw new Error('Groq API key not configured');
    }

    const prompt = `Generate 10-15 high-quality flashcards about "${topic}".

Requirements:
- Cover key concepts, definitions, and important facts
- Front: Clear, concise question or prompt
- Back: Comprehensive answer with relevant details
- Focus on understanding and recall
- Make them educational and accurate

Return ONLY a valid JSON array (no markdown, no code blocks) with this exact structure:
[
  { "front": "Question or term", "back": "Answer or definition" }
]

Topic: ${topic}`;

    try {
        const response = await getGroqClient().chat.completions.create({
            model: DEFAULT_MODEL,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
        });

        const content = response.choices[0].message.content.trim();

        // Extract JSON array from response (might be wrapped in markdown code blocks)
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('No valid JSON array found in AI response');
        }

        const flashcards = JSON.parse(jsonMatch[0]);

        // Validate structure
        if (!Array.isArray(flashcards) || flashcards.length === 0) {
            throw new Error('Invalid flashcard array from AI');
        }

        return flashcards;
    } catch (error) {
        console.error('Groq Flashcard Generation by Topic failed:', error);
        throw new Error('Failed to generate flashcards for this topic: ' + error.message);
    }
}

const generateComprehensiveInsights = async (text) => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error('Groq API key not configured');
    }

    // Determine flashcard count based on text length (approx 1 card per 200 words, min 10, max 30)
    const wordCount = text.split(/\s+/).length;
    const flashcardCount = Math.max(10, Math.min(30, Math.floor(wordCount / 200)));

    const systemPrompt = "You are a specialized educational assistant. You MUST ALWAYS respond with ONLY a valid JSON object. Do not include any preamble, markdown code blocks, or extra text. Your entire response must be parseable by JSON.parse().";

    // Prompts
    const flashcardsPrompt = `Create exactly ${flashcardCount} comprehensive study flashcards from the text provided. 
    Format: { "flashcards": [{ "front": "...", "back": "..." }] }
    Text: ${text.substring(0, 10000)}`;

    const questionsPrompt = `Create a comprehensive study exam from the text provided with 10 multiple choice, 4 essay, and 2 case study questions.
    Format: { 
        "objective": [{ "question": "...", "options": ["A", "B", "C", "D"], "answer": "..." }],
        "essay": [{ "question": "...", "answer": "..." }],
    Format: {
        "objective": [{ "question": "...", "options": ["A", "B", "C", "D"], "answer": "..." }],
        "essay": [{ "question": "...", "answer": "..." }],
        "caseStudy": [{ "scenario": "...", "question": "...", "answer": "..." }]
    }
    Text: ${text.substring(0, 10000)}`;

    try {
        console.log(`[AI] Starting sequential generation (Resilient Mode)...`);

        const extractJson = (str, stepName) => {
            try {
                const match = str.match(/\{[\s\S]*\}/);
                if (!match) {
                    console.error(`[AI ERROR] No JSON found in ${stepName}. Raw:`, str);
                    throw new Error(`No valid JSON object found in AI response during ${stepName}`);
                }
                return JSON.parse(match[0]);
            } catch (e) {
                console.error(`[AI ERROR] Parse failed in ${stepName}. Raw:`, str);
                throw e;
            }
        };

        console.log(`[AI] Sub-step 1: Generating flashcards...`);
        const flashcardsParams = await getGroqClient().chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: flashcardsPrompt }
            ],
            model: DEFAULT_MODEL,
        });
        const flashcardsData = extractJson(flashcardsParams.choices[0].message.content, 'Flashcards Generation');
        console.log(`[AI] Flashcards received and parsed.`);

        console.log(`[AI] Sub-step 2: Generating questions...`);
        const questionsParams = await getGroqClient().chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: questionsPrompt }
            ],
            model: DEFAULT_MODEL,
        });
        const questionsData = extractJson(questionsParams.choices[0].message.content, 'Questions Generation');
        console.log(`[AI] Questions received and parsed.`);

        return {
            flashcards: flashcardsData.flashcards || [],
            questions: {
                objective: questionsData.objective || [],
                essay: questionsData.essay || [],
                caseStudy: questionsData.caseStudy || questionsData.caseStudies || []
            }
        };
    } catch (error) {
        console.error('Groq Comprehensive Generation failed:', error);
        if (error.status === 429) {
            throw new Error('Rate limit exceeded. Please try again in a few minutes.');
        }
        throw new Error('AI generation failed: ' + error.message);
    }
};

const generateLectureInsights = async (text, topic) => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error('Groq API key not configured');
    }

    const systemPrompt = "You are an expert academic assistant. Create detailed study materials from the lecture transcript.";
    const userPrompt = `Analyze the following lecture transcript${topic ? ` focusing specifically on the topic: "${topic}"` : ''}.

    Generate two things:
    1. **Lecture Notes**: A detailed, structured summary in Markdown format (use headings, bullet points, bold text).
    2. **Flashcards**: 5 to 10 key flashcards based on the most important concepts.

    Return ONLY a JSON object with this EXACT structure:
    {
        "summary": "# Lecture Notes\n\n...",
        "flashcards": [{ "front": "...", "back": "..." }]
    }

    Transcript:
    ${text.substring(0, 15000)}`;

    try {
        const completion = await getGroqClient().chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: DEFAULT_MODEL,
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content);
        return {
            summary: result.summary || "No summary generated.",
            flashcards: result.flashcards || []
        };
    } catch (error) {
        console.error('Groq Lecture Insights failed:', error);
        throw new Error('Failed to generate lecture insights.');
    }
};

module.exports = {
    extractText,
    generateContent,
    transcribeAudio,
    generateQuestionsByTopic,
    generateFlashcardsByTopic,
    generateComprehensiveInsights,
    generateLectureInsights,
    getGroqClient
};
