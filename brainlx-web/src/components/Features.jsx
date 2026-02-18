import { Brain, Calendar, FileText, Mic, Video, Zap } from 'lucide-react';

const features = [
    {
        icon: <FileText className="h-6 w-6" />,
        title: "Smart Document Analysis",
        description: "Upload PDFs or documents and let our AI summarize, extract key points, and answer your questions instantly."
    },
    {
        icon: <Video className="h-6 w-6" />,
        title: "Lecture Recording & Transcription",
        description: "Record your lectures and get accurate transcriptions with key takeaways automatically generated."
    },
    {
        icon: <Brain className="h-6 w-6" />,
        title: "AI Study Assistant",
        description: "Your personal tutor available 24/7 to explain complex topics, solve problems, and quiz your knowledge."
    },
    {
        icon: <Calendar className="h-6 w-6" />,
        title: "Personalized Study Plans",
        description: "Get adaptive study schedules generated based on your goals, deadlines, and learning pace."
    },
    {
        icon: <Mic className="h-6 w-6" />,
        title: "Voice-Activated Learning",
        description: "Interact with the app using voice commands for a hands-free study experience."
    },
    {
        icon: <Zap className="h-6 w-6" />,
        title: "Instant Flashcards",
        description: "Turn your notes and readings into study flashcards with a single click."
    }
];

const Features = () => {
    return (
        <section id="features" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-base font-semibold text-primary tracking-wide uppercase">Features</h2>
                    <p className="mt-2 text-3xl font-extrabold text-text sm:text-4xl">
                        Everything you need to <span className="text-primary">excel</span>
                    </p>
                    <p className="mt-4 text-xl text-textSecondary">
                        Brainlyx combines powerful AI tools into one seamless platform to supercharge your learning.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative p-8 bg-background rounded-3xl border border-gray-100 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-3xl" />

                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform duration-300">
                                <div className="text-primary group-hover:text-secondary transition-colors">
                                    {feature.icon}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-text mb-3 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-textSecondary leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
