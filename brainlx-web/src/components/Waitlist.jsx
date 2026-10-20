import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Mail, Send } from 'lucide-react';
import api from '../services/api';

const Waitlist = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || status === 'loading') return;

        setStatus('loading');
        setMessage('');
        try {
            const res = await api.joinWaitlist(email);
            setStatus('success');
            setMessage(res.message || "You're on the list!");
            setEmail('');
        } catch (err) {
            setStatus('error');
            setMessage(err.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <section id="waitlist" className="py-24 bg-background scroll-mt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent p-[1px] shadow-2xl"
                >
                    <div className="rounded-3xl bg-white px-6 py-12 sm:px-12 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6">
                            <Mail className="h-7 w-7" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-text sm:text-4xl">
                            Get early access to Brainlyx
                        </h2>
                        <p className="mt-4 text-lg text-textSecondary max-w-xl mx-auto">
                            Join the waitlist and be the first to know when we launch. No spam, ever.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                                className="flex-1 px-5 py-3.5 rounded-xl border border-gray-200 bg-background text-text placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {status === 'loading' ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Notify Me
                                        <Send className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-4 min-h-[1.5rem]">
                            <AnimatePresence mode="wait">
                                {status === 'success' && (
                                    <motion.p
                                        key="success"
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center justify-center gap-2 text-success font-medium"
                                    >
                                        <CheckCircle2 className="h-5 w-5" />
                                        {message}
                                    </motion.p>
                                )}
                                {status === 'error' && (
                                    <motion.p
                                        key="error"
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-error font-medium"
                                    >
                                        {message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Waitlist;
