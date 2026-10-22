import { LegalScreen, Paragraph, Section, BulletList } from '@/components/ui/LegalScreen';
import React from 'react';

export default function TermsScreen() {
    return (
        <LegalScreen title="Terms of Service" lastUpdated="October 2026">
            <Section title="1. Acceptance of Terms">
                <Paragraph>By accessing or using Brainlyx (“the Service”), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</Paragraph>
            </Section>

            <Section title="2. Description of Service">
                <Paragraph>Brainlyx is an AI-powered study platform that helps students analyze documents, record lectures, generate flashcards, create study plans, and access AI tutoring. The Service is provided “as is” and may be updated or modified at any time.</Paragraph>
            </Section>

            <Section title="3. User Accounts">
                <Paragraph>You must create an account to use certain features. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. You must be at least 13 years old to use the Service.</Paragraph>
            </Section>

            <Section title="4. Acceptable Use">
                <BulletList items={[
                    'Use the Service for any unlawful purpose',
                    'Upload content that infringes on intellectual property rights',
                    'Attempt to gain unauthorized access to the Service or its systems',
                    'Use the Service to generate harmful, misleading, or deceptive content',
                    'Abuse, harass, or interfere with other users',
                    'Upload malicious files or attempt to exploit the Service',
                ]} />
            </Section>

            <Section title="5. Uploaded Content">
                <Paragraph>You retain ownership of content you upload. By uploading, you grant Brainlyx a non-exclusive license to process, store, and analyze that content to provide the Service. You are responsible for ensuring you have the right to upload any content.</Paragraph>
            </Section>

            <Section title="6. AI-Generated Content">
                <Paragraph>Brainlyx uses AI to generate study materials. AI-generated content may contain errors. You should verify important information independently. Brainlyx is not liable for decisions made based on AI-generated content.</Paragraph>
            </Section>

            <Section title="7. Intellectual Property">
                <Paragraph>The Service, including its design, code, and branding, is owned by Brainlyx Inc. You may not copy, modify, or distribute the Service without permission.</Paragraph>
            </Section>

            <Section title="8. Limitation of Liability">
                <Paragraph>To the maximum extent permitted by law, Brainlyx shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.</Paragraph>
            </Section>

            <Section title="9. Termination">
                <Paragraph>We may terminate or suspend your account at any time for violation of these Terms. You may delete your account at any time. Upon termination, your right to use the Service ceases immediately.</Paragraph>
            </Section>

            <Section title="10. Contact">
                <Paragraph>For questions about these Terms, contact us at legal@brainlyx.app</Paragraph>
            </Section>
        </LegalScreen>
    );
}
