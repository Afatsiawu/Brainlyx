import { Brain, Calendar, FileText, Mic, Video, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { TiltCard } from './ThreeDElements';
import { ClayCard, ClayChip } from './ClayElements';

const features = [
    { icon: <FileText className="h-6 w-6" />, title: "Smart Document Analysis", desc: "Upload PDFs and let our AI summarize, extract key points, and answer your questions instantly.", span: "md:col-span-2", gradient: "from-primary to-secondary" },
    { icon: <Video className="h-6 w-6" />, title: "Lecture Recording", desc: "Record lectures with auto-transcription and AI takeaways.", span: "", gradient: "from-secondary to-accent" },
    { icon: <Brain className="h-6 w-6" />, title: "AI Study Assistant", desc: "Your personal tutor, 24/7.", span: "", gradient: "from-primary to-accent" },
    { icon: <Calendar className="h-6 w-6" />, title: "Personalized Study Plans", desc: "Adaptive schedules based on your goals, deadlines, and pace.", span: "", gradient: "from-accent to-primary" },
    { icon: <Mic className="h-6 w-6" />, title: "Voice Learning", desc: "Hands-free study with voice commands.", span: "", gradient: "from-secondary to-primary" },
    { icon: <Zap className="h-6 w-6" />, title: "Instant Flashcards", desc: "Turn notes into flashcards with one click.", span: "", gradient: "from-accent to-secondary" },
];

const Features = () => {
    return (
        <section id="features" className="py-24 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-base font-semibold text-primary tracking-wide uppercase">Features</h2>
                    <p className="mt-2 text-3xl font-extrabold text-text sm:text-4xl">
                        Everything you need to <span className="text-primary">excel</span>
                    </p>
                    <p className="mt-4 text-xl text-textSecondary">
                        Brainlyx combines powerful AI tools into one seamless platform.
                    </p>
                </motion.div>

                {/* Bento grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.4, delay: i * 0.06 }}
                            className={f.span}
                        >
                            <TiltCard className="group clay rounded-3xl p-8 h-full hover:shadow-2xl transition-all duration-300">
                                <div className={`w-12 h-12 bg-gradient-to-br ${f.gradient} rounded-2xl flex items-center justify-center text-white mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold text-text mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                                <p className="text-textSecondary leading-relaxed text-sm">{f.desc}</p>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
