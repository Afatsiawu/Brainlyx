import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography } from '@/constants/theme';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    const [isPaused, setIsPaused] = useState(false);
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
            setCurrentSegment(0);
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
            setCurrentSegment(0);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to generate podcast.');
        } finally {
            setLoading(false);
        }
    };

    const speakSegment = (index: number) => {
        if (!podcast || index >= podcast.segments.length) {
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentSegment(0);
            return;
        }
        setCurrentSegment(index);
        const seg = podcast.segments[index];
        const options: Speech.SpeechOptions = {
            pitch: seg.host === 'Alex' ? 1.05 : 0.95,
            rate: 0.95,
            onDone: () => {
                speakSegment(index + 1);
            },
            onError: () => {
                setIsPlaying(false);
                setIsPaused(false);
            },
        };
        Speech.speak(seg.text, options);
    };

    const play = () => {
        if (!podcast) return;
        setIsPlaying(true);
        setIsPaused(false);
        speakSegment(currentSegment);
    };

    const pause = () => {
        Speech.pause();
        setIsPaused(true);
        setIsPlaying(false);
    };

    const resume = () => {
        Speech.resume();
        setIsPaused(false);
        setIsPlaying(true);
    };

    const stop = () => {
        Speech.stop();
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentSegment(0);
    };

    const skipForward = () => {
        Speech.stop();
        const next = Math.min(currentSegment + 1, (podcast?.segments.length || 1) - 1);
        setIsPlaying(true);
        setIsPaused(false);
        speakSegment(next);
    };

    const skipBackward = () => {
        Speech.stop();
        const prev = Math.max(currentSegment - 1, 0);
        setIsPlaying(true);
        setIsPaused(false);
        speakSegment(prev);
    };

    const downloadScript = async () => {
        if (!podcast) return;
        const script = `${podcast.title}\n\n${podcast.segments
            .map((s) => `${s.host}: ${s.text}`)
            .join('\n\n')}`;
        try {
            await Share.share({
                message: script,
                title: podcast.title,
            });
        } catch {
            Alert.alert('Error', 'Could not share the podcast script.');
        }
    };

    const progress = podcast ? ((currentSegment + 1) / podcast.segments.length) * 100 : 0;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { stop(); router.back(); }} style={styles.backButton}>
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
                            <Text style={styles.inputLabel}>Enter a topic to turn into a podcast:</Text>
                            <Input
                                placeholder="e.g. Photosynthesis"
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
                    {documentId && !loading && !podcast && (
                        <Button
                            title="Generate Podcast from Document"
                            onPress={generateFromDocument}
                            loading={loading}
                            style={styles.generateBtn}
                        />
                    )}
                </View>
            )}

            {podcast && (
                <View style={styles.podcastContainer}>
                    <Text style={styles.podcastTitle}>{podcast.title}</Text>

                    {/* Progress bar */}
                    <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { width: `${progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>
                        Segment {currentSegment + 1} of {podcast.segments.length}
                    </Text>

                    {/* Playback controls */}
                    <View style={styles.controlsRow}>
                        <TouchableOpacity style={styles.controlBtn} onPress={skipBackward} disabled={!isPlaying && !isPaused}>
                            <Ionicons name="play-back" size={20} color={Colors.text} />
                            <Text style={styles.controlLabel}>10s</Text>
                        </TouchableOpacity>

                        {!isPlaying && !isPaused ? (
                            <TouchableOpacity style={[styles.controlBtn, styles.playBtn]} onPress={play}>
                                <Ionicons name="play" size={28} color="white" />
                            </TouchableOpacity>
                        ) : isPaused ? (
                            <TouchableOpacity style={[styles.controlBtn, styles.playBtn]} onPress={resume}>
                                <Ionicons name="play" size={28} color="white" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={[styles.controlBtn, styles.playBtn]} onPress={pause}>
                                <Ionicons name="pause" size={28} color="white" />
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.controlBtn} onPress={skipForward} disabled={!isPlaying && !isPaused}>
                            <Ionicons name="play-forward" size={20} color={Colors.text} />
                            <Text style={styles.controlLabel}>10s</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.secondaryControls}>
                        <TouchableOpacity style={styles.secondaryBtn} onPress={stop}>
                            <Ionicons name="stop" size={18} color={Colors.error} />
                            <Text style={[styles.secondaryBtnText, { color: Colors.error }]}>Stop</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryBtn} onPress={downloadScript}>
                            <Ionicons name="download-outline" size={18} color={Colors.primary} />
                            <Text style={[styles.secondaryBtnText, { color: Colors.primary }]}>Download Script</Text>
                        </TouchableOpacity>
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
                            stop();
                            setPodcast(null);
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
    progressContainer: {
        height: 6,
        backgroundColor: Colors.border,
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: Spacing.sm,
    },
    progressBar: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },
    progressText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.lg,
        marginBottom: Spacing.md,
    },
    controlBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.7)',
        shadowColor: '#4C4ED1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    controlLabel: {
        fontSize: 9,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginTop: 2,
    },
    playBtn: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.primary,
        borderWidth: 0,
        shadowColor: '#4C4ED1',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 18,
        elevation: 8,
    },
    secondaryControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.xl,
        marginBottom: Spacing.xl,
    },
    secondaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
    },
    secondaryBtnText: {
        ...Typography.caption,
        fontWeight: '600',
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
