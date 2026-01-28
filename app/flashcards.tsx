import { Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

const logoImg = require('@/assets/images/logo.png');

import api from '@/services/api';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator } from 'react-native';

const { width, height } = Dimensions.get('window');

// No default mock cards - user must either select a document or generate by topic

export default function FlashcardsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const documentId = params.documentId;

    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(!!documentId);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [showTopicModal, setShowTopicModal] = useState(false);
    const [topic, setTopic] = useState('');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (documentId) {
            fetchDocumentCards();
        }
        // If no documentId, cards remain empty and we show topic generation UI
    }, [documentId]);

    const fetchDocumentCards = async () => {
        try {
            const response = await api.get(`/documents/${documentId}`);
            if (response.data && response.data.flashcards) {
                const parsed = JSON.parse(response.data.flashcards);
                if (Array.isArray(parsed)) {
                    setCards(parsed.map((c: any, i: number) => ({
                        id: String(i),
                        question: c.front,
                        answer: c.back
                    })));
                }
            } else {
                Alert.alert('Error', 'No flashcards found for this document.');
                setCards([]);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load flashcards.');
            setCards([]);
        } finally {
            setLoading(false);
        }
    };

    const translateX = useSharedValue(0);
    const rotate = useSharedValue(0);

    const onFlip = () => {
        setFlipped(!flipped);
        rotate.value = withSpring(flipped ? 0 : 180);
    };

    const frontStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotateY: `${rotate.value}deg` }
            ],
            backfaceVisibility: 'hidden',
        };
    });

    const backStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotateY: `${rotate.value + 180}deg` }
            ],
            backfaceVisibility: 'hidden',
        };
    });

    const swipeGesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = e.translationX;
        })
        .onEnd((e) => {
            if (Math.abs(e.translationX) > 100) {
                translateX.value = withSpring(e.translationX > 0 ? width : -width, {}, () => {
                    runOnJS(nextCard)();
                });
            } else {
                translateX.value = withSpring(0);
            }
        });

    const cardStyle = useAnimatedStyle(() => {
        const rotation = interpolate(
            translateX.value,
            [-width / 2, 0, width / 2],
            [-10, 0, 10],
            Extrapolate.CLAMP
        );

        return {
            transform: [
                { translateX: translateX.value },
                { rotate: `${rotation}deg` }
            ],
        };
    });

    const nextCard = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setFlipped(false);
            rotate.value = 0;
            translateX.value = 0;
        } else {
            Alert.alert("Completed!", "You've reviewed all cards.", [
                {
                    text: "Restart", onPress: () => {
                        setCurrentIndex(0);
                        setFlipped(false);
                        rotate.value = 0;
                        translateX.value = 0;
                    }
                },
                { text: "Finish", onPress: () => router.back() }
            ]);
        }
    };

    const generateByTopic = async () => {
        if (!topic.trim()) {
            Alert.alert('Error', 'Please enter a topic first.');
            return;
        }

        setGenerating(true);
        setShowTopicModal(false);

        try {
            // Generate flashcards
            const response = await api.post('/study/generate-by-topic', { topic: topic.trim() });
            if (response.data && response.data.flashcards) {
                const flashcardsData = response.data.flashcards;

                // Save as a document so it appears in Recent Sets
                const saveResponse = await api.post('/documents/save-topic', {
                    topic: topic.trim(),
                    flashcards: flashcardsData
                });

                if (saveResponse.data && saveResponse.data.document) {
                    const documentId = saveResponse.data.document.id;
                    setTopic('');
                    Alert.alert(
                        'Success',
                        `Generated ${flashcardsData.length} flashcards for "${topic}"!`,
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    // Navigate to the flashcards with the new document ID
                                    router.replace({ pathname: '/flashcards', params: { documentId } });
                                }
                            }
                        ]
                    );
                } else {
                    // Fallback: just set cards locally if save fails
                    setCards(flashcardsData.map((c: any, i: number) => ({
                        id: String(i),
                        question: c.front,
                        answer: c.back
                    })));
                    setTopic('');
                    Alert.alert('Success', `Generated ${flashcardsData.length} flashcards for "${topic}"!`);
                }
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to generate flashcards. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setFlipped(false);
            rotate.value = withSpring(0);
        }
    };

    const goToNext = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setFlipped(false);
            rotate.value = withSpring(0);
        }
    };

    if (loading || generating) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={{ marginTop: 20, ...Typography.body }}>
                    {generating ? 'Generating Flashcards...' : 'Loading Flashcards...'}
                </Text>
            </View>
        );
    }

    // Safety check for cards
    if (!cards || cards.length === 0) {
        // This will show the empty state UI
    } else if (currentIndex >= cards.length) {
        // Reset to valid index if out of bounds
        setCurrentIndex(0);
        return null;
    }

    const currentCard = cards.length > 0 && currentIndex < cards.length
        ? cards[currentIndex]
        : { question: 'No cards available', answer: '' };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <View style={styles.titleContainer}>
                        <Text style={styles.headerTitle}>Flashcards</Text>
                        <Text style={styles.headerSubtitle}>{currentIndex + 1} of {cards.length}</Text>
                    </View>
                    {documentId ? (
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/questions', params: { documentId: documentId } })}
                            style={styles.quizButton}
                        >
                            <Ionicons name="school-outline" size={24} color={Colors.primary} />
                        </TouchableOpacity>
                    ) : (
                        <View style={{ width: 40 }} />
                    )}
                </View>

                {cards.length === 0 ? (
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={100}
                    >
                        <ScrollView
                            contentContainerStyle={styles.emptyScrollContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.emptyContainer}>
                                <Ionicons name="albums-outline" size={80} color={Colors.textSecondary} />
                                <Text style={styles.emptyTitle}>No Flashcards Yet</Text>
                                <Text style={styles.emptySubtitle}>
                                    Generate flashcards by entering a topic below
                                </Text>

                                <View style={styles.topicInputContainer}>
                                    <TextInput
                                        style={styles.topicInput}
                                        placeholder="e.g., Photosynthesis, World War II, Calculus..."
                                        placeholderTextColor={Colors.textSecondary}
                                        value={topic}
                                        onChangeText={setTopic}
                                        onSubmitEditing={generateByTopic}
                                        returnKeyType="done"
                                    />
                                    <TouchableOpacity
                                        style={[styles.generateButton, !topic.trim() && styles.generateButtonDisabled]}
                                        onPress={generateByTopic}
                                        disabled={!topic.trim()}
                                    >
                                        <Ionicons name="sparkles" size={20} color="white" style={{ marginRight: 8 }} />
                                        <Text style={styles.generateButtonText}>Generate</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.uploadPrompt}>
                                    <Ionicons name="cloud-upload-outline" size={24} color={Colors.primary} />
                                    <Text style={styles.uploadPromptText}>
                                        Or upload a document from the Upload tab
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                ) : (
                    <>
                        <View style={styles.cardContainer}>
                            <GestureDetector gesture={swipeGesture}>
                                <Animated.View style={[styles.swipeWrapper, cardStyle]}>
                                    <TouchableOpacity activeOpacity={1} onPress={onFlip} style={styles.cardTouch}>
                                        <Animated.View style={[styles.card, styles.cardFront, frontStyle]}>
                                            <View style={styles.cardContent}>
                                                <Text style={styles.cardLabel}>QUESTION</Text>
                                                <Text style={styles.cardText}>{currentCard.question}</Text>
                                            </View>
                                            <Text style={styles.flipHint}>Tap to flip</Text>
                                        </Animated.View>
                                        <Animated.View style={[styles.card, styles.cardBack, backStyle]}>
                                            <View style={styles.cardContent}>
                                                <Text style={styles.cardLabel}>ANSWER</Text>
                                                <Text style={styles.cardText}>{currentCard.answer}</Text>
                                            </View>
                                            <View style={styles.cardFooter}>
                                                <Text style={styles.flipHint}>Tap to flip</Text>
                                            </View>
                                        </Animated.View>
                                    </TouchableOpacity>
                                </Animated.View>
                            </GestureDetector>
                        </View>

                        <View style={styles.controls}>
                            <TouchableOpacity
                                style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
                                onPress={goToPrevious}
                                disabled={currentIndex === 0}
                            >
                                <Ionicons name="chevron-back" size={32} color={currentIndex === 0 ? Colors.border : Colors.primary} />
                            </TouchableOpacity>

                            <View style={styles.progressContainer}>
                                <Text style={styles.progressText}>{currentIndex + 1} / {cards.length}</Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.navButton, currentIndex === cards.length - 1 && styles.navButtonDisabled]}
                                onPress={goToNext}
                                disabled={currentIndex === cards.length - 1}
                            >
                                <Ionicons name="chevron-forward" size={32} color={currentIndex === cards.length - 1 ? Colors.border : Colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </GestureHandlerRootView >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 20,
        ...Shadows.small,
    },
    quizButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 20,
        ...Shadows.small,
    },
    titleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        ...Typography.h2,
        color: Colors.text,
    },
    headerSubtitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl
    },
    swipeWrapper: { width: '100%', height: height * 0.6 },
    cardTouch: { width: '100%', height: '100%' },
    card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: Colors.surface,
        borderRadius: 30,
        padding: Spacing.xl,
        justifyContent: 'space-between',
        alignItems: 'center',
        ...Shadows.medium,
        backfaceVisibility: 'hidden',
    },
    cardFront: { backgroundColor: Colors.surface },
    cardBack: { backgroundColor: '#F5F3FF' }, // Light purple tint
    cardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardLabel: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '800',
        marginBottom: 24,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    cardText: {
        ...Typography.h2,
        textAlign: 'center',
        lineHeight: 36,
        color: Colors.text,
    },
    cardFooter: {
        marginTop: 20,
    },
    flipHint: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: Spacing.xl,
        paddingBottom: 50,
        paddingTop: 20,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        ...Shadows.small,
    },
    reviewBtn: {},
    knowBtn: {},
    btnText: {
        ...Typography.body,
        marginLeft: 8,
        fontWeight: '600',
    },
    emptyScrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingVertical: 60,
    },
    emptyTitle: {
        ...Typography.h1,
        fontSize: 24,
        marginTop: 24,
        color: Colors.text,
    },
    emptySubtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 32,
    },
    topicInputContainer: {
        width: '100%',
        marginBottom: 24,
    },
    topicInput: {
        ...Typography.body,
        backgroundColor: Colors.surface,
        borderWidth: 2,
        borderColor: Colors.border,
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginBottom: 16,
        color: Colors.text,
    },
    generateButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        ...Shadows.medium,
    },
    generateButtonDisabled: {
        backgroundColor: Colors.border,
        opacity: 0.5,
    },
    generateButtonText: {
        ...Typography.body,
        color: 'white',
        fontWeight: 'bold',
    },
    uploadPrompt: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 32,
        padding: 16,
        backgroundColor: Colors.primaryLight,
        borderRadius: 12,
    },
    uploadPromptText: {
        ...Typography.caption,
        color: Colors.primary,
        marginLeft: 12,
        fontWeight: '600',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingBottom: 50,
        paddingTop: 20,
    },
    navButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.small,
    },
    navButtonDisabled: {
        opacity: 0.3,
    },
    progressContainer: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: Colors.surface,
        borderRadius: 20,
        ...Shadows.small,
    },
    progressText: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.primary,
    },
});
