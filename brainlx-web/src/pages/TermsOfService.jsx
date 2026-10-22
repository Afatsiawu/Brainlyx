import LegalLayout from '../components/LegalLayout';

const TermsOfService = () => {
    return (
        <LegalLayout title="Terms of Service" lastUpdated="October 2026">
            <h2 className="text-xl font-bold text-text mt-6 mb-3">1. Acceptance of Terms</h2>
            <p>
                By accessing or using Brainlyx ("the Service"), you agree to be bound by these Terms of Service.
                If you do not agree, please do not use the Service.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">2. Description of Service</h2>
            <p>
                Brainlyx is an AI-powered study platform that helps students analyze documents, record lectures,
                generate flashcards, create study plans, and access AI tutoring. The Service is provided "as is"
                and may be updated, modified, or discontinued at any time.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">3. User Accounts</h2>
            <p>
                You must create an account to use certain features. You are responsible for maintaining the
                confidentiality of your account credentials and for all activities under your account. You must
                provide accurate information and keep it updated. You must be at least 13 years old to use the Service.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for any unlawful purpose</li>
                <li>Upload content that infringes on intellectual property rights</li>
                <li>Attempt to gain unauthorized access to the Service or its systems</li>
                <li>Use the Service to generate harmful, misleading, or deceptive content</li>
                <li>Abuse, harass, or interfere with other users</li>
                <li>Upload malicious files or attempt to exploit the Service</li>
                <li>Share your account credentials with others</li>
            </ul>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">5. Uploaded Content</h2>
            <p>
                You retain ownership of content you upload. By uploading content, you grant Brainlyx a
                non-exclusive, worldwide license to process, store, and analyze that content to provide the Service.
                You are responsible for ensuring you have the right to upload any content.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">6. AI-Generated Content</h2>
            <p>
                Brainlyx uses AI to generate study materials, summaries, flashcards, questions, and other content.
                AI-generated content may contain errors or inaccuracies. You should verify important information
                independently. Brainlyx is not liable for decisions made based on AI-generated content.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">7. Intellectual Property</h2>
            <p>
                The Service, including its design, code, and branding, is owned by Brainlyx Inc. and protected by
                intellectual property laws. You may not copy, modify, or distribute the Service without permission.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">8. Subscription and Payments</h2>
            <p>
                Certain features may require a paid subscription. Subscription fees are billed in advance and are
                non-refundable except as required by law. You may cancel your subscription at any time, and access
                continues until the end of the billing period.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">9. Limitation of Liability</h2>
            <p>
                To the maximum extent permitted by law, Brainlyx shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages arising from your use of the Service. Our total liability
                shall not exceed the amount you paid for the Service in the 12 months preceding the claim.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">10. Termination</h2>
            <p>
                We may terminate or suspend your account at any time for violation of these Terms. You may delete
                your account at any time through the app settings. Upon termination, your right to use the Service
                ceases immediately.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">11. Governing Law</h2>
            <p>
                These Terms are governed by the laws of the jurisdiction in which Brainlyx operates. Any disputes
                shall be resolved through binding arbitration or in the courts of that jurisdiction.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">12. Contact</h2>
            <p>
                For questions about these Terms, contact us at{' '}
                <a href="mailto:legal@brainlyx.app" className="text-primary hover:underline">legal@brainlyx.app</a>.
            </p>
        </LegalLayout>
    );
};

export default TermsOfService;
