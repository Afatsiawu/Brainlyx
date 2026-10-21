import { Button } from '@/components/ui/Button';
import { ClayCard } from '@/components/ui/Clay';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography } from '@/constants/theme';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Challenge {
    claim: string;
    challenge: string;
    severity: 'high' | 'medium' | 'low';
    suggestion: string;
}

export default function DevilsAdvocateScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const documentId = params.documentId as string | undefined;

    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [challenges, setChallenges] = useState<Challenge[]>([]);

    const generateFromDocument = async () => {
        if (!documentId) return;
        setLoading(true);
        try {
            const response = await api.post(`/study/devils-advocate/${documentId}`, {});
            setChallenges(response.data.challenges || []);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to generate challenges.');
        } finally {
            setLoading(false);
        }
    };

    const generateFromTopic = async () => {
        if (!topic.trim()) {
            Alert.alert('Error', 'Please enter a topic first.');
            return;
        }
        setLoading(true);
        try {
            const response = await api.post('/study/devils-advocate-by-topic', { topic: topic.trim() });
            setChallenges(response.data.challenges || []);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to generate challenges.');
        } finally {
            setLoading(false);
        }
    };

    const severityColor = (s: string) => {
        if (s === 'high') return Colors.error;
        if (s === 'medium') return Colors.warning;
        return Colors.success;
    };

    const severityBg = (s: string) => {
        if (s === 'high') return Colors.error + '18';
        if (s === 'medium') return Colors.warning + '18';
        return Colors.success + '18';
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.title}>Devil&apos;s Advocate</Text>
                    <Text style={styles.subtitle}>Stress-test your sources</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {challenges.length === 0 && (
                <View style={styles.inputSection}>
                    {!documentId && (
                        <>
                            <Text style={styles.inputLabel}>Enter a topic to challenge:</Text>
                            <Input
                                placeholder="e.g. Climate change causes"
                                value={topic}
                                onChangeText={setTopic}
                                containerStyle={styles.topicInput}
                                icon="search-outline"
                            />
                            <Button
                                title="Find Weaknesses"
                                onPress={generateFromTopic}
                                loading={loading}
                                style={styles.generateBtn}
                            />
                        </>
                    )}
                    {documentId && loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.error} />
                            <Text style={styles.loadingText}>Challenging your sources...</Text>
                        </View>
                    )}
                    {documentId && !loading && challenges.length === 0 && (
                        <Button
                            title="Run Devil's Advocate"
                            onPress={generateFromDocument}
                            loading={loading}
                            style={styles.generateBtn}
                        />
                    )}
                </View>
            )}

            {challenges.length > 0 && (
                <View style={styles.resultsContainer}>
                    <Text style={styles.resultsTitle}>Challenges Found ({challenges.length})</Text>
                    {challenges.map((c, idx) => (
                        <ClayCard key={idx} style={styles.challengeCard}>
                            <View style={styles.challengeHeader}>
                                <View style={[styles.severityBadge, { backgroundColor: severityBg(c.severity) }]}>
                                    <Text style={[styles.severityText, { color: severityColor(c.severity) }]}>
                                        {c.severity.toUpperCase()}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.claimLabel}>Claim:</Text>
                            <Text style={styles.claimText}>{c.claim}</Text>
                            <Text style={styles.challengeLabel}>Challenge:</Text>
                            <Text style={styles.challengeText}>{c.challenge}</Text>
                            <View style={styles.suggestionBox}>
                                <Ionicons name="bulb-outline" size={16} color={Colors.warning} />
                                <Text style={styles.suggestionText}>{c.suggestion}</Text>
                            </View>
                        </ClayCard>
                    ))}
                    <Button
                        title="Try Another Topic"
                        onPress={() => { setChallenges([]); setTopic(''); }}
                        variant="outline"
                        style={{ marginTop: Spacing.lg }}
                    />
                </View>
            )}
        </ScrollView>
    );
}

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
    inputSection: {
        padding: Spacing.xl,
    },
    inputLabel: {
        ...Typography.body,
        color: Colors.text,
        marginBottom: Spacing.sm,
        fontWeight: '600',
    },
    topicInput: {
        marginBottom: Spacing.lg,
    },
    generateBtn: {
        height: 56,
        borderRadius: 24,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        ...Typography.body,
        color: Colors.textSecondary,
        marginTop: 16,
    },
    resultsContainer: {
        padding: Spacing.xl,
    },
    resultsTitle: {
        ...Typography.h2,
        fontSize: 20,
        color: Colors.text,
        marginBottom: Spacing.lg,
    },
    challengeCard: {
        padding: Spacing.lg,
        marginBottom: Spacing.md,
    },
    challengeHeader: {
        flexDirection: 'row',
        marginBottom: Spacing.md,
    },
    severityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    severityText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    claimLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '700',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    claimText: {
        ...Typography.body,
        color: Colors.text,
        marginBottom: Spacing.md,
        lineHeight: 22,
    },
    challengeLabel: {
        ...Typography.caption,
        color: Colors.error,
        fontWeight: '700',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    challengeText: {
        ...Typography.body,
        color: Colors.text,
        lineHeight: 22,
        marginBottom: Spacing.md,
    },
    suggestionBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: Colors.warning + '15',
        padding: Spacing.md,
        borderRadius: 16,
    },
    suggestionText: {
        ...Typography.caption,
        color: Colors.text,
        flex: 1,
        lineHeight: 18,
    },
});
