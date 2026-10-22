import { Link } from 'react-router-dom';
import { ClayCard } from './ClayElements';

const LegalLayout = ({ title, lastUpdated, children }) => {
    return (
        <div className="min-h-screen bg-background font-sans text-text">
            {/* Top bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="Brainlyx" className="w-8 h-8 rounded-lg object-cover" />
                        <span className="font-bold text-xl text-text">Brainlyx</span>
                    </Link>
                    <Link to="/" className="text-textSecondary hover:text-primary transition-colors text-sm font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                <ClayCard className="p-8 sm:p-12">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-text mb-2">{title}</h1>
                    <p className="text-sm text-textSecondary mb-8">Last updated: {lastUpdated}</p>
                    <div className="prose prose-gray max-w-none text-textSecondary leading-relaxed space-y-6">
                        {children}
                    </div>
                </ClayCard>
            </main>
        </div>
    );
};

export default LegalLayout;
