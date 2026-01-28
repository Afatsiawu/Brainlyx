import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import api, { setAuthToken } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

interface GoogleLoginButtonProps {
    onPressStart?: () => void;
    onPressEnd?: () => void;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onPressStart, onPressEnd }) => {
    const router = useRouter();
    const { login } = useAuth();

    const [request, response, promptAsync] = Google.useAuthRequest({
        iosClientId: '891710253138-kv6aeha1e84ro1ikbbm0tki99e97nklc.apps.googleusercontent.com',
        androidClientId: '891710253138-kv6aeha1e84ro1ikbbm0tki99e97nklc.apps.googleusercontent.com',
        webClientId: '891710253138-kv6aeha1e84ro1ikbbm0tki99e97nklc.apps.googleusercontent.com',
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleGoogleLogin(id_token);
        } else if (response?.type === 'error') {
            Alert.alert('Error', 'Google login failed');
            onPressEnd?.();
        }
    }, [response]);

    const handleGoogleLogin = async (idToken: string) => {
        try {
            const backendResponse = await api.post('/auth/google', { idToken });
            const { token, user } = backendResponse.data;

            setAuthToken(token);
            await login(user, token);
            router.replace('/(tabs)');
        } catch (error: any) {
            console.error('Google Backend Login Error:', error);
            Alert.alert('Login Failed', 'Could not authenticate with server');
        } finally {
            onPressEnd?.();
        }
    };

    const handlePress = () => {
        onPressStart?.();
        promptAsync();
    };

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={handlePress}
            disabled={!request}
        >
            <View style={styles.iconContainer}>
                <Ionicons name="person-circle-outline" size={20} color="#EA4335" />
            </View>
            <Text style={styles.text}>Continue with Google</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        marginTop: Spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    iconContainer: {
        marginRight: 12,
    },
    text: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.text,
    },
});
