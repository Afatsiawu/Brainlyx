const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const OpenAI = require('openai');

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const TEST_FILE = path.join(__dirname, 'uploads', '1769300796513.pdf'); // One of the existing files

async function test() {
    console.log('--- STARTING AI PIPELINE TEST ---');
    console.log('API KEY EXISTS:', !!GROQ_API_KEY);

    if (!fs.existsSync(TEST_FILE)) {
        console.error('Test file not found:', TEST_FILE);
        return;
    }

    try {
        console.log('Step 1: Extracting text...');
        const buffer = fs.readFileSync(TEST_FILE);
        const data = await pdf(buffer);
        console.log('Text length:', data.text.length);
        console.log('Sample text:', data.text.substring(0, 200));

        console.log('Step 2: Testing Comprehensive Insights generation...');
        const { generateComprehensiveInsights } = require('./src/services/aiService');
        const insights = await generateComprehensiveInsights(data.text);

        console.log('Flashcards count:', insights.flashcards.length);
        console.log('Objective count:', insights.questions.objective.length);
        console.log('--- TEST COMPLETED SUCCESSFULLY ---');
    } catch (err) {
        console.error('--- TEST FAILED ---');
        console.error(err);
    }
}

test();
