import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Zap, Shield, Globe, Users } from 'lucide-react';
import { TiltCard } from '../components/ThreeDElements';

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: 'forever',
        desc: 'Perfect for getting started',
        features: ['5 documents/month', 'Basic AI summaries', '50 flashcards/month', 'Community support'],
        cta: 'Get Started Free',
        popular: false,
    },
    {
        name: 'Pro',
        price: '$9',
        period: '/month',
        desc: 'For serious students',
        features: ['Unlimited documents', 'Advanced AI analysis', 'Unlimited flashcards & questions', 'Podcast generation', 'Priority support', 'Export to PDF'],
        cta: 'Start Pro Trial',
        popular: true,
    },
    {
        name: 'Team',
        price: '$29',
        period: '/month',
        desc: 'For study groups',
        features: ['Everything in Pro', 'Shared notebooks', 'Collaborative study plans', 'Admin dashboard', 'Dedicated support', 'API access'],
        cta: 'Contact Sales',
        popular: false,
    },
];

const Pricing = () => {
    return (
        <PageLayout title="Pricing" subtitle="Simple, transparent pricing. No hidden fees." accent="secondary">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {plans.map((plan, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                        <TiltCard className={`relative p-8 rounded-3xl border transition-all h-full flex flex-col ${plan.popular ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/30 scale-105' : 'bg-white border-gray-100 hover:shadow-xl'}`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                    MOST POPULAR
                                </div>
                            )}
                            <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-text'}`}>{plan.name}</h3>
                            <p className={`text-sm mb-6 ${plan.popular ? 'text-white/80' : 'text-textSecondary'}`}>{plan.desc}</p>
                            <div className="mb-6">
                                <span className="text-5xl font-black">{plan.price}</span>
                                <span className={`text-sm ${plan.popular ? 'text-white/70' : 'text-textSecondary'}`}>{plan.period}</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className={`h-4 w-4 ${plan.popular ? 'text-accent' : 'text-success'}`} />
                                        <span className={plan.popular ? 'text-white/90' : 'text-textSecondary'}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-3.5 rounded-xl font-bold transition-all ${plan.popular ? 'bg-white text-primary hover:bg-gray-100' : 'bg-primary text-white hover:bg-opacity-90'} shadow-lg`}>
                                {plan.cta}
                            </button>
                        </TiltCard>
                    </motion.div>
                ))}
            </div>

            <div className="mt-20 text-center">
                <p className="text-textSecondary">All plans include a 14-day free trial. No credit card required.</p>
            </div>
        </PageLayout>
    );
};

export default Pricing;
