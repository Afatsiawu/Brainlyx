import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    FadeIn,
    FadeInDown,
    FadeInUp,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function RecordLectureScreen() {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [transcribing, setTranscribing] = useState(false);

    // Topic State
    const [showTopicModal, setShowTopicModal] = useState(false);
    const [topic, setTopic] = useState('');

    const router = useRouter();

    // Animation values for the ripple effect
    const ripple1 = useSharedValue(0);
    const ripple2 = useSharedValue(0);
    const ripple3 = useSharedValue(0);

    const timerRef = useRef<any>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (recording) stopRecording();
        };
    }, []);

    const startRippleAnimation = () => {
        ripple1.value = 0;
        ripple2.value = 0;
        ripple3.value = 0;

        const createRipple = (sharedVal: any, delay: number) => {
            sharedVal.value = withDelay(
                delay,
                withRepeat(
                    withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
                    -1,
                    false
                )
            );
        };

        createRipple(ripple1, 0);
        createRipple(ripple2, 600);
        createRipple(ripple3, 1200);
    };

    const stopRippleAnimation = () => {
        ripple1.value = withTiming(0);
        ripple2.value = withTiming(0);
        ripple3.value = withTiming(0);
    };

    const handleStartPress = () => {
        setShowTopicModal(true);
    };

    const confirmStartRecording = async () => {
        setShowTopicModal(false);
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== 'granted') {
                Alert.alert('Permission denied', 'We need microphone access to record lectures.');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(recording);
            setIsRecording(true);
            setDuration(0);

            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);

            startRippleAnimation();

        } catch (err) {
            console.error('Failed to start recording', err);
            Alert.alert('Error', 'Could not start recording');
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        setIsRecording(false);
        setRecording(null);
        if (timerRef.current) clearInterval(timerRef.current);
        stopRippleAnimation();

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            if (!uri) return;

            setTranscribing(true);

            // Create FormData for the audio upload
            const formData = new FormData();
            formData.append('audio', {
                uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
                name: `lecture-${Date.now()}.m4a`,
                type: 'audio/m4a',
            } as any);

            // Add topic if present
            if (topic.trim()) {
                formData.append('topic', topic.trim());
            }

            const response = await api.post('/study/transcribe-and-generate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000, // Increased timeout for generation
            });

            setTranscribing(false);
            setTopic(''); // Reset topic

            Alert.alert(
                'Success!',
                'Lecture transcribed. AI has generated notes and flashcards based on your topic.',
                [
                    { text: 'Study Now', onPress: () => router.push('/(tabs)/study') }
                ]
            );
        } catch (error: any) {
            console.error('Transcription failed:', error);
            setTranscribing(false);
            Alert.alert('Error', 'AI failed to process the audio. Check your connection.');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const RippleRing = ({ animValue }: { animValue: any }) => {
        const style = useAnimatedStyle(() => ({
            transform: [{ scale: 0.8 + animValue.value * 1.5 }],
            opacity: interpolate(animValue.value, [0, 0.8, 1], [0.6, 0.2, 0])
        }));
        return <Animated.View style={[styles.ripple, style]} />;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="close" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Record Session</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.mainContent}>

                {/* Timer Section */}
                <View style={styles.timerContainer}>
                    <Animated.Text entering={FadeInDown.delay(200)} style={styles.timer}>
                        {formatTime(duration)}
                    </Animated.Text>
                    <Animated.View entering={FadeInDown.delay(300)} style={[styles.statusBadge, isRecording ? styles.statusActive : styles.statusInactive]}>
                        <View style={[styles.statusDot, { backgroundColor: isRecording ? Colors.error : Colors.textSecondary }]} />
                        <Text style={[styles.statusText, { color: isRecording ? Colors.error : Colors.textSecondary }]}>
                            {isRecording ? 'RECORDING LIVE' : 'READY TO RECORD'}
                        </Text>
                    </Animated.View>
                    {isRecording && topic ? (
                        <Animated.View entering={FadeIn} style={styles.topicBadge}>
                            <Text style={styles.topicText}>Topic: {topic}</Text>
                        </Animated.View>
                    ) : null}
                </View>

                {/* Visualizer / Button */}
                <View style={styles.visualizerContainer}>
                    {isRecording && (
                        <View style={StyleSheet.absoluteFill}>
                            <RippleRing animValue={ripple1} />
                            <RippleRing animValue={ripple2} />
                            <RippleRing animValue={ripple3} />
                        </View>
                    )}

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={isRecording ? stopRecording : handleStartPress}
                        style={[
                            styles.micButton,
                            {
                                backgroundColor: isRecording ? Colors.background : Colors.error,
                                borderColor: isRecording ? Colors.error : Colors.error,
                                borderWidth: isRecording ? 4 : 0
                            }
                        ]}
                    >
                        <Ionicons
                            name={isRecording ? "stop" : "mic"}
                            size={44}
                            color={isRecording ? Colors.error : "white"}
                        />
                    </TouchableOpacity>
                </View>

                {/* Instructions */}
                <Animated.View entering={FadeInUp.delay(400)} style={styles.tipsContainer}>
                    <Text style={styles.tipTitle}>Quick Tips</Text>
                    <View style={styles.tipItem}>
                        <Ionicons name="wifi-outline" size={20} color={Colors.secondary} />
                        <Text style={styles.tipText}>Ensure you have a stable connection.</Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Ionicons name="volume-high-outline" size={20} color={Colors.secondary} />
                        <Text style={styles.tipText}>Speak clearly into the microphone.</Text>
                    </View>
                </Animated.View>

            </View>

            {/* Topic Input Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showTopicModal}
                onRequestClose={() => setShowTopicModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>What are you recording?</Text>
                        <Text style={styles.modalSubtitle}>Provide a topic so AI can generate better notes and flashcards.</Text>

                        <Input
                            placeholder="e.g. Thermodynamics, contract law..."
                            value={topic}
                            onChangeText={setTopic}
                            containerStyle={{ marginBottom: 20 }}
                            autoFocus
                        />

                        <Button
                            title="Start Recording"
                            onPress={confirmStartRecording}
                            style={{ borderRadius: 12 }}
                        />
                        <TouchableOpacity onPress={() => setShowTopicModal(false)} style={styles.modalCancel}>
                            <Text style={styles.modalCancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {transcribing && (
                <Animated.View entering={FadeIn} style={styles.overlay}>
                    <View style={styles.loadingCard}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingTitle}>Transcribing...</Text>
                        <Text style={styles.loadingSubtitle}>Generating {topic ? 'focused ' : ''}notes & flashcards</Text>
                    </View>
                </Animated.View>
            )}
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
        paddingHorizontal: Spacing.xl,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.small,
    },
    headerTitle: {
        ...Typography.h3,
        fontSize: 18,
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 40,
    },
    timerContainer: {
        alignItems: 'center',
    },
    timer: {
        ...Typography.h1,
        fontSize: 72,
        fontWeight: '300',
        color: Colors.text,
        marginBottom: 16,
        fontVariant: ['tabular-nums'],
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    statusActive: {
        backgroundColor: Colors.error + '15',
    },
    statusInactive: {
        backgroundColor: Colors.textSecondary + '10',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusText: {
        ...Typography.caption,
        fontWeight: '700',
        letterSpacing: 1,
    },
    topicBadge: {
        marginTop: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: Colors.primary + '10',
        borderRadius: 12,
    },
    topicText: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '600',
    },
    visualizerContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    micButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        ...Shadows.medium,
    },
    ripple: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.error,
        alignSelf: 'center',
        top: 50,
        left: 50,
        zIndex: 0,
    },
    tipsContainer: {
        width: '80%',
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: 24,
        ...Shadows.small,
    },
    tipTitle: {
        ...Typography.h3,
        fontSize: 16,
        marginBottom: 16,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    tipText: {
        ...Typography.body,
        fontSize: 14,
        color: Colors.textSecondary,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    loadingCard: {
        alignItems: 'center',
    },
    loadingTitle: {
        ...Typography.h2,
        fontSize: 24,
        marginTop: 24,
        marginBottom: 8,
    },
    loadingSubtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    modalContent: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        ...Shadows.medium,
    },
    modalTitle: {
        ...Typography.h2,
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center',
    },
    modalSubtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    modalCancel: {
        marginTop: 16,
        padding: 12,
        alignItems: 'center',
    },
    modalCancelText: {
        ...Typography.body,
        color: Colors.textSecondary,
        fontWeight: '600',
    }
});
