import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const logoImg = require('@/assets/images/icon.png');
const { width } = Dimensions.get('window');

const categories = ['Objective', 'Essay', 'Case Study'];

interface Question {
    id?: string;
    category?: string;
    question: string;
    options?: string[];
    answer?: string;
    hint?: string;
}

export default function QuestionsScreen() {
    const router = useRouter();
    const [topic, setTopic] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Objective');

    const params = useLocalSearchParams();
    const documentId = params.documentId;

    useEffect(() => {
        if (documentId) {
            fetchDocumentQuestions();
        }
    }, [documentId]);

    const parseQuestions = (data: any) => {
        const newQuestions: Question[] = [];

        if (data.objective && Array.isArray(data.objective)) {
            data.objective.forEach((q: any, i: number) => {
                newQuestions.push({
                    id: `obj-${Date.now()}-${i}`,
                    category: 'Objective',
                    question: q.question,
                    options: q.options,
                    answer: q.answer
                });
            });
        }

        if (data.essay && Array.isArray(data.essay)) {
            data.essay.forEach((q: any, i: number) => {
                newQuestions.push({
                    id: `essay-${Date.now()}-${i}`,
                    category: 'Essay',
                    question: q.question,
                    answer: q.answer
                });
            });
        }

        if (data.caseStudy && Array.isArray(data.caseStudy)) {
            data.caseStudy.forEach((q: any, i: number) => {
                newQuestions.push({
                    id: `case-${Date.now()}-${i}`,
                    category: 'Case Study',
                    question: `${q.scenario}\n\nQ: ${q.question}`,
                    answer: q.answer
                });
            });
        }

        return newQuestions;
    };

    const fetchDocumentQuestions = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/documents/${documentId}`);
            if (response.data && response.data.questions) {
                // If it's a string (from DB text column), parse it. If already JSON, use it.
                const parsed = typeof response.data.questions === 'string'
                    ? JSON.parse(response.data.questions)
                    : response.data.questions;

                const newQuestions = parseQuestions(parsed);
                setQuestions(newQuestions);

                if (newQuestions.length === 0) {
                    Alert.alert('Notice', 'No questions found in this document.');
                }
            }
        } catch (error) {
            console.error('Failed to load doc questions:', error);
            Alert.alert('Error', 'Failed to load questions.');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!topic.trim()) {
            Alert.alert('Error', 'Please enter a topic to generate questions');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/study/generate-topic', { topic });
            // The API now returns { objective: [], essay: [], caseStudy: [] } directly
            if (response.data) {
                const generated = parseQuestions(response.data);
                setQuestions(generated);

                if (generated.length === 0) {
                    Alert.alert('Notice', 'No questions were generated for this topic. Try another keyword.');
                } else {
                    Alert.alert(
                        'Success',
                        `Generated ${generated.length} questions for "${topic}"! This set has been saved to your Study Zone.`,
                        [{ text: 'Great!' }]
                    );
                }
            }
        } catch (error: any) {
            console.error('Generation failed:', error);
            const message = error.response?.data?.error || 'Failed to generate questions. Please try again.';
            Alert.alert('AI Generation Error', message);
        } finally {
            setLoading(false);
        }
    };

    const filteredQuestions = questions.filter(q => q.category === selectedCategory);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.title}>Exam Predictor</Text>
                    <Text style={styles.subtitle}>AI-Powered Questions</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.searchContainer}>
                <Input
                    placeholder="Enter topic (e.g. Human Anatomy)"
                    value={topic}
                    onChangeText={setTopic}
                    containerStyle={styles.topicInput}
                    icon="search-outline"
                />
                <Button
                    title="Generate"
                    onPress={handleGenerate}
                    loading={loading}
                    style={styles.generateBtn}
                    textStyle={{ fontSize: 14 }}
                />
            </View>

            {questions.length > 0 && (
                <View style={styles.filterContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.filterBtn,
                                    selectedCategory === cat && styles.filterBtnActive
                                ]}
                                onPress={() => setSelectedCategory(cat)}
                            >
                                <Text style={[
                                    styles.filterText,
                                    selectedCategory === cat && styles.filterTextActive
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.secondary} />
                        <Text style={styles.loadingText}>Groq is predicting your exam...</Text>
                    </View>
                ) : questions.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="sparkles-outline" size={64} color={Colors.primary + '40'} />
                        <Text style={styles.emptyText}>Enter a topic above to generate AI-predicted exam questions.</Text>
                    </View>
                ) : filteredQuestions.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No {selectedCategory} questions generated for this topic.</Text>
                    </View>
                ) : (
                    filteredQuestions.map((q, index) => (
                        <Animated.View key={q.id} entering={FadeInDown.delay(index * 100)}>
                            <Card style={styles.questionCard}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.badge, { backgroundColor: Colors.primary + '10' }]}>
                                        <Text style={[styles.badgeText, { color: Colors.primary }]}>{q.category}</Text>
                                    </View>
                                    <TouchableOpacity>
                                        <Ionicons name="bookmark-outline" size={20} color={Colors.textSecondary} />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.questionText}>{q.question}</Text>

                                {q.options && (
                                    <View style={styles.optionsContainer}>
                                        {q.options.map((opt, i) => (
                                            <TouchableOpacity key={i} style={styles.optionBtn}>
                                                <View style={styles.radio} />
                                                <Text style={styles.optionText}>{opt}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}

                                {q.hint && (
                                    <View style={styles.hintContainer}>
                                        <Text style={styles.hintTitle}>AI Study Hint:</Text>
                                        <Text style={styles.hintText}>{q.hint}</Text>
                                    </View>
                                )}

                                <View style={styles.cardFooter}>
                                    <Button
                                        title="View Answer"
                                        variant="outline"
                                        style={styles.actionBtn}
                                        textStyle={{ fontSize: 14 }}
                                        onPress={() => Alert.alert('Answer', q.answer || 'Not provided')}
                                    />
                                    <TouchableOpacity style={styles.flagBtn}>
                                        <Ionicons name="flag-outline" size={18} color={Colors.textSecondary} />
                                        <Text style={styles.flagText}>Report</Text>
                                    </TouchableOpacity>
                                </View>
                            </Card>
                        </Animated.View>
                    ))
                )}
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.small,
    },
    headerTitleContainer: { alignItems: 'center' },
    title: { ...Typography.h3, color: Colors.text, fontSize: 18 },
    subtitle: { ...Typography.caption, color: Colors.textSecondary },
    searchContainer: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    topicInput: {
        flex: 1,
        marginBottom: 0,
        height: 50,
        borderRadius: 25,
        borderWidth: 0,
        backgroundColor: Colors.surface,
        ...Shadows.small,
    },
    generateBtn: {
        height: 50,
        paddingHorizontal: 24,
        backgroundColor: Colors.secondary,
        borderRadius: 25,
        ...Shadows.small,
    },
    filterContainer: {
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    filterScroll: { paddingHorizontal: Spacing.xl },
    filterBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        marginRight: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    filterBtnActive: {
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    filterText: { ...Typography.caption, fontWeight: '600' },
    filterTextActive: { color: 'white' },
    content: { flex: 1, padding: Spacing.xl },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    loadingText: {
        ...Typography.body,
        marginTop: 16,
        color: Colors.textSecondary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
        opacity: 0.5,
    },
    emptyText: {
        ...Typography.body,
        textAlign: 'center',
        marginTop: 16,
        color: Colors.textSecondary,
        paddingHorizontal: 40,
    },
    questionCard: { marginBottom: Spacing.lg, padding: Spacing.lg },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12
    },
    badgeText: { fontSize: 12, fontWeight: '700' },
    questionText: {
        ...Typography.body,
        fontWeight: '600',
        lineHeight: 24,
        marginBottom: 20
    },
    optionsContainer: { marginBottom: 20 },
    optionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: Colors.border,
        marginRight: 12,
    },
    optionText: { ...Typography.body, fontSize: 15 },
    hintContainer: {
        backgroundColor: Colors.secondary + '10',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    hintTitle: {
        ...Typography.caption,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 4
    },
    hintText: { ...Typography.caption, color: Colors.text, lineHeight: 20 },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    actionBtn: {
        height: 36,
        paddingHorizontal: 20,
        borderRadius: 18,
        borderColor: Colors.secondary,
        borderWidth: 1,
    },
    flagBtn: { flexDirection: 'row', alignItems: 'center' },
    flagText: {
        ...Typography.caption,
        marginLeft: 4,
        fontSize: 12
    },
});
