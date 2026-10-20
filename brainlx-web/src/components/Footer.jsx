import { Brain, Github } from 'lucide-react';
import { ClayChip } from './ClayElements';

const Footer = () => {
    return (
        <footer className="bg-surface border-t border-border pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <ClayChip variant="primary" className="rounded-xl p-1.5">
                                <Brain className="h-5 w-5 text-primary" />
                            </ClayChip>
                            <span className="font-bold text-xl text-text">Brainlyx</span>
                        </div>
                        <p className="text-textSecondary text-sm leading-relaxed">
                            Empowering students with AI-driven tools for smarter, faster, and more effective learning.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-text mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#features" className="text-textSecondary hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#waitlist" className="text-textSecondary hover:text-primary transition-colors">Download</a></li>
                            <li className="text-textSecondary">Pricing</li>
                            <li className="text-textSecondary">Updates</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-text mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            {['Blog', 'Community', 'Help Center', 'API Docs'].map((item) => (
                                <li key={item} className="text-textSecondary">{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-text mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                                <li key={item} className="text-textSecondary">{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-textSecondary">
                        © {new Date().getFullYear()} Brainlyx Inc. All rights reserved.
                    </p>

                    <div className="flex space-x-4">
                        <a
                            href="https://github.com/Afatsiawu/brainlyx"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="clay-chip rounded-full p-2.5 text-textSecondary hover:text-primary"
                            aria-label="GitHub"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                        <span className="clay-chip rounded-full p-2.5 text-textSecondary" aria-label="Twitter (coming soon)">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </span>
                        <span className="clay-chip rounded-full p-2.5 text-textSecondary" aria-label="LinkedIn (coming soon)">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
