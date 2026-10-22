import { LegalScreen, Paragraph, Section, BulletList } from '@/components/ui/LegalScreen';
import React from 'react';
import { Text } from 'react-native';

export default function PrivacyPolicyScreen() {
    return (
        <LegalScreen title="Privacy Policy" lastUpdated="October 2026">
            <Section title="1. Introduction">
                <Paragraph>
                    Brainlyx (“we”, “our”, or “us”) is committed to protecting your privacy. This Privacy Policy explains
                    how we collect, use, disclose, and safeguard your information when you use our AI-powered study
                    platform, including our mobile app and web application (collectively, the “Service”).
                </Paragraph>
            </Section>

            <Section title="2. Information We Collect">
                <Paragraph><Text style={{ fontWeight: '700' }}>Account Information:</Text> When you create an account, we collect your name, email address, username, and password (stored securely hashed). If you sign in with Google, we receive your name, email, and profile picture from Google.</Paragraph>
                <Paragraph><Text style={{ fontWeight: '700' }}>Uploaded Content:</Text> Documents, audio recordings, and other files you upload are stored securely on our servers. We process this content using AI to generate study materials (flashcards, questions, summaries, podcasts).</Paragraph>
                <Paragraph><Text style={{ fontWeight: '700' }}>Usage Data:</Text> We collect information about how you interact with the Service, including features used, study sessions, and performance metrics, to improve the platform.</Paragraph>
                <Paragraph><Text style={{ fontWeight: '700' }}>Device Information:</Text> We may collect device type, operating system, and browser type for compatibility and analytics.</Paragraph>
            </Section>

            <Section title="3. How We Use Your Information">
                <BulletList items={[
                    'To provide, maintain, and improve the Service',
                    'To process your uploaded documents and generate AI-powered study materials',
                    'To personalize your learning experience and study plans',
                    'To communicate with you about updates, features, and support',
                    'To ensure security and prevent fraud',
                    'To comply with legal obligations',
                ]} />
            </Section>

            <Section title="4. Data Storage and Security">
                <Paragraph>
                    Your data is stored on secure cloud infrastructure (Render for backend, Supabase for database).
                    We use industry-standard security measures including encryption in transit (HTTPS/TLS) and at rest.
                    Passwords are hashed using secure algorithms. We do not store payment information.
                </Paragraph>
            </Section>

            <Section title="5. Third-Party Services">
                <Paragraph>We use the following third-party services:</Paragraph>
                <BulletList items={[
                    'Google OAuth — for authentication (governed by Google\'s privacy policy)',
                    'Groq — for AI content generation (document text is sent to Groq\'s API)',
                    'Supabase — for database hosting',
                    'Render — for backend hosting',
                    'YouTube Data API — for fetching study video playlists',
                ]} />
                <Paragraph>We do not sell your personal information to third parties.</Paragraph>
            </Section>

            <Section title="6. Your Rights">
                <Paragraph>You have the right to access, correct, or delete your personal data, and to export your data. To exercise these rights, contact us at privacy@brainlyx.app.</Paragraph>
            </Section>

            <Section title="7. Data Retention">
                <Paragraph>We retain your data for as long as your account is active. If you delete your account, we delete your personal data and uploaded content within 30 days.</Paragraph>
            </Section>

            <Section title="8. Children's Privacy">
                <Paragraph>Brainlyx is not intended for children under 13. We do not knowingly collect personal information from children under 13.</Paragraph>
            </Section>

            <Section title="9. Changes to This Policy">
                <Paragraph>We may update this Privacy Policy from time to time. Significant changes will be communicated via email or through the Service.</Paragraph>
            </Section>

            <Section title="10. Contact">
                <Paragraph>
                    Questions? Contact us at privacy@brainlyx.app
                </Paragraph>
            </Section>
        </LegalScreen>
    );
}
