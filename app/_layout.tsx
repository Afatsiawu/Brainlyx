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
import { ActivityIndicator, Image, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from '@/components/ui/Motion';
import { Colors, Typography } from '@/constants/theme';
import { LayoutAnimationConfig } from 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

const splashStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoWrap: {
        alignItems: 'center',
        gap: 12,
    },
    logo: {
        width: 120,
        height: 120,
        borderRadius: 48,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.6)',
    },
    title: {
        ...Typography.h1,
        fontSize: 34,
        color: Colors.text,
        marginTop: 16,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    spinner: {
        marginTop: 32,
    },
});

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
        return (
            <View style={splashStyles.container}>
                <Animated.View entering={FadeIn.duration(600)} style={splashStyles.logoWrap}>
                    <Image source={require('@/assets/images/icon.png')} style={splashStyles.logo} resizeMode="contain" />
                    <Text style={splashStyles.title}>Brainlyx</Text>
                    <Text style={splashStyles.subtitle}>Loading your study space...</Text>
                </Animated.View>
                <ActivityIndicator size="large" color={Colors.primary} style={splashStyles.spinner} />
            </View>
        );
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
