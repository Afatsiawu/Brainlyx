import { Brain, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Brain className="h-6 w-6 text-primary" />
                        </div>
                        <span className="font-bold text-xl text-text">Brainlyx</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-textSecondary hover:text-primary transition-colors">Features</a>
                        <a href="#how-it-works" className="text-textSecondary hover:text-primary transition-colors">How it Works</a>
                        <a href="#testimonials" className="text-textSecondary hover:text-primary transition-colors">Testimonials</a>
                        <button className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20">
                            Get Started
                        </button>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-textSecondary hover:text-primary">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden absolute w-full bg-white border-b border-gray-100 animate-in slide-in-from-top-5">
                    <div className="px-4 pt-2 pb-6 space-y-2 shadow-xl">
                        <a href="#features" className="block px-3 py-2 text-base font-medium text-textSecondary hover:text-primary hover:bg-gray-50 rounded-md">Features</a>
                        <a href="#how-it-works" className="block px-3 py-2 text-base font-medium text-textSecondary hover:text-primary hover:bg-gray-50 rounded-md">How it Works</a>
                        <a href="#testimonials" className="block px-3 py-2 text-base font-medium text-textSecondary hover:text-primary hover:bg-gray-50 rounded-md">Testimonials</a>
                        <div className="pt-4">
                            <button className="w-full bg-primary text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-primary/20">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
