import { Brain, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ClayButton, ClayChip } from './ClayElements';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const scrollToId = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
    };

    return (
        <nav className="fixed top-3 sm:top-5 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:max-w-6xl sm:w-full z-50">
            <div className="clay rounded-[1.75rem] px-4 sm:px-5 py-2 flex justify-between h-16 items-center">
                <div className="flex-shrink-0 flex items-center gap-2">
                    <a href="#top" onClick={(e) => { e.preventDefault(); scrollToId('top'); }} className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                            <Brain className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-text">Brainlyx</span>
                    </a>
                </div>

                <div className="hidden md:flex items-center space-x-8">
                    <a href="#features" className="text-textSecondary hover:text-primary transition-colors">Features</a>
                    <a href="#how-it-works" className="text-textSecondary hover:text-primary transition-colors">How it Works</a>
                    <a href="#testimonials" className="text-textSecondary hover:text-primary transition-colors">Testimonials</a>
                    <ClayButton
                        variant="primary"
                        onClick={() => scrollToId('waitlist')}
                        className="px-6 py-2.5 rounded-full font-medium text-sm"
                    >
                        Get Started
                    </ClayButton>
                </div>

                <div className="md:hidden flex items-center">
                    <button onClick={toggleMenu} className="clay-chip rounded-xl p-2 text-textSecondary hover:text-primary" aria-label="Toggle menu">
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="clay rounded-[1.75rem] mt-2 px-4 pt-2 pb-6 space-y-2">
                    <a href="#features" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-textSecondary hover:text-primary hover:bg-primary/5 rounded-xl">Features</a>
                    <a href="#how-it-works" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-textSecondary hover:text-primary hover:bg-primary/5 rounded-xl">How it Works</a>
                    <a href="#testimonials" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-textSecondary hover:text-primary hover:bg-primary/5 rounded-xl">Testimonials</a>
                    <div className="pt-4">
                        <ClayButton
                            variant="primary"
                            onClick={() => scrollToId('waitlist')}
                            className="w-full px-6 py-3.5 rounded-2xl font-semibold"
                        >
                            Get Started
                        </ClayButton>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;