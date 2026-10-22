import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';
import { HelpCircle, Book, MessageSquare, Mail, ChevronRight, Search } from 'lucide-react';

const faqs = [
    { q: "How do I upload a document?", a: "Go to the Upload tab, tap 'Browse Files', and select a PDF, DOCX, or TXT file. Brainlyx will automatically analyze it and generate study materials." },
    { q: "What file types are supported?", a: "We support PDF, DOCX, and TXT files. Audio recordings (M4A, MP3) are also supported for transcription." },
    { q: "How does the AI generate flashcards?", a: "Our AI analyzes your document, extracts key concepts, and creates question-answer pairs designed for active recall and spaced repetition." },
    { q: "Can I use Brainlyx offline?", a: "Some features work offline, but AI-powered features (summaries, flashcards, questions) require an internet connection." },
    { q: "How do I delete my account?", a: "Go to Profile - Settings - Delete Account. Your data will be permanently removed within 30 days." },
    { q: "Is my data secure?", a: "Yes. We use industry-standard encryption (HTTPS/TLS) and store data on secure cloud infrastructure. We never sell your personal information." },
];

const HelpCenter = () => {
    return (
        <PageLayout title="Help Center" subtitle="Find answers, guides, and support for Brainlyx." accent="primary">
            <div className="max-w-2xl mx-auto mb-12">
                <div className="clay rounded-2xl flex items-center gap-3 px-5 py-3.5">
                    <Search className="h-5 w-5 text-textSecondary" />
                    <input type="text" placeholder="Search help articles..." className="flex-1 bg-transparent outline-none text-text placeholder:text-textSecondary" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {[
                    { icon: <Book className="h-8 w-8" />, title: "Getting Started", desc: "New to Brainlyx? Start here." },
                    { icon: <MessageSquare className="h-8 w-8" />, title: "FAQs", desc: "Frequently asked questions." },
                    { icon: <Mail className="h-8 w-8" />, title: "Contact Support", desc: "Get help from our team." },
                ].map((item, i) => (
                    <div key={i} className="clay rounded-3xl p-8 text-center cursor-pointer hover:shadow-xl transition-all">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                            {item.icon}
                        </div>
                        <h3 className="text-lg font-bold text-text mb-2">{item.title}</h3>
                        <p className="text-textSecondary text-sm">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-text mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="clay rounded-2xl p-6"
                        >
                            <h3 className="font-bold text-text mb-2 flex items-center gap-2">
                                <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                {faq.q}
                            </h3>
                            <p className="text-textSecondary leading-relaxed pl-7">{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
};

export default HelpCenter;
