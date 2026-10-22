import LegalLayout from '../components/LegalLayout';

const CookiePolicy = () => {
    return (
        <LegalLayout title="Cookie Policy" lastUpdated="October 2026">
            <h2 className="text-xl font-bold text-text mt-6 mb-3">1. What Are Cookies</h2>
            <p>
                Cookies are small text files stored on your device when you visit a website. They help the website
                remember your preferences and improve your experience. Brainlyx uses cookies and similar technologies
                (like local storage) to provide and improve our Service.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">2. Types of Cookies We Use</h2>

            <h3 className="text-lg font-semibold text-text mt-4 mb-2">Essential Cookies</h3>
            <p>
                Required for the Service to function. These include authentication tokens, session management,
                and security features. You cannot opt out of these cookies.
            </p>

            <h3 className="text-lg font-semibold text-text mt-4 mb-2">Functional Cookies</h3>
            <p>
                Remember your preferences and settings, such as theme choices, language preferences, and layout
                settings. These improve your experience but are not strictly necessary.
            </p>

            <h3 className="text-lg font-semibold text-text mt-4 mb-2">Analytics Cookies</h3>
            <p>
                Help us understand how you use the Service, which features are popular, and where improvements
                are needed. We use aggregated, anonymized data for this purpose.
            </p>

            <h3 className="text-lg font-semibold text-text mt-4 mb-2">Performance Cookies</h3>
            <p>
                Monitor the performance of the Service, including page load times, error rates, and resource usage.
                This helps us identify and fix issues.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">3. Third-Party Cookies</h2>
            <p>
                Some cookies may be set by third-party services we use, such as Google (for authentication) and
                analytics providers. These third parties have their own privacy policies governing their use of
                cookies.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">4. Local Storage</h2>
            <p>
                In addition to cookies, we use browser local storage to store authentication tokens and user
                preferences. This data persists between sessions until you clear it or delete your account.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">5. Managing Cookies</h2>
            <p>You can control cookies through your browser settings:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Block all cookies (may affect Service functionality)</li>
                <li>Delete existing cookies</li>
                <li>Set preferences for specific websites</li>
                <li>Use private/incognito browsing mode</li>
            </ul>
            <p>
                Note: Disabling essential cookies may prevent you from using certain features of the Service,
                such as staying logged in.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">6. Cookie Duration</h2>
            <p>
                <strong>Session cookies:</strong> Temporary cookies that are deleted when you close your browser.
            </p>
            <p>
                <strong>Persistent cookies:</strong> Remain on your device for a set period or until you delete them.
                Authentication tokens are typically persistent to keep you logged in.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">7. Updates to This Policy</h2>
            <p>
                We may update this Cookie Policy from time to time. Changes will be posted on this page with an
                updated "Last updated" date.
            </p>

            <h2 className="text-xl font-bold text-text mt-6 mb-3">8. Contact</h2>
            <p>
                For questions about our use of cookies, contact us at{' '}
                <a href="mailto:privacy@brainlyx.app" className="text-primary hover:underline">privacy@brainlyx.app</a>.
            </p>
        </LegalLayout>
    );
};

export default CookiePolicy;
