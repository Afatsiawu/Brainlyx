import { Star } from 'lucide-react';
import { TiltCard } from './ThreeDElements';

const testimonials = [
    {
        name: 'Amara Osei',
        role: 'Medical Student',
        quote:
            'Brainlyx cut my revision time in half. The AI flashcards from my lecture recordings are scary accurate.',
        initials: 'AO',
        color: 'bg-primary',
    },
    {
        name: 'Daniel Reyes',
        role: 'Computer Science Major',
        quote:
            'The study planner actually keeps up with my deadlines. I walked into finals feeling prepared for the first time.',
        initials: 'DR',
        color: 'bg-secondary',
    },
    {
        name: 'Priya Nair',
        role: 'High School Senior',
        quote:
            'I record every lecture, and by the time I get home the summary and quiz questions are already waiting for me.',
        initials: 'PN',
        color: 'bg-accent',
    },
];

const Testimonials = () => {
    return (
        <section id="testimonials" className="py-24 bg-white scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-base font-semibold text-primary tracking-wide uppercase">Testimonials</h2>
                    <p className="mt-2 text-3xl font-extrabold text-text sm:text-4xl">
                        Loved by students <span className="text-primary">everywhere</span>
                    </p>
                    <p className="mt-4 text-xl text-textSecondary">
                        See how Brainlyx is changing the way people study.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t) => (
                        <TiltCard
                            key={t.name}
                            className="group relative p-8 bg-background rounded-3xl border border-gray-100 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                        >
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                                ))}
                            </div>
                            <p className="text-text leading-relaxed mb-8">"{t.quote}"</p>
                            <div className="flex items-center gap-3">
                                <div className={`w-11 h-11 rounded-full ${t.color} flex items-center justify-center text-white font-bold`}>
                                    {t.initials}
                                </div>
                                <div>
                                    <div className="font-semibold text-text">{t.name}</div>
                                    <div className="text-sm text-textSecondary">{t.role}</div>
                                </div>
                            </div>
                        </TiltCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
