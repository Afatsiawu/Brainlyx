import { FileText, Brain, Calendar } from 'lucide-react';
import { TiltCard } from './ThreeDElements';

const steps = [
    {
        icon: <FileText className="h-7 w-7" />,
        step: '01',
        title: 'Upload your material',
        description: 'Drop in PDFs, lecture recordings, or notes — Brainlyx ingests them instantly.',
    },
    {
        icon: <Brain className="h-7 w-7" />,
        step: '02',
        title: 'AI analyzes everything',
        description: 'Our AI summarizes, extracts key concepts, and builds flashcards and questions automatically.',
    },
    {
        icon: <Calendar className="h-7 w-7" />,
        step: '03',
        title: 'Study your way',
        description: 'Follow a personalized study plan, quiz yourself, and track progress as your understanding grows.',
    },
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 bg-background scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-base font-semibold text-primary tracking-wide uppercase">How it Works</h2>
                    <p className="mt-2 text-3xl font-extrabold text-text sm:text-4xl">
                        From notes to knowledge in <span className="text-primary">three steps</span>
                    </p>
                    <p className="mt-4 text-xl text-textSecondary">
                        No setup, no learning curve — just upload and start studying smarter.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((item) => (
                        <TiltCard
                            key={item.step}
                            className="group relative p-8 bg-white rounded-3xl border border-gray-100 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                    {item.icon}
                                </div>
                                <span className="text-4xl font-black text-gray-100 group-hover:text-primary/10 transition-colors">
                                    {item.step}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-text mb-3">{item.title}</h3>
                            <p className="text-textSecondary leading-relaxed">{item.description}</p>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
