import { Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

export default function HelpScreen() {
    const router = useRouter();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const faqs = [
        {
            id: '1',
            q: 'How do I record a lecture?',
            a: 'On the Home screen, tap "Record" or the "Record Live Lecture" card. Grant microphone permission and tap the start button. The app will automatically transcribe and generate study materials when you stop.'
        },
        {
            id: '2',
            q: 'Can I upload existing PDF files?',
            a: 'Yes, go to the "Upload" tab. Tap the "Upload Document" card to select a PDF from your device.'
        },
        {
            id: '3',
            q: 'Where are my study materials saved?',
            a: 'All generated flashcards and lecture notes are stored in the "Study" tab, organized by course or date.'
        },
        {
            id: '4',
            q: 'Is the AI transcription accurate?',
            a: 'We use OpenAI Whisper, one of the most accurate speech-to-text models available. For best results, ensure your phone is close to the sound source.'
        },
    ];

    const FaqItem = ({ item }: { item: typeof faqs[0] }) => {
        const isSelected = expandedId === item.id;

        return (
            <View style={styles.faqItem}>
                <TouchableOpacity
                    style={styles.faqHeader}
                    onPress={() => setExpandedId(isSelected ? null : item.id)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.faqQuestion}>{item.q}</Text>
                    <Ionicons
                        name={isSelected ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={Colors.primary}
                    />
                </TouchableOpacity>
                {isSelected && (
                    <Animated.View entering={FadeIn} layout={Layout}>
                        <Text style={styles.faqAnswer}>{item.a}</Text>
                    </Animated.View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Animated.View entering={FadeIn.duration(400)}>
                    <View style={styles.supportIllustration}>
                        <Ionicons name="help-buoy" size={60} color={Colors.primary} />
                        <Text style={styles.supportTitle}>How can we help you?</Text>
                        <Text style={styles.supportSubtitle}>Find answers to common questions below or contact us.</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                    <View style={styles.faqList}>
                        {faqs.map(faq => <FaqItem key={faq.id} item={faq} />)}
                    </View>

                    <View style={styles.contactCard}>
                        <Text style={styles.contactTitle}>Still need help?</Text>
                        <Text style={styles.contactText}>Our support team is available Mon-Fri, 9am - 5pm.</Text>
                        <TouchableOpacity style={styles.contactButton}>
                            <Ionicons name="mail" size={20} color="white" />
                            <Text style={styles.contactButtonText}>Contact Support</Text>
                        </TouchableOpacity>
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
    supportIllustration: {
        alignItems: 'center',
        marginVertical: 32,
        paddingHorizontal: 20,
    },
    supportTitle: {
        ...Typography.h2,
        marginTop: 16,
        marginBottom: 8,
    },
    supportSubtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    sectionTitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '700',
        marginBottom: 16,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    faqList: {
        marginBottom: 32,
    },
    faqItem: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
    },
    faqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    faqQuestion: {
        flex: 1,
        ...Typography.body,
        fontWeight: '600',
        marginRight: 12,
    },
    faqAnswer: {
        ...Typography.body,
        color: Colors.textSecondary,
        paddingHorizontal: 16,
        paddingBottom: 16,
        fontSize: 14,
        lineHeight: 20,
    },
    contactCard: {
        backgroundColor: Colors.primaryLight + '20',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    contactTitle: {
        ...Typography.h2,
        fontSize: 18,
        marginBottom: 8,
    },
    contactText: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 16,
        gap: 10,
    },
    contactButtonText: {
        ...Typography.body,
        color: 'white',
        fontWeight: '600',
    },
});
