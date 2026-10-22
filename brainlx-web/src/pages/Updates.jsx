import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';
import { Zap, Bug, Plus, ArrowRight } from 'lucide-react';

const updates = [
    { version: 'v1.2.0', date: 'Oct 16, 2026', type: 'feature', title: 'Claymorphism Design Overhaul', body: 'Complete visual redesign with soft, puffy clay-style cards, buttons, and inputs across web and app. New color palette and typography (Nunito).' },
    { version: 'v1.1.5', date: 'Oct 14, 2026', type: 'feature', title: 'Podcast Generation', body: 'Turn any document or topic into a two-host AI podcast. Play, pause, skip, and download the script.' },
    { version: 'v1.1.0', date: 'Oct 10, 2026', type: 'feature', title: 'Stress Tester & Knowledge Mesh', body: 'New AI features: stress-test your sources for weaknesses, and find connections across all your documents.' },
    { version: 'v1.0.5', date: 'Oct 5, 2026', type: 'improvement', title: 'Performance & Stability', body: 'Fixed Reanimated web crashes, improved upload reliability, and optimized bundle sizes.' },
    { version: 'v1.0.0', date: 'Sep 28, 2026', type: 'feature', title: 'Initial Launch', body: 'Brainlyx is live! Smart document analysis, lecture recording, AI study assistant, and personalized study plans.' },
];

const typeColors = {
    feature: 'bg-primary/10 text-primary',
    improvement: 'bg-success/10 text-success',
    fix: 'bg-warning/10 text-warning',
};

const Updates = () => {
    return (
        <PageLayout title="Updates" subtitle="What's new in Brainlyx. Changelog and release notes." accent="accent">
            <div className="max-w-3xl mx-auto space-y-8">
                {updates.map((u, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="clay rounded-3xl p-8"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${typeColors[u.type]}`}>{u.type.toUpperCase()}</span>
                            <span className="text-sm text-textSecondary">{u.date}</span>
                            <span className="text-xs font-mono text-textSecondary ml-auto">{u.version}</span>
                        </div>
                        <h3 className="text-xl font-bold text-text mb-2">{u.title}</h3>
                        <p className="text-textSecondary leading-relaxed">{u.body}</p>
                    </motion.div>
                ))}
            </div>
        </PageLayout>
    );
};

export default Updates;
