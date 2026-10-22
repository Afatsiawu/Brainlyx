import PageLayout from '../components/PageLayout';
import { Code, Key, Zap, Shield, Terminal, BookOpen, ArrowRight } from 'lucide-react';

const endpoints = [
    { method: 'POST', path: '/api/v1/auth/signup', desc: 'Create a new user account' },
    { method: 'POST', path: '/api/v1/auth/login', desc: 'Authenticate and get a token' },
    { method: 'POST', path: '/api/v1/auth/google', desc: 'Google OAuth login' },
    { method: 'GET', path: '/api/v1/documents', desc: 'List all documents' },
    { method: 'POST', path: '/api/v1/documents/upload', desc: 'Upload a document (PDF, DOCX, TXT)' },
    { method: 'GET', path: '/api/v1/documents/:id', desc: 'Get document details' },
    { method: 'DELETE', path: '/api/v1/documents/:id', desc: 'Delete a document' },
    { method: 'POST', path: '/api/v1/study/generate-by-topic', desc: 'Generate flashcards from a topic' },
    { method: 'POST', path: '/api/v1/study/generate-topic', desc: 'Generate exam questions from a topic' },
    { method: 'POST', path: '/api/v1/study/generate-podcast-by-topic', desc: 'Generate a podcast script from a topic' },
    { method: 'POST', path: '/api/v1/study/stress-tester-by-topic', desc: 'Stress-test a topic for weaknesses' },
    { method: 'POST', path: '/api/v1/study/knowledge-mesh', desc: 'Find connections across all documents' },
    { method: 'POST', path: '/api/v1/ai/chat', desc: 'Chat with the AI study assistant' },
    { method: 'GET', path: '/api/v1/music/playlists', desc: 'Search YouTube study playlists' },
    { method: 'GET', path: '/api/v1/health', desc: 'Health check' },
];

const methodColors = {
    GET: 'bg-success/10 text-success',
    POST: 'bg-primary/10 text-primary',
    DELETE: 'bg-error/10 text-error',
    PUT: 'bg-warning/10 text-warning',
};

const APIDocs = () => {
    return (
        <PageLayout title="API Docs" subtitle="Integrate Brainlyx into your own applications." accent="accent">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                {[
                    { icon: <Key className="h-7 w-7" />, title: "Authentication", desc: "Bearer token auth via JWT. Google OAuth supported." },
                    { icon: <Zap className="h-7 w-7" />, title: "Rate Limits", desc: "100 requests/min for free tier. Higher limits on Pro." },
                    { icon: <Shield className="h-7 w-7" />, title: "Security", desc: "HTTPS only. CORS enabled. Input validation on all endpoints." },
                ].map((item, i) => (
                    <div key={i} className="clay rounded-3xl p-8 text-center">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                            {item.icon}
                        </div>
                        <h3 className="text-lg font-bold text-text mb-2">{item.title}</h3>
                        <p className="text-textSecondary text-sm">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="clay rounded-3xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
                    <Terminal className="h-6 w-6 text-primary" />
                    Base URL
                </h2>
                <code className="block bg-gray-900 text-green-400 px-6 py-4 rounded-2xl font-mono text-sm overflow-x-auto">
                    https://brainlyx.onrender.com/api/v1
                </code>
            </div>

            <div className="clay rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-text mb-6 flex items-center gap-2">
                    <Code className="h-6 w-6 text-primary" />
                    Endpoints
                </h2>
                <div className="space-y-2">
                    {endpoints.map((ep, i) => (
                        <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg w-16 text-center ${methodColors[ep.method]}`}>
                                {ep.method}
                            </span>
                            <code className="text-sm font-mono text-text flex-1">{ep.path}</code>
                            <span className="text-sm text-textSecondary hidden md:block">{ep.desc}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-12 text-center">
                <p className="text-textSecondary mb-4">Need help integrating? Reach out to our team.</p>
                <a href="mailto:api@brainlyx.app" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                    Contact API Support <ArrowRight className="h-4 w-4" />
                </a>
            </div>
        </PageLayout>
    );
};

export default APIDocs;
