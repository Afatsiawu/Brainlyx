import { Colors, Spacing, Typography } from '@/constants/theme';
import { ClayChip } from '@/components/ui/Clay';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
    id: string;
    sender: 'user' | 'alex' | 'sam';
    text: string;
}

const HOSTS = [
    { name: 'Alex', color: Colors.primary, avatar: 'A', role: 'Research Lead' },
    { name: 'Sam', color: Colors.secondary, avatar: 'S', role: 'Fact-Checker' },
];

export default function AudioRoomScreen() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        { id: '0', sender: 'alex', text: "Welcome to the Jammed Audio Room! I'm Alex, your research lead. Sam and I are here to help you and your team explore your documents together." },
        { id: '1', sender: 'sam', text: "Hey there! I'm Sam, the fact-checker. Drop a question or a topic and we'll pull up citations and settle debates with facts from your uploaded documents." },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speakMessage = (text: string, host: 'alex' | 'sam') => {
        setIsSpeaking(true);
        Speech.speak(text, {
            pitch: host === 'alex' ? 1.05 : 0.95,
            rate: 0.95,
            onDone: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false),
        });
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input.trim() };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Build history for context
            const history = messages.map((m) => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.sender === 'alex' ? `[Alex] ${m.text}` : m.sender === 'sam' ? `[Sam] ${m.text}` : m.text,
            }));

            const response = await api.post('/ai/chat', { message: userMsg.text, history });
            const reply = response.data.reply || response.data.message || 'I understand. Let me look that up.';

            // Split reply into Alex and Sam segments for the two-host feel
            const alexMsg: Message = { id: Date.now().toString() + 'a', sender: 'alex', text: reply };
            setMessages((prev) => [...prev, alexMsg]);

            // Sam adds a fact-check follow-up
            const samReply: Message = {
                id: Date.now().toString() + 's',
                sender: 'sam',
                text: `Based on what Alex said, I'd add: make sure to verify those claims against your uploaded sources. Want me to cross-reference?`,
            };
            setMessages((prev) => [...prev, samReply]);
        } catch {
            const errorMsg: Message = {
                id: Date.now().toString() + 'e',
                sender: 'alex',
                text: 'Sorry, I couldn\'t reach the AI right now. Please check your connection.',
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.title}>Jammed Audio Room</Text>
                    <Text style={styles.subtitle}>Live research workspace</Text>
                </View>
                <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                </View>
            </View>

            {/* Hosts */}
            <View style={styles.hostsRow}>
                {HOSTS.map((host) => (
                    <View key={host.name} style={styles.hostCard}>
                        <ClayChip variant={host.name === 'Alex' ? 'primary' : 'secondary'} style={styles.hostAvatar}>
                            <Text style={[styles.hostAvatarText, { color: host.name === 'Alex' ? Colors.primary : Colors.secondary }]}>
                                {host.avatar}
                            </Text>
                        </ClayChip>
                        <Text style={styles.hostName}>{host.name}</Text>
                        <Text style={styles.hostRole}>{host.role}</Text>
                    </View>
                ))}
            </View>

            {/* Transcript */}
            <ScrollView style={styles.transcript} contentContainerStyle={styles.transcriptContent}>
                {messages.map((msg) => (
                    <View
                        key={msg.id}
                        style={[
                            styles.messageBubble,
                            msg.sender === 'user' ? styles.userBubble : msg.sender === 'alex' ? styles.alexBubble : styles.samBubble,
                        ]}
                    >
                        {msg.sender !== 'user' && (
                            <Text style={[styles.msgSender, { color: msg.sender === 'alex' ? Colors.primary : Colors.secondary }]}>
                                {msg.sender === 'alex' ? 'Alex' : 'Sam'}
                            </Text>
                        )}
                        <Text style={styles.msgText}>{msg.text}</Text>
                        {msg.sender !== 'user' && (
                            <TouchableOpacity onPress={() => speakMessage(msg.text, msg.sender as 'alex' | 'sam')} style={styles.speakBtn}>
                                <Ionicons name={isSpeaking ? 'volume-high' : 'volume-medium-outline'} size={16} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
                {loading && (
                    <View style={styles.typingBubble}>
                        <ActivityIndicator size="small" color={Colors.secondary} />
                        <Text style={styles.typingText}>AI hosts are thinking...</Text>
                    </View>
                )}
            </ScrollView>

            {/* Input */}
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask the room a question..."
                    placeholderTextColor={Colors.textSecondary}
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={sendMessage}
                    returnKeyType="send"
                />
                <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={loading}>
                    <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.noteBar}>
                <Ionicons name="information-circle-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.noteText}>
                    Multi-user audio rooms require real-time voice infrastructure (WebRTC) — this is a single-user practice room with AI hosts.
                </Text>
            </View>
        </KeyboardAvoidingView>
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
        paddingHorizontal: Spacing.xl,
        paddingTop: 60,
        paddingBottom: Spacing.md,
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
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.error + '18',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.error,
    },
    liveText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.error,
    },
    hostsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.lg,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
    },
    hostCard: {
        alignItems: 'center',
        gap: 4,
    },
    hostAvatar: {
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.7)',
        shadowColor: '#4C4ED1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 6,
    },
    hostAvatarText: {
        fontSize: 22,
        fontWeight: '700',
    },
    hostName: {
        ...Typography.body,
        fontWeight: '700',
        color: Colors.text,
        fontSize: 14,
    },
    hostRole: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontSize: 11,
    },
    transcript: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
    },
    transcriptContent: {
        paddingVertical: Spacing.md,
        gap: Spacing.sm,
    },
    messageBubble: {
        padding: Spacing.md,
        borderRadius: 20,
        marginBottom: Spacing.sm,
        maxWidth: '85%',
    },
    userBubble: {
        backgroundColor: Colors.primary + '18',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 6,
    },
    alexBubble: {
        backgroundColor: Colors.primaryLight,
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 6,
    },
    samBubble: {
        backgroundColor: '#F3E8FF',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 6,
    },
    msgSender: {
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    msgText: {
        ...Typography.body,
        color: Colors.text,
        lineHeight: 22,
    },
    speakBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 4,
    },
    typingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: Spacing.md,
    },
    typingText: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        gap: Spacing.sm,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    input: {
        flex: 1,
        backgroundColor: '#E7E7F5',
        borderRadius: 18,
        paddingHorizontal: Spacing.md,
        paddingVertical: 12,
        fontSize: 16,
        color: Colors.text,
        borderWidth: 1,
        borderTopWidth: 2,
        borderColor: 'rgba(216,217,242,0.9)',
        borderTopColor: 'rgba(255,255,255,0.95)',
        shadowColor: '#4C4ED1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
    },
    sendBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4C4ED1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    noteBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.sm,
        backgroundColor: Colors.warning + '10',
    },
    noteText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontSize: 11,
        flex: 1,
    },
});
