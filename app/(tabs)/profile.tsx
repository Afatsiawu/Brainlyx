import { Button } from '@/components/ui/Button';
import { Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const { colors } = useTheme();
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);

    const styles = getStyles(colors);

    const handleLogout = () => {
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log Out', style: 'destructive', onPress: () => {
                    logout();
                    router.replace('/login');
                }
            },
        ]);
    };

    const SettingItem = ({ icon, label, onPress, value, type = 'link', delay }: { icon: any, label: string, onPress?: () => void, value?: string, type?: 'link' | 'switch', delay: number }) => (
        <Animated.View entering={FadeInUp.delay(delay)}>
            <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.settingItem} disabled={type === 'switch'}>
                <View style={[styles.settingIcon]}>
                    <Ionicons name={icon} size={20} color={colors.text} />
                </View>
                <Text style={styles.settingLabel}>{label}</Text>
                {type === 'switch' ? (
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: colors.border, true: colors.secondary }}
                        thumbColor={Platform.OS === 'android' ? colors.surface : ''}
                    />
                ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {value && <Text style={styles.settingValue}>{value}</Text>}
                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Animated.View entering={ZoomIn.duration(800)} style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={40} color="white" />
                    </View>
                    <TouchableOpacity style={styles.editBadge}>
                        <Ionicons name="camera" size={14} color="white" />
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200)} style={styles.userInfo}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={styles.userName}>{user?.name || 'Student Name'}</Text>
                        {user?.isPremium && (
                            <View style={styles.premiumBadge}>
                                <Ionicons name="star" size={10} color="white" />
                                <Text style={styles.premiumBadgeText}>PREMIUM</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.userEmail}>{user?.email || 'student@university.edu'}</Text>
                    <View style={styles.userTag}>
                        <Text style={styles.userTagText}>{user?.university || 'University'}</Text>
                    </View>
                </Animated.View>
            </View>

            <View style={styles.content}>
                {/* Go Premium Section - Only show if not premium */}
                {!user?.isPremium && (
                    <Animated.View entering={FadeInUp.delay(250)} style={styles.premiumCard}>
                        <LinearGradient
                            colors={[colors.secondary, colors.primary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.premiumGradient}
                        >
                            <View style={styles.premiumContent}>
                                <View>
                                    <Text style={styles.premiumTitle}>Unlock Full Potential 🚀</Text>
                                    <Text style={styles.premiumSubtitle}>Get Unlimited Access to all features</Text>
                                </View>
                                <Ionicons name="diamond" size={40} color="rgba(255,255,255,0.3)" style={styles.premiumIcon} />
                            </View>

                            <View style={styles.benefitsList}>
                                <View style={styles.benefitItem}>
                                    <Ionicons name="checkmark-circle" size={16} color="white" />
                                    <Text style={styles.benefitText}>Unlimited PDF Uploads</Text>
                                </View>
                                <View style={styles.benefitItem}>
                                    <Ionicons name="checkmark-circle" size={16} color="white" />
                                    <Text style={styles.benefitText}>Priority AI Generation</Text>
                                </View>
                                <View style={styles.benefitItem}>
                                    <Ionicons name="checkmark-circle" size={16} color="white" />
                                    <Text style={styles.benefitText}>Advanced BrainlyxAI (Llama 3.3)</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.premiumButton}
                                activeOpacity={0.9}
                                onPress={() => Alert.alert('Premium', 'Premium subscriptions are coming soon!')}
                            >
                                <Text style={styles.premiumButtonText}>Go Premium (GHS 20.00)</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </Animated.View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <SettingItem icon="person-outline" label="Personal Information" delay={300} onPress={() => router.push('/profile/personal-info')} />
                    <SettingItem icon="school-outline" label="Academic Details" delay={400} onPress={() => router.push('/profile/academic')} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <SettingItem icon="notifications-outline" label="Notifications" delay={500} type="switch" />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <SettingItem icon="help-circle-outline" label="Help Center" delay={700} onPress={() => router.push('/profile/help')} />
                    <SettingItem icon="shield-checkmark-outline" label="Privacy & Security" delay={800} onPress={() => router.push('/profile/security')} />
                </View>

                <Animated.View entering={FadeInUp.delay(900)} style={styles.logoutContainer}>
                    <Button
                        title="Log Out"
                        onPress={handleLogout}
                        variant="outline"
                        style={styles.logoutButton}
                        textStyle={{ color: colors.error }}
                        icon={<Ionicons name="log-out-outline" size={20} color={colors.error} style={{ marginRight: 8 }} />}
                    />
                    <Text style={styles.version}>Version 1.0.0</Text>
                </Animated.View>

            </View>
        </ScrollView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        alignItems: 'center',
        paddingTop: 80,
        paddingBottom: 40,
        backgroundColor: colors.secondary,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: Spacing.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.secondary,
    },
    userInfo: {
        alignItems: 'center',
    },
    userName: {
        ...Typography.h1,
        color: 'white',
        fontSize: 24,
    },
    userEmail: {
        ...Typography.body,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    userTag: {
        marginTop: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    userTagText: {
        ...Typography.caption,
        color: 'white',
        fontWeight: '600',
    },
    content: {
        padding: Spacing.xl,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        ...Typography.h3,
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: Spacing.md,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    settingIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingLabel: {
        flex: 1,
        ...Typography.body,
        color: colors.text,
        fontWeight: '500',
    },
    settingValue: {
        ...Typography.caption,
        color: colors.textSecondary,
        marginRight: 8,
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFD700',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        gap: 4,
    },
    premiumBadgeText: {
        fontSize: 10,
        color: 'white',
        fontWeight: '900',
    },
    premiumCard: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: Spacing.xl,
        ...Shadows.medium,
    },
    premiumGradient: {
        padding: 24,
    },
    premiumContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    premiumTitle: {
        ...Typography.h2,
        color: 'white',
        fontSize: 20,
    },
    premiumSubtitle: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    premiumIcon: {
        marginTop: -10,
        marginRight: -10,
    },
    benefitsList: {
        marginBottom: 24,
        gap: 12,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    benefitText: {
        ...Typography.body,
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    premiumButton: {
        backgroundColor: 'white',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center',
    },
    premiumButtonText: {
        ...Typography.body,
        color: colors.primary,
        fontWeight: '800',
    },
    logoutContainer: {
        marginTop: 20,
        alignItems: 'center',
        paddingBottom: 40,
    },
    logoutButton: {
        width: '100%',
        borderColor: colors.error,
        backgroundColor: 'transparent',
        borderWidth: 1,
    },
    version: {
        ...Typography.caption,
        color: colors.textSecondary,
        marginTop: 16,
    },
});


