import { LegalScreen, Paragraph, Section } from '@/components/ui/LegalScreen';
import React from 'react';

export default function CookiePolicyScreen() {
    return (
        <LegalScreen title="Cookie Policy" lastUpdated="October 2026">
            <Section title="1. What Are Cookies">
                <Paragraph>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your experience. Brainlyx uses cookies and similar technologies to provide and improve our Service.</Paragraph>
            </Section>

            <Section title="2. Types of Cookies We Use">
                <Paragraph>Essential Cookies: Required for the Service to function. These include authentication tokens and session management. You cannot opt out of these.</Paragraph>
                <Paragraph>Functional Cookies: Remember your preferences and settings, such as theme choices and language. These improve your experience.</Paragraph>
                <Paragraph>Analytics Cookies: Help us understand how you use the Service. We use aggregated, anonymized data.</Paragraph>
            </Section>

            <Section title="3. Third-Party Cookies">
                <Paragraph>Some cookies may be set by third-party services we use (Google for authentication, analytics providers). These third parties have their own privacy policies.</Paragraph>
            </Section>

            <Section title="4. Local Storage">
                <Paragraph>In addition to cookies, we use local storage to store authentication tokens and user preferences. This data persists between sessions until you clear it or delete your account.</Paragraph>
            </Section>

            <Section title="5. Managing Cookies">
                <Paragraph>You can control cookies through your browser or device settings. Note: disabling essential cookies may prevent you from using certain features.</Paragraph>
            </Section>

            <Section title="6. Contact">
                <Paragraph>For questions about our use of cookies, contact us at privacy@brainlyx.app</Paragraph>
            </Section>
        </LegalScreen>
    );
}
