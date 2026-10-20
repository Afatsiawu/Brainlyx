import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography } from '@/constants/theme';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Segment {
    host: string;
    text: string;
}

interface PodcastData {
    title: string;
    segments: Segment[];
}

export default function PodcastScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const documentId = params.documentId as string | undefined;

    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [podcast, setPodcast] = useState<PodcastData | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSegment, setCurrentSegment] = useState(0);

    useEffect(() => {
        if (documentId) {
            generateFromDocument();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documentId]);

    const generateFromDocument = async () => {
        if (!documentId) return;
        setLoading(true);
        try {
            const response = await api.post(`/study/generate-podcast/${documentId}`, {});
            setPodcast(response.data);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to generate podcast.');
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
            const response = await api.post('/study/generate-podcast-by-topic', { topic: topic.trim() });
            setPodcast(response.data);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to generate podcast.');
        } finally {
            setLoading(false);
        }
    };

    const playPodcast = () => {
        if (!podcast) return;
        setIsPlaying(true);
        setCurrentSegment(0);

        const speakSegment = (index: number) => {
            if (index >= podcast.segments.length) {
                setIsPlaying(false);
                setCurrentSegment(0);
                return;
            }
            setCurrentSegment(index);
            const seg = podcast.segments[index];
            // Alex = slightly higher pitch, Sam = slightly lower
            const options: Speech.SpeechOptions = {
                pitch: seg.host === 'Alex' ? 1.1 : 0.9,
                rate: 0.95,
                onDone: () => speakSegment(index + 1),
                onError: () => {
                    setIsPlaying(false);
                },
            };
            Speech.speak(seg.text, options);
        };

        speakSegment(0);
    };

    const stopPodcast = () => {
        Speech.stop();
        setIsPlaying(false);
        setCurrentSegment(0);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.title}>Podcast</Text>
                    <Text style={styles.subtitle}>Turn any topic into an audio lesson</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {!podcast && (
                <View style={styles.inputSection}>
                    {!documentId && (
                        <>
                            <Input
                                placeholder="Enter a topic (e.g. Photosynthesis)"
                                value={topic}
                                onChangeText={setTopic}
                                containerStyle={styles.topicInput}
                                icon="mic-outline"
                            />
                            <Button
                                title="Generate Podcast"
                                onPress={generateFromTopic}
                                loading={loading}
                                style={styles.generateBtn}
                            />
                        </>
                    )}
                    {documentId && loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.secondary} />
                            <Text style={styles.loadingText}>Creating your podcast...</Text>
                        </View>
                    )}
                </View>
            )}

            {podcast && (
                <View style={styles.podcastContainer}>
                    <Text style={styles.podcastTitle}>{podcast.title}</Text>

                    {/* Playback controls */}
                    <View style={styles.controlsRow}>
                        {isPlaying ? (
                            <Button title="Stop" onPress={stopPodcast} variant="outline" style={styles.controlBtn} />
                        ) : (
                            <Button title="Play Podcast" onPress={playPodcast} style={styles.controlBtn} icon={<Ionicons name="play" size={18} color="white" />} />
                        )}
                    </View>

                    {/* Script */}
                    <View style={styles.scriptContainer}>
                        {podcast.segments.map((seg, idx) => (
                            <View
                                key={idx}
                                style={[
                                    styles.segment,
                                    seg.host === 'Alex' ? styles.alexSegment : styles.samSegment,
                                    isPlaying && idx === currentSegment && styles.activeSegment,
                                ]}
                            >
                                <Text style={[styles.hostLabel, { color: seg.host === 'Alex' ? Colors.primary : Colors.secondary }]}>
                                    {seg.host}
                                </Text>
                                <Text style={styles.segmentText}>{seg.text}</Text>
                            </View>
                        ))}
                    </View>

                    <Button
                        title="Generate New Podcast"
                        onPress={() => {
                            setPodcast(null);
                            stopPodcast();
                        }}
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
    podcastContainer: {
        padding: Spacing.xl,
    },
    podcastTitle: {
        ...Typography.h1,
        fontSize: 24,
        color: Colors.text,
        marginBottom: Spacing.lg,
        textAlign: 'center',
    },
    controlsRow: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    controlBtn: {
        height: 52,
        paddingHorizontal: 32,
        borderRadius: 26,
    },
    scriptContainer: {
        gap: Spacing.md,
    },
    segment: {
        padding: Spacing.lg,
        borderRadius: 20,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.7)',
        shadowColor: '#4C4ED1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 6,
    },
    alexSegment: {
        backgroundColor: Colors.primaryLight,
    },
    samSegment: {
        backgroundColor: '#F3E8FF',
    },
    activeSegment: {
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    hostLabel: {
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    segmentText: {
        ...Typography.body,
        color: Colors.text,
        lineHeight: 22,
    },
});
