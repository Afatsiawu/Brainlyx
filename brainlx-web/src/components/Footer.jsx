import { Link } from 'react-router-dom';
import { Github, Mail, ArrowRight } from 'lucide-react';
import { ClayChip } from './ClayElements';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top: logo + newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/logo.png" alt="Brainlyx" className="w-10 h-10 rounded-xl object-cover shadow-md" />
                            <span className="font-bold text-2xl text-text">Brainlyx</span>
                        </div>
                        <p className="text-textSecondary text-sm leading-relaxed max-w-md">
                            Empowering students with AI-driven tools for smarter, faster, and more effective learning.
                        </p>
                    </div>

                    <div className="clay rounded-3xl p-8">
                        <h4 className="font-bold text-text mb-2">Stay in the loop</h4>
                        <p className="text-textSecondary text-sm mb-4">Get product updates, study tips, and early access news.</p>
                        <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="clay-input flex-1 px-4 py-3 text-sm text-text placeholder:text-textSecondary"
                            />
                            <button type="submit" className="clay-btn clay-btn-primary px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Link columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h4 className="font-bold text-text mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/features" className="text-textSecondary hover:text-primary transition-colors">Features</Link></li>
                            <li><Link to="/pricing" className="text-textSecondary hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link to="/download" className="text-textSecondary hover:text-primary transition-colors">Download</Link></li>
                            <li><Link to="/updates" className="text-textSecondary hover:text-primary transition-colors">Updates</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-text mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/blog" className="text-textSecondary hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link to="/community" className="text-textSecondary hover:text-primary transition-colors">Community</Link></li>
                            <li><Link to="/help" className="text-textSecondary hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link to="/api-docs" className="text-textSecondary hover:text-primary transition-colors">API Docs</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-text mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/privacy" className="text-textSecondary hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-textSecondary hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link to="/cookies" className="text-textSecondary hover:text-primary transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-text mb-4">Connect</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="mailto:hello@brainlyx.app" className="text-textSecondary hover:text-primary transition-colors">Contact Us</a></li>
                            <li><a href="https://github.com/Afatsiawu/brainlyx" target="_blank" rel="noopener noreferrer" className="text-textSecondary hover:text-primary transition-colors">GitHub</a></li>
                            <li><a href="#" className="text-textSecondary hover:text-primary transition-colors">Twitter</a></li>
                            <li><a href="#" className="text-textSecondary hover:text-primary transition-colors">LinkedIn</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-textSecondary">
                        © {new Date().getFullYear()} Brainlyx Inc. All rights reserved.
                    </p>

                    <div className="flex space-x-4">
                        <a href="https://github.com/Afatsiawu/brainlyx" target="_blank" rel="noopener noreferrer" className="clay-chip rounded-full p-2.5 text-textSecondary hover:text-primary" aria-label="GitHub">
                            <Github className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
