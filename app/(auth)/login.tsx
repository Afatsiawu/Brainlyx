import { Button } from '@/components/ui/Button';
import { GoogleLoginButton } from '@/components/ui/GoogleLoginButton';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import api, { setAuthToken } from '@/services/api';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const logoImg = require('@/assets/images/logo.png');

const { width } = Dimensions.get('window');

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/login', { identifier: username, password });
            const { token, user } = response.data;
            setAuthToken(token);
            await login(user, token);
            router.replace('/(tabs)');
        } catch (error) {
            Alert.alert('Login Failed', 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
            <View style={styles.decorativeCircle} />
            <View style={styles.decorativeCircleSmall} />

            <View style={styles.content}>
                <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Animated.Image
                            source={logoImg}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Log in to continue your mastery.</Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.form}>
                    <Input
                        placeholder="Username or Email"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        icon="person-outline"
                    />

                    <Input
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        isPassword
                        icon="lock-closed-outline"
                    />

                    <Button
                        title="Log In"
                        onPress={handleLogin}
                        loading={loading}
                        style={styles.loginButton}
                    />

                    <View style={styles.separator}>
                        <View style={styles.line} />
                        <Text style={styles.separatorText}>OR</Text>
                        <View style={styles.line} />
                    </View>

                    <GoogleLoginButton
                        onPressStart={() => setLoading(true)}
                        onPressEnd={() => setLoading(false)}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>New here? </Text>
                        <Link href="/signup" asChild>
                            <TouchableOpacity>
                                <Text style={styles.linkText}>Create Account</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </Animated.View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        position: 'relative',
    },
    decorativeCircle: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: Colors.secondary + '10', // 10% opacity
    },
    decorativeCircleSmall: {
        position: 'absolute',
        top: 100,
        left: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: Colors.primary + '05',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 120,
        height: 120,
        marginBottom: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 40,
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    logo: {
        width: 80,
        height: 80,
    },
    title: {
        ...Typography.h1,
        fontSize: 32,
        color: Colors.text,
        marginBottom: 8,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    form: {
        width: '100%',
        gap: Spacing.md,
    },
    loginButton: {
        backgroundColor: Colors.secondary,
        marginTop: Spacing.sm,
        height: 56,
        borderRadius: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        ...Typography.body,
        color: Colors.textSecondary,
    },
    linkText: {
        ...Typography.body,
        color: Colors.secondary,
        fontWeight: '700',
    },
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.sm,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
    separatorText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginHorizontal: 10,
        fontWeight: '600',
    },
});
