import { Card } from '@/components/ui/Card';
import { Colors, Spacing, Typography } from '@/constants/theme';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Linking, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight, Layout, ZoomIn } from 'react-native-reanimated';

export default function StudyScreen() {
    const router = useRouter();
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDocuments = async () => {
        try {
            const response = await api.get('/documents');
            const sortedDocs = response.data.sort((a: any, b: any) =>
                new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
            );
            setDocuments(sortedDocs);
        } catch (error) {
            console.error('Failed to fetch docs', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchDocuments();
        setRefreshing(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchDocuments();
        }, [])
    );

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/documents/${id}`);
            setDocuments(prev => prev.filter(d => d.id !== id));
            Alert.alert('Deleted', 'Document removed successfully.');
        } catch (error) {
            Alert.alert('Error', 'Failed to delete document.');
        }
    };

    const showOptions = (doc: any) => {
        Alert.alert(
            'Manage Document',
            doc.filename,
            [
                {
                    text: 'Download File',
                    onPress: () => {
                        const url = `http://localhost:3000/${doc.path.replace(/\\/g, '/')}`;
                        Linking.openURL(url).catch(err => Alert.alert('Error', 'Could not open file link'));
                    }
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Confirm Delete', 'Are you sure?', [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive', onPress: () => handleDelete(doc.id) }
                        ]);
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const StudyMode = ({ title, subtitle, icon, color, route, delay }: { title: string, subtitle: string, icon: any, color: string, route: string, delay: number }) => (
        <Animated.View entering={FadeInDown.delay(delay).springify()}>
            <TouchableOpacity onPress={() => router.push(route as any)} activeOpacity={0.8}>
                <Card style={[styles.modeCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
                    <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                        <Ionicons name={icon} size={32} color={color} />
                    </View>
                    <View style={styles.modeInfo}>
                        <Text style={styles.modeTitle}>{title}</Text>
                        <Text style={styles.modeSubtitle}>{subtitle}</Text>
                    </View>
                    <View style={[styles.arrowContainer, { backgroundColor: color + '10' }]}>
                        <Ionicons name="chevron-forward" size={20} color={color} />
                    </View>
                </Card>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        >
            <View style={styles.header}>
                <Animated.View entering={FadeInDown.duration(600)}>
                    <Text style={styles.title}>Study Zone</Text>
                    <Text style={styles.subtitle}>Choose your preferred way to learn</Text>
                </Animated.View>
            </View>

            <View style={styles.section}>
                <StudyMode
                    title="Flashcards"
                    subtitle="Master concepts with active recall"
                    icon="copy-outline"
                    color={Colors.secondary}
                    route="/flashcards"
                    delay={100}
                />

                <StudyMode
                    title="Exam Predictor"
                    subtitle="Practice with AI-generated questions"
                    icon="school-outline"
                    color={Colors.accent}
                    route="/questions"
                    delay={200}
                />
            </View>

            <View style={styles.section}>
                <Animated.View entering={FadeInDown.delay(300)} style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Sets</Text>
                    {documents.length > 0 && <Text style={styles.countBadge}>{documents.length}</Text>}
                </Animated.View>

                {documents.length === 0 && !loading ? (
                    <Animated.View entering={ZoomIn.delay(400)} style={styles.emptyState}>
                        <Ionicons name="documents-outline" size={48} color={Colors.textSecondary} />
                        <Text style={styles.emptyStateText}>No study sets yet. Upload a document to get started!</Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/upload')} style={styles.uploadBtn}>
                            <Text style={styles.uploadBtnText}>Upload Now</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ) : (
                    documents.map((doc, index) => (
                        <Animated.View
                            key={doc.id}
                            entering={FadeInRight.delay(400 + (index * 100)).springify()}
                            layout={Layout.springify()}
                        >
                            <TouchableOpacity
                                style={styles.recentItem}
                                onPress={() => {
                                    if (doc.status === 'completed') {
                                        // Intelligently decide where to navigate
                                        let hasFlashcards = false;
                                        try {
                                            if (doc.flashcards) {
                                                const parsed = JSON.parse(doc.flashcards);
                                                hasFlashcards = Array.isArray(parsed) && parsed.length > 0;
                                            }
                                        } catch (e) {
                                            console.error('Error parsing flashcards:', e);
                                        }

                                        if (hasFlashcards) {
                                            router.push({ pathname: '/flashcards', params: { documentId: doc.id } });
                                        } else {
                                            router.push({ pathname: '/questions', params: { documentId: doc.id } });
                                        }
                                    } else {
                                        Alert.alert('Processing', 'This set is still being generated.');
                                    }
                                }}
                            >
                                <View style={[
                                    styles.recentIcon,
                                    { backgroundColor: doc.status === 'completed' ? (doc.flashcards ? Colors.secondary + '15' : Colors.accent + '15') : Colors.warning + '15' }
                                ]}>
                                    <Ionicons
                                        name={doc.status === 'completed' ? (doc.flashcards ? "book" : "school") : "hourglass"}
                                        size={20}
                                        color={doc.status === 'completed' ? (doc.flashcards ? Colors.secondary : Colors.accent) : Colors.warning}
                                    />
                                </View>
                                <View style={styles.recentInfo}>
                                    <Text style={styles.recentTitle} numberOfLines={1}>{doc.filename}</Text>
                                    <View style={styles.recentMetaRow}>
                                        <Text style={styles.recentMeta}>
                                            {doc.status === 'completed' ? `Ready • ${new Date(doc.uploadedAt).toLocaleDateString()}` : 'Processing...'}
                                        </Text>
                                        {!doc.flashcards && doc.questions && (
                                            <View style={styles.examBadge}>
                                                <Text style={styles.examBadgeText}>Exam Set</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.moreButton} onPress={() => showOptions(doc)}>
                                    <Ionicons name="ellipsis-vertical" size={20} color={Colors.textSecondary} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </Animated.View>
                    ))
                )}
            </View>
            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: Spacing.xl,
        paddingTop: 80,
        paddingBottom: Spacing.lg,
    },
    title: {
        ...Typography.h1,
        fontSize: 34,
        color: Colors.text,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        marginTop: 8,
        fontSize: 16,
    },
    section: {
        paddingHorizontal: Spacing.xl,
        marginBottom: Spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
        gap: 8,
    },
    sectionTitle: {
        ...Typography.h3,
        fontSize: 18,
        color: Colors.text,
    },
    countBadge: {
        backgroundColor: Colors.border,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.textSecondary,
        overflow: 'hidden',
    },
    modeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        borderRadius: 20,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modeInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    modeTitle: {
        ...Typography.h2,
        fontSize: 18,
        marginBottom: 4,
    },
    modeSubtitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    arrowContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        backgroundColor: Colors.surface,
        borderRadius: 16,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    recentIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    recentInfo: {
        flex: 1,
        marginRight: 8,
    },
    recentTitle: {
        ...Typography.body,
        fontWeight: '600',
        color: Colors.text,
    },
    recentMeta: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    recentMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 2,
    },
    examBadge: {
        backgroundColor: Colors.accent + '15',
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 4,
    },
    examBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.accent,
        textTransform: 'uppercase',
    },
    moreButton: {
        padding: 8,
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: Colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        borderStyle: 'dashed',
    },
    emptyStateText: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    uploadBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    uploadBtnText: {
        ...Typography.caption,
        color: 'white',
        fontWeight: 'bold',
    },
});
