import { Brain, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Brain className="h-6 w-6 text-primary" />
                            </div>
                            <span className="font-bold text-xl text-text">Brainlyx</span>
                        </div>
                        <p className="text-textSecondary text-sm leading-relaxed">
                            Empowering students with AI-driven tools for smarter, faster, and more effective learning.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-text mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-textSecondary">
                            <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Download</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Updates</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-text mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-textSecondary">
                            <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-text mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-textSecondary">
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-textSecondary">
                        © {new Date().getFullYear()} Brainlyx Inc. All rights reserved.
                    </p>

                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                            <span className="sr-only">Twitter</span>
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                            <span className="sr-only">GitHub</span>
                            <Github className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                            <span className="sr-only">LinkedIn</span>
                            <Linkedin className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
