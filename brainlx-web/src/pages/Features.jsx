import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';
import { Brain, FileText, Mic, Calendar, Zap, Video, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TiltCard } from '../components/ThreeDElements';

const features = [
    { icon: <FileText className="h-7 w-7" />, title: "Smart Document Analysis", desc: "Upload PDFs or documents and let our AI summarize, extract key points, and answer your questions instantly.", gradient: "from-primary to-secondary" },
    { icon: <Video className="h-7 w-7" />, title: "Lecture Recording & Transcription", desc: "Record your lectures and get accurate transcriptions with key takeaways automatically generated.", gradient: "from-secondary to-accent" },
    { icon: <Brain className="h-7 w-7" />, title: "AI Study Assistant", desc: "Your personal tutor available 24/7 to explain complex topics, solve problems, and quiz your knowledge.", gradient: "from-primary to-accent" },
    { icon: <Calendar className="h-7 w-7" />, title: "Personalized Study Plans", desc: "Get adaptive study schedules generated based on your goals, deadlines, and learning pace.", gradient: "from-accent to-primary" },
    { icon: <Mic className="h-7 w-7" />, title: "Voice-Activated Learning", desc: "Interact with the app using voice commands for a hands-free study experience.", gradient: "from-secondary to-primary" },
    { icon: <Zap className="h-7 w-7" />, title: "Instant Flashcards", desc: "Turn your notes and readings into study flashcards with a single click.", gradient: "from-accent to-secondary" },
];

const Features = () => {
    return (
        <PageLayout title="Features" subtitle="Everything you need to excel — powered by AI, designed for students." accent="primary">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                    >
                        <TiltCard className="group p-8 bg-white rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                            <div className={`w-14 h-14 bg-gradient-to-br ${f.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-bold text-text mb-3">{f.title}</h3>
                            <p className="text-textSecondary leading-relaxed">{f.desc}</p>
                        </TiltCard>
                    </motion.div>
                ))}
            </div>

            {/* Deep dive sections */}
            <div className="mt-24 space-y-24">
                {[
                    { title: "Smart Document Analysis", body: "Upload any PDF, DOCX, or TXT file. Brainlyx extracts the text, identifies key concepts, and generates a structured summary with key takeaways. Ask follow-up questions and get instant, context-aware answers powered by Groq's Llama models.", icon: <FileText className="h-8 w-8" />, side: 'left' },
                    { title: "Lecture Recording & Transcription", body: "Hit record during class and Brainlyx captures everything. Our AI transcribes the audio, extracts key points, and generates study materials automatically. Never miss a detail again.", icon: <Mic className="h-8 w-8" />, side: 'right' },
                    { title: "AI Study Assistant", body: "Your 24/7 personal tutor. Ask questions, get explanations, solve problems, and take quizzes. The AI adapts to your learning style and provides personalized feedback.", icon: <Brain className="h-8 w-8" />, side: 'left' },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: item.side === 'left' ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.6 }}
                        className={`flex flex-col ${item.side === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}
                    >
                        <div className="flex-1">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                                {item.icon}
                            </div>
                            <h2 className="text-3xl font-bold text-text mb-4">{item.title}</h2>
                            <p className="text-lg text-textSecondary leading-relaxed">{item.body}</p>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="clay rounded-3xl aspect-[4/3] flex items-center justify-center">
                                <span className="text-textSecondary font-medium">Screenshot / Mockup</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </PageLayout>
    );
};

export default Features;
