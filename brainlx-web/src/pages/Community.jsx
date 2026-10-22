import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Heart, Star, ArrowRight, Zap } from 'lucide-react';

const Community = () => {
    return (
        <PageLayout title="Community" subtitle="Connect with fellow students, share tips, and learn together." accent="accent">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {[
                    { icon: <Users className="h-8 w-8" />, title: "Study Groups", desc: "Join or create study groups with peers who share your courses and goals.", count: "2,400+ groups" },
                    { icon: <MessageCircle className="h-8 w-8" />, title: "Discussion Forums", desc: "Ask questions, share insights, and get help from the community.", count: "15,000+ posts" },
                    { icon: <Heart className="h-8 w-8" />, title: "Share Resources", desc: "Share your study materials, flashcards, and notes with others.", count: "8,000+ resources" },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                        <div className="clay rounded-3xl p-8 text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-text mb-2">{item.title}</h3>
                            <p className="text-textSecondary text-sm mb-4">{item.desc}</p>
                            <span className="text-xs font-bold text-primary">{item.count}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="clay rounded-3xl p-10 text-center">
                <h2 className="text-2xl font-bold text-text mb-4">Join the Brainlyx Community</h2>
                <p className="text-textSecondary mb-6 max-w-xl mx-auto">
                    Connect with thousands of students worldwide. Share study tips, collaborate on projects, and grow together.
                </p>
                <button className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                    Join Community
                </button>
            </div>
        </PageLayout>
    );
};

export default Community;
