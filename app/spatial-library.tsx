import { Colors, Spacing, Typography } from '@/constants/theme';
import { ClayCard } from '@/components/ui/Clay';
import { AutoRotating3D, Tilt3DCard } from '@/components/ui/ThreeD';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Doc {
    id: number;
    filename: string;
    status: string;
    type: string;
}

export default function SpatialLibraryScreen() {
    const router = useRouter();
    const [documents, setDocuments] = useState<Doc[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await api.get('/documents');
                setDocuments(response.data || []);
            } catch (error) {
                console.error('Failed to fetch docs', error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    // Arrange documents in a 3D-ish grid

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.title}>Spatial Library</Text>
                    <Text style={styles.subtitle}>3D map of your knowledge</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.infoBanner}>
                <Ionicons name="information-circle-outline" size={16} color={Colors.textSecondary} />
                <Text style={styles.infoText}>
                    A spatial 3D view of your documents. On AR/VR hardware, these would float in your physical space with connection strings between them.
                </Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Mapping your knowledge...</Text>
                </View>
            ) : documents.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cube-outline" size={64} color={Colors.border} />
                    <Text style={styles.emptyText}>No documents yet. Upload some to see them in 3D.</Text>
                </View>
            ) : (
                <View style={styles.space}>
                    <AutoRotating3D size={80} duration={20000} tilt={8} style={styles.orb}>
                        <View style={styles.orbInner}>
                            <Ionicons name="library" size={28} color="white" />
                        </View>
                    </AutoRotating3D>
                    <Text style={styles.orbLabel}>Knowledge Core</Text>

                    <View style={styles.docGrid}>
                        {documents.map((doc, i) => (
                            <Tilt3DCard key={doc.id} style={styles.docCard}>
                                <ClayCard style={styles.docCardInner} radius={20}>
                                    <View style={styles.docIcon}>
                                        <Ionicons
                                            name={doc.type === 'audio' ? 'mic' : 'document-text'}
                                            size={20}
                                            color={Colors.primary}
                                        />
                                    </View>
                                    <Text style={styles.docName} numberOfLines={2}>{doc.filename}</Text>
                                    <Text style={styles.docStatus}>{doc.status}</Text>
                                </ClayCard>
                            </Tilt3DCard>
                        ))}
                    </View>
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
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginHorizontal: Spacing.xl,
        marginBottom: Spacing.lg,
        padding: Spacing.md,
        backgroundColor: Colors.primaryLight,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.6)',
    },
    infoText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        flex: 1,
        lineHeight: 18,
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
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 80,
        paddingHorizontal: Spacing.xl,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 16,
    },
    space: {
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    orb: {
        marginBottom: Spacing.sm,
    },
    orbInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.35)',
        shadowColor: '#4C4ED1',
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
    },
    orbLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: Spacing.xl,
        fontWeight: '600',
    },
    docGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: Spacing.md,
    },
    docCard: {
        width: 140,
    },
    docCardInner: {
        padding: Spacing.md,
        alignItems: 'center',
        gap: 8,
    },
    docIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    docName: {
        ...Typography.caption,
        color: Colors.text,
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 12,
    },
    docStatus: {
        fontSize: 10,
        color: Colors.textSecondary,
        textTransform: 'capitalize',
    },
});
