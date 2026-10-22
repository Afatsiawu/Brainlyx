import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';
import { Smartphone, Apple, Play, Download as DownloadIcon, Star, Zap, Shield, ArrowRight } from 'lucide-react';
import { TiltCard } from '../components/ThreeDElements';

const Download = () => {
    return (
        <PageLayout title="Download" subtitle="Get Brainlyx on your device and start studying smarter today." accent="accent">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* iOS */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                    <TiltCard className="clay rounded-3xl p-10 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                            <Apple className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-text mb-2">iOS</h3>
                        <p className="text-textSecondary mb-6">iPhone & iPad</p>
                        <button className="w-full bg-text text-white py-3.5 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
                            <DownloadIcon className="h-5 w-5" />
                            Download on App Store
                        </button>
                        <p className="text-xs text-textSecondary mt-4">Requires iOS 15.0 or later</p>
                    </TiltCard>
                </motion.div>

                {/* Android */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
                    <TiltCard className="clay rounded-3xl p-10 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                            <Play className="h-10 w-10 text-white fill-current" />
                        </div>
                        <h3 className="text-2xl font-bold text-text mb-2">Android</h3>
                        <p className="text-textSecondary mb-6">Phone & Tablet</p>
                        <button className="w-full bg-text text-white py-3.5 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2">
                            <DownloadIcon className="h-5 w-5" />
                            Get it on Google Play
                        </button>
                        <p className="text-xs text-textSecondary mt-4">Requires Android 8.0 or later</p>
                    </TiltCard>
                </motion.div>
            </div>

            <div className="mt-16 text-center">
                <p className="text-textSecondary mb-4">Or try the web version right now — no download needed.</p>
                <a href="/" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                    Open Web App <ArrowRight className="h-4 w-4" />
                </a>
            </div>
        </PageLayout>
    );
};

export default Download;
