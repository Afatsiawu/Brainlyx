import { Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function NotificationsScreen() {
    const router = useRouter();
    
    const [settings, setSettings] = useState({
        studyReminders: true,
        newMaterials: true,
        dailyQuotes: false,
        systemUpdates: true,
    });

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const SettingItem = ({ 
        title, 
        description, 
        value, 
        onToggle, 
        icon 
    }: { 
        title: string, 
        description: string, 
        value: boolean, 
        onToggle: () => void,
        icon: string
    }) => (
        <View style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
                <Ionicons name={icon as any} size={22} color={Colors.primary} />
            </View>
            <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{title}</Text>
                <Text style={styles.settingDescription}>{description}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={value ? Colors.primary : '#f4f3f4'}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Animated.View entering={FadeIn.duration(400)}>
                    <Text style={styles.sectionTitle}>Study Alerts</Text>
                    <View style={styles.card}>
                        <SettingItem
                            title="Study Reminders"
                            description="Get notified when it's time for your scheduled study session."
                            value={settings.studyReminders}
                            onToggle={() => toggleSetting('studyReminders')}
                            icon="alarm-outline"
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            title="New Study Materials"
                            description="Notify me when flashcards or questions are generated from my recordings."
                            value={settings.newMaterials}
                            onToggle={() => toggleSetting('newMaterials')}
                            icon="document-text-outline"
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Engagement</Text>
                    <View style={styles.card}>
                        <SettingItem
                            title="Daily Motivational Quotes"
                            description="Receive a morning quote to kickstart your study day."
                            value={settings.dailyQuotes}
                            onToggle={() => toggleSetting('dailyQuotes')}
                            icon="sunny-outline"
                        />
                    </View>

                    <Text style={styles.sectionTitle}>App Updates</Text>
                    <View style={styles.card}>
                        <SettingItem
                            title="System Notifications"
                            description="Important updates about features, maintenance, and security."
                            value={settings.systemUpdates}
                            onToggle={() => toggleSetting('systemUpdates')}
                            icon="notifications-outline"
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
    sectionTitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '700',
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: 4,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    settingIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Colors.primaryLight + '30',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingText: {
        flex: 1,
        marginRight: 8,
    },
    settingTitle: {
        ...Typography.body,
        fontWeight: '600',
        marginBottom: 2,
    },
    settingDescription: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontSize: 12,
        lineHeight: 16,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        opacity: 0.3,
        marginHorizontal: 16,
    },
});
