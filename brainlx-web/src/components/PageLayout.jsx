import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain } from 'lucide-react';

const PageLayout = ({ title, subtitle, accent = 'primary', children }) => {
    const accentGradients = {
        primary: 'from-primary/20 via-secondary/10 to-accent/20',
        secondary: 'from-secondary/20 via-accent/10 to-primary/20',
        accent: 'from-accent/20 via-primary/10 to-secondary/20',
    };

    return (
        <div className="min-h-screen bg-background font-sans text-text selection:bg-primary/20 selection:text-primary">
            {/* Top bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <Brain className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-xl text-text">Brainlyx</span>
                    </Link>
                    <Link to="/" className="text-textSecondary hover:text-primary transition-colors text-sm font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </div>

            {/* Hero */}
            <section className={`relative pt-32 pb-20 overflow-hidden bg-gradient-to-br ${accentGradients[accent]}`}>
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/40 rounded-full px-4 py-1.5 mb-6 shadow-sm">
                            <Brain className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-textSecondary">Brainlyx</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-text mb-4 leading-[1.05]">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-xl md:text-2xl text-textSecondary max-w-2xl leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </motion.div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {children}
            </main>
        </div>
    );
};

export default PageLayout;
