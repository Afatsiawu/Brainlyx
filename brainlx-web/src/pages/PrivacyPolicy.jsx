import LegalLayout from '../components/LegalLayout';

const PrivacyPolicy = () => {
    return (
        <LegalLayout title="Privacy Policy" lastUpdated="October 2026">
            <h2 className="text-xl font-bold text-text mt-6 mb-3">1. Introduction</h2>
            <p>
                Brainlyx ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information when you use our AI-powered study
                platform, including our web application and mobile app (collectively, the "Service").
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">2. Information We Collect</h2>
            <p><strong>Account Information:</strong> When you create an account, we collect your name, email address,
                username, and password (stored securely hashed). If you sign in with Google, we receive your name,
                email, and profile picture from Google.</p>
            <p><strong>Uploaded Content:</strong> Documents, audio recordings, and other files you upload to the Service
                are stored securely on our servers. We process this content using AI to generate study materials
                (flashcards, questions, summaries, podcasts).</p>
            <p><strong>Usage Data:</strong> We collect information about how you interact with the Service, including
                features used, study sessions, and performance metrics, to improve the platform and personalize
                your experience.</p>
            <p><strong>Device Information:</strong> We may collect device type, operating system, and browser type
                for compatibility and analytics purposes.</p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>To provide, maintain, and improve the Service</li>
                <li>To process your uploaded documents and generate AI-powered study materials</li>
                <li>To personalize your learning experience and study plans</li>
                <li>To communicate with you about updates, features, and support</li>
                <li>To ensure security and prevent fraud</li>
                <li>To comply with legal obligations</li>
            </ul>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">4. Data Storage and Security</h2>
            <p>
                Your data is stored on secure cloud infrastructure (Render for backend services, Supabase for database).
                We use industry-standard security measures including encryption in transit (HTTPS/TLS) and at rest.
                Passwords are hashed using secure algorithms. We do not store your payment information.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">5. Third-Party Services</h2>
            <p>We use the following third-party services to provide the Service:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google OAuth</strong> — for authentication (governed by Google's privacy policy)</li>
                <li><strong>Groq</strong> — for AI content generation (your document text is sent to Groq's API for processing)</li>
                <li><strong>Supabase</strong> — for database hosting</li>
                <li><strong>Render</strong> — for backend hosting</li>
                <li><strong>YouTube Data API</strong> — for fetching study video playlists</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your account and associated data</li>
                <li>Export your data</li>
                <li>Opt out of non-essential communications</li>
            </ul>
            <p>To exercise these rights, contact us at privacy@brainlyx.app.</p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">7. Data Retention</h2>
            <p>
                We retain your data for as long as your account is active. If you delete your account, we will
                delete your personal data and uploaded content within 30 days, except where retention is required
                by law.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">8. Children's Privacy</h2>
            <p>
                Brainlyx is not intended for children under 13. We do not knowingly collect personal information
                from children under 13. If you believe a child has provided us with personal information, please
                contact us immediately.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">9. Changes to This Policy</h2>
            <p>
                We may update this Privacy Policy from time to time. We will notify you of significant changes by
                email or through the Service. Your continued use of the Service after changes constitutes acceptance.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">10. Contact Us</h2>
            <p>
                If you have questions about this Privacy Policy, contact us at{' '}
                <a href="mailto:privacy@brainlyx.app" className="text-primary hover:underline">privacy@brainlyx.app</a>.
            </p>
        </LegalLayout>
    );
};

export default PrivacyPolicy;
