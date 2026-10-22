import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, User, ArrowRight, Search } from 'lucide-react';

const posts = [
    { title: "How AI is Transforming Study Habits", author: "Brainlyx Team", date: "Oct 12, 2026", excerpt: "Discover how students are using AI tools to study smarter, not harder. From automated flashcards to personalized study plans, the future of learning is here.", category: "AI & Learning" },
    { title: "5 Tips for Effective Lecture Recording", author: "Brainlyx Team", date: "Oct 8, 2026", excerpt: "Recording lectures is only half the battle. Learn how to get the most out of your recordings with AI transcription and summarization.", category: "Study Tips" },
    { title: "The Science of Spaced Repetition", author: "Brainlyx Team", date: "Oct 3, 2026", excerpt: "Why spaced repetition works and how Brainlyx's flashcard system implements it automatically for better retention.", category: "Learning Science" },
    { title: "Building a Study Routine That Sticks", author: "Brainlyx Team", date: "Sep 28, 2026", excerpt: "Consistency beats intensity. Learn how to build sustainable study habits with adaptive scheduling.", category: "Productivity" },
];

const Blog = () => {
    return (
        <PageLayout title="Blog" subtitle="Insights, tips, and updates from the Brainlyx team." accent="secondary">
            <div className="max-w-3xl mx-auto mb-12">
                <div className="clay rounded-2xl flex items-center gap-3 px-5 py-3.5">
                    <Search className="h-5 w-5 text-textSecondary" />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        className="flex-1 bg-transparent outline-none text-text placeholder:text-textSecondary"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post, i) => (
                    <motion.article
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="clay rounded-3xl p-8 flex flex-col"
                    >
                        <span className="text-xs font-bold text-primary mb-3">{post.category}</span>
                        <h2 className="text-xl font-bold text-text mb-3 leading-tight">{post.title}</h2>
                        <p className="text-textSecondary leading-relaxed flex-1 mb-6">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-sm text-textSecondary">
                            <span className="flex items-center gap-1.5">
                                <User className="h-4 w-4" />
                                {post.author}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {post.date}
                            </span>
                        </div>
                    </motion.article>
                ))}
            </div>
        </PageLayout>
    );
};

export default Blog;
