import { Redirect } from 'expo-router';

export default function Index() {
    // Lead user to onboarding first
    return <Redirect href="/(auth)/onboarding" />;
}
