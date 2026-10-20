import { AuthProvider } from '@/context/AuthContext';
import { MusicProvider } from '@/context/MusicContext';
import { ThemeProvider as AppThemeProvider } from '@/context/ThemeContext';
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { LayoutAnimationConfig } from 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
    anchor: '(tabs)',
};

function RootLayoutNav() {
    return (
        <NavigationThemeProvider value={DefaultTheme}>
            <Stack>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="dark" />
        </NavigationThemeProvider>
    );
}

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Nunito_400Regular,
        Nunito_500Medium,
        Nunito_600SemiBold,
        Nunito_700Bold,
        Nunito_800ExtraBold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <AppThemeProvider>
            <MusicProvider>
                <AuthProvider>
                    {/* On web, Reanimated's animation teardown crashes when a screen
                        unmounts (it reads layout from a detached element), so
                        entering/layout animations are skipped there. */}
                    <LayoutAnimationConfig skipEntering={Platform.OS === 'web'}>
                        <RootLayoutNav />
                    </LayoutAnimationConfig>
                </AuthProvider>
            </MusicProvider>
        </AppThemeProvider>
    );
}
