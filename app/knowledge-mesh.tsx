import { Button } from '@/components/ui/Button';
import { ClayCard } from '@/components/ui/Clay';
import { Colors, Spacing, Typography } from '@/constants/theme';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Insight {
    type: 'connection' | 'contradiction' | 'complement' | 'gap';
    title: string;
    description: string;
    documents: string[];
}

const typeConfig: Record<string, { color: string; icon: string; label: string }> = {
    connection: { color: Colors.primary, icon: 'link-outline', label: 'Connection' },
    contradiction: { color: Colors.error, icon: 'alert-circle-outline', label: 'Contradiction' },
    complement: { color: Colors.success, icon: 'add-circle-outline', label: 'Complement' },
    gap: { color: Colors.warning, icon: 'help-circle-outline', label: 'Gap' },
};

export default function KnowledgeMeshScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState<Insight[]>([]);

    const generateMesh = async () => {
        setLoading(true);
        try {
            const response = await api.post('/study/knowledge-mesh', {});
            setInsights(response.data.insights || []);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to generate knowledge mesh.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.title}>Knowledge Mesh</Text>
                    <Text style={styles.subtitle}>Cross-project intelligence</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {insights.length === 0 && (
                <View style={styles.introContainer}>
                    <View style={styles.introIcon}>
                        <Ionicons name="git-network-outline" size={48} color={Colors.accent} />
                    </View>
                    <Text style={styles.introTitle}>Global Knowledge Layer</Text>
                    <Text style={styles.introText}>
                        Analyze all your uploaded documents together. The AI will find connections,
                        contradictions, and gaps across your entire library.
                    </Text>
                    <Button
                        title="Generate Knowledge Mesh"
                        onPress={generateMesh}
                        loading={loading}
                        style={styles.generateBtn}
                    />
                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.accent} />
                            <Text style={styles.loadingText}>Synthesizing your library...</Text>
                        </View>
                    )}
                </View>
            )}

            {insights.length > 0 && (
                <View style={styles.resultsContainer}>
                    <Text style={styles.resultsTitle}>Insights ({insights.length})</Text>
                    {insights.map((insight, idx) => {
                        const config = typeConfig[insight.type] || typeConfig.connection;
                        return (
                            <ClayCard key={idx} style={styles.insightCard}>
                                <View style={styles.insightHeader}>
                                    <View style={[styles.typeBadge, { backgroundColor: config.color + '18' }]}>
                                        <Ionicons name={config.icon as any} size={14} color={config.color} />
                                        <Text style={[styles.typeLabel, { color: config.color }]}>{config.label}</Text>
                                    </View>
                                </View>
                                <Text style={styles.insightTitle}>{insight.title}</Text>
                                <Text style={styles.insightDesc}>{insight.description}</Text>
                                {insight.documents && insight.documents.length > 0 && (
                                    <View style={styles.docTags}>
                                        {insight.documents.map((doc, i) => (
                                            <View key={i} style={styles.docTag}>
                                                <Text style={styles.docTagText} numberOfLines={1}>{doc}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </ClayCard>
                        );
                    })}
                    <Button
                        title="Regenerate"
                        onPress={generateMesh}
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
    introContainer: {
        padding: Spacing.xl,
        alignItems: 'center',
    },
    introIcon: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: Colors.accent + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xl,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.6)',
        shadowColor: '#4C4ED1',
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 8,
    },
    introTitle: {
        ...Typography.h1,
        fontSize: 24,
        color: Colors.text,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    introText: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.md,
    },
    generateBtn: {
        height: 56,
        borderRadius: 24,
        width: '100%',
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
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
    insightCard: {
        padding: Spacing.lg,
        marginBottom: Spacing.md,
    },
    insightHeader: {
        flexDirection: 'row',
        marginBottom: Spacing.sm,
    },
    typeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    typeLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    insightTitle: {
        ...Typography.h3,
        fontSize: 16,
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    insightDesc: {
        ...Typography.body,
        color: Colors.textSecondary,
        lineHeight: 22,
        marginBottom: Spacing.md,
    },
    docTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    docTag: {
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.6)',
    },
    docTagText: {
        fontSize: 11,
        fontWeight: '600',
        color: Colors.primary,
    },
});
