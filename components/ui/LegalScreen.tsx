import { Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LegalScreenProps {
    title: string;
    lastUpdated: string;
    children: React.ReactNode;
}

export const LegalScreen: React.FC<LegalScreenProps> = ({ title, lastUpdated, children }) => {
    const router = useRouter();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>Last updated: {lastUpdated}</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.body}>
                {children}
            </View>
        </ScrollView>
    );
};

export const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
);

export const Paragraph = ({ children }: { children: React.ReactNode }) => (
    <Text style={styles.paragraph}>{children}</Text>
);

export const BulletList = ({ items }: { items: string[] }) => (
    <View style={styles.bulletList}>
        {items.map((item, i) => (
            <View key={i} style={styles.bulletItem}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
            </View>
        ))}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingTop: 60,
        paddingBottom: Spacing.lg,
    },
    backButton: {
        padding: 8,
        marginRight: Spacing.sm,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        ...Typography.h1,
        fontSize: 24,
        color: Colors.text,
    },
    subtitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    body: {
        paddingHorizontal: Spacing.xl,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.h2,
        fontSize: 18,
        color: Colors.text,
        marginBottom: Spacing.sm,
        marginTop: Spacing.md,
    },
    paragraph: {
        ...Typography.body,
        color: Colors.textSecondary,
        lineHeight: 24,
        marginBottom: Spacing.md,
    },
    bulletList: {
        marginBottom: Spacing.md,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: Spacing.xs,
        paddingLeft: Spacing.sm,
    },
    bulletDot: {
        ...Typography.body,
        color: Colors.primary,
        marginRight: Spacing.sm,
        fontWeight: '700',
    },
    bulletText: {
        ...Typography.body,
        color: Colors.textSecondary,
        flex: 1,
        lineHeight: 22,
    },
});
