import { Button } from '@/components/ui/Button';
import { GoogleLoginButton } from '@/components/ui/GoogleLoginButton';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography } from '@/constants/theme';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const logoImg = require('@/assets/images/logo.png');

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async () => {
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (!agreeTerms) {
            Alert.alert('Error', 'Please agree to the Terms & Conditions');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/signup', {
                username,
                email,
                password,
                // Using dummy values for fields that were in previous version but not in new UI
                name: username,
                university: 'Not Specified',
                major: 'Not Specified',
                year: '1'
            });

            Alert.alert('Success', 'Account created! Welcome to Brainlyx.', [
                { text: 'OK', onPress: () => router.replace('/login') }
            ]);
        } catch (error: any) {
            const message = error.response?.data?.error || error.message || 'Could not create account';
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
            <View style={styles.decorativeCircle} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Animated.Image
                            source={logoImg}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>Join Brainlyx</Text>
                    <Text style={styles.subtitle}>Start your intelligent learning journey.</Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.form}>
                    <Input
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        icon="person-outline"
                    />

                    <Input
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        icon="mail-outline"
                        keyboardType="email-address"
                    />

                    <Input
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        isPassword
                        icon="lock-closed-outline"
                    />

                    <Input
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        isPassword
                        icon="lock-closed-outline"
                    />

                    <View style={styles.termsContainer}>
                        <TouchableOpacity
                            onPress={() => setAgreeTerms(!agreeTerms)}
                            style={[styles.checkbox, agreeTerms && styles.checkboxActive]}
                        >
                            {agreeTerms && <Ionicons name="checkmark" size={12} color="white" />}
                        </TouchableOpacity>
                        <Text style={styles.termsText}>
                            I agree to the <Text style={styles.linkTextInline}>Terms & Conditions</Text>
                        </Text>
                    </View>

                    <Button
                        title="Sign Up"
                        onPress={handleSignup}
                        loading={loading}
                        style={styles.signupButton}
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
                        <Text style={styles.footerText}>Already a member? </Text>
                        <Link href="/login" asChild>
                            <TouchableOpacity>
                                <Text style={styles.linkText}>Log in</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </Animated.View>
            </ScrollView>
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
        top: -50,
        left: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: Colors.secondary + '08',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
        paddingVertical: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoContainer: {
        width: 100,
        height: 100,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 30,
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
    },
    logo: {
        width: 60,
        height: 60,
    },
    title: {
        ...Typography.h1,
        fontSize: 28,
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
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.sm,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: Colors.border,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    checkboxActive: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    termsText: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    linkTextInline: {
        color: Colors.secondary,
        fontWeight: '600',
    },
    signupButton: {
        backgroundColor: Colors.secondary,
        height: 56,
        borderRadius: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
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
