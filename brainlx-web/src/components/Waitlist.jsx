import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Mail, Send } from 'lucide-react';
import api from '../services/api';
import { ClayButton, ClayChip } from './ClayElements';

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
        <section id="waitlist" className="py-24 scroll-mt-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="clay rounded-[2.5rem] px-6 py-12 sm:px-12 text-center"
                >
                    <ClayChip variant="primary" className="rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-6">
                        <Mail className="h-7 w-7 text-primary" />
                    </ClayChip>
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
                            className="clay-input flex-1 px-5 py-3.5 text-text placeholder:text-textSecondary"
                        />
                        <ClayButton
                            variant="primary"
                            type="submit"
                            disabled={status === 'loading'}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Notify Me
                                    <Send className="h-4 w-4" />
                                </>
                            )}
                        </ClayButton>
                    </form>

                    <div className="mt-4 min-h-[1.5rem]">
                        <AnimatePresence mode="wait">
                            {status === 'success' && (
                                <motion.p
                                    key="success"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="inline-flex items-center gap-2 text-success font-medium"
                                >
                                    <span className="clay-chip rounded-full px-2 py-1 inline-flex items-center gap-2 text-success text-sm">
                                        <CheckCircle2 className="h-4 w-4" />
                                        {message}
                                    </span>
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
                </motion.div>
            </div>
        </section>
    );
};

export default Waitlist;
