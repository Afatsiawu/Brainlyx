import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function SecurityScreen() {
    const router = useRouter();
    const { logout } = useAuth();
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    const handleChangePassword = () => {
        Alert.alert(
            'Change Password',
            'We will send a password reset link to your email address.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Send Link', onPress: () => Alert.alert('Success', 'Reset link sent to your email.') }
            ]
        );
    };

    const handlePrivacyPolicy = () => {
        // Mock opening a privacy policy
        Alert.alert('Privacy Policy', 'Brainlyx collects minimal data for study purposes only. Your data is encrypted and secure.');
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to permanently delete your account? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        // In a real app, call API to delete
                        await logout();
                        router.replace('/login');
                        Alert.alert('Account Deleted', 'Your account has been successfully removed.');
                    }
                }
            ]
        );
    };

    const SecurityItem = ({
        title,
        icon,
        onPress,
        color = Colors.primary,
        subtitle = '',
        isSwitch = false,
        switchValue = false,
        onSwitchChange
    }: {
        title: string,
        icon: string,
        onPress?: () => void,
        color?: string,
        subtitle?: string,
        isSwitch?: boolean,
        switchValue?: boolean,
        onSwitchChange?: (val: boolean) => void
    }) => (
        <TouchableOpacity style={styles.item} onPress={isSwitch ? undefined : onPress} activeOpacity={isSwitch ? 1 : 0.7}>
            <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon as any} size={22} color={color} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{title}</Text>
                {subtitle ? <Text style={styles.itemSubtitle}>{subtitle}</Text> : null}
            </View>
            {isSwitch ? (
                <Switch
                    value={switchValue}
                    onValueChange={onSwitchChange}
                    trackColor={{ false: Colors.border, true: Colors.success }}
                />
            ) : (
                <Ionicons name="chevron-forward" size={18} color={Colors.border} />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy & Security</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Animated.View entering={FadeIn.duration(400)}>
                    <View style={styles.lockIllustration}>
                        <Ionicons name="shield-checkmark" size={60} color={Colors.primary} />
                        <Text style={styles.securitySeal}>Your account is protected</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Account Security</Text>
                    <View style={styles.card}>
                        <SecurityItem
                            title="Change Password"
                            icon="lock-closed-outline"
                            subtitle="Last changed 3 months ago"
                            onPress={handleChangePassword}
                        />
                        <View style={styles.divider} />
                        <SecurityItem
                            title="Two-Factor Authentication"
                            icon="finger-print-outline"
                            subtitle="Recommended for high security"
                            isSwitch
                            switchValue={twoFactorEnabled}
                            onSwitchChange={setTwoFactorEnabled}
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Data & Privacy</Text>
                    <View style={styles.card}>
                        <SecurityItem
                            title="Study Data Permissions"
                            icon="analytics-outline"
                            onPress={() => Alert.alert('Permissions', 'You have granted access to reading analytics for progress tracking.')}
                        />
                        <View style={styles.divider} />
                        <SecurityItem
                            title="Privacy Policy"
                            icon="document-text-outline"
                            onPress={handlePrivacyPolicy}
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Account Actions</Text>
                    <View style={styles.card}>
                        <SecurityItem
                            title="Delete Account"
                            icon="trash-outline"
                            color={Colors.error}
                            subtitle="Permanently remove your data"
                            onPress={handleDeleteAccount}
                        />
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: Spacing.xl,
        paddingBottom: 20,
        backgroundColor: Colors.surface,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    headerTitle: {
        ...Typography.h2,
        fontSize: 18,
    },
    content: {
        padding: Spacing.xl,
    },
    lockIllustration: {
        alignItems: 'center',
        marginVertical: 32,
    },
    securitySeal: {
        ...Typography.body,
        fontWeight: '600',
        marginTop: 12,
        color: Colors.primary,
    },
    sectionTitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '700',
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 4,
        marginBottom: 24,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        paddingRight: 8,
    },
    itemTitle: {
        ...Typography.body,
        fontWeight: '600',
    },
    itemSubtitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        opacity: 0.3,
        marginHorizontal: 16,
    },
});
