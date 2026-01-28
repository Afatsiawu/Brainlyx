import { Button } from '@/components/ui/Button';
import { Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, KeyboardAvoidingView, Modal, Platform, RefreshControl, StatusBar as RNStatusBar, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeOutLeft,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MOTIVATIONAL_QUOTES = [
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden" },
  { text: "Strive for progress, not perfection.", author: "Unknown" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
];

// --- Sub-components Defined Outside ---

const ChartBar = ({ height, label, active, delay, colors, dynamicStyles }: any) => (
  <View style={dynamicStyles.chartCol}>
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      style={[
        dynamicStyles.chartBar,
        { height: height, backgroundColor: active ? colors.secondary : colors.border }
      ]}
    />
    <Text style={[dynamicStyles.chartLabel, active && { color: colors.secondary, fontWeight: '700' }]}>{label}</Text>
  </View>
);

const StatItem = ({ label, value, icon, color, delay, dynamicStyles }: any) => (
  <Animated.View entering={FadeInDown.delay(delay)} style={dynamicStyles.statItem}>
    <View style={[dynamicStyles.statIconBadge, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View>
      <Text style={dynamicStyles.statValue}>{value}</Text>
      <Text style={dynamicStyles.statLabel}>{label}</Text>
    </View>
  </Animated.View>
);

const RecentItem = ({ item, index, colors, dynamicStyles, router }: any) => (
  <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
    <TouchableOpacity
      style={dynamicStyles.recentItem}
      onPress={() => {
        if (item.status === 'completed') {
          router.push({ pathname: '/flashcards', params: { documentId: item.id } });
        } else if (item.status === 'failed') {
          Alert.alert('Analysis Failed', 'AI could not process this document. Please try again with a different file.');
        } else {
          Alert.alert('Processing', 'This document is still being analyzed by AI.');
        }
      }}
    >
      <View style={[
        dynamicStyles.recentIcon,
        {
          backgroundColor:
            item.status === 'completed' ? colors.primaryLight :
              item.status === 'failed' ? colors.error + '20' :
                colors.border
        }
      ]}>
        <Ionicons
          name={
            item.status === 'completed' ? "checkmark-circle" :
              item.status === 'failed' ? "alert-circle" :
                "hourglass"
          }
          size={24}
          color={
            item.status === 'completed' ? colors.primary :
              item.status === 'failed' ? colors.error :
                colors.textSecondary
          }
        />
      </View>
      <View style={dynamicStyles.recentInfo}>
        <Text style={dynamicStyles.recentTitle} numberOfLines={1}>
          {item.filename}
        </Text>
        <Text style={dynamicStyles.recentSubtitle}>
          {new Date(item.uploadedAt).toLocaleDateString()} • {
            item.status === 'completed' ? 'Ready to study' :
              item.status === 'failed' ? 'Analysis failed' :
                'AI Processing...'
          }
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  </Animated.View>
);

// --- Main Screen ---

export default function DashboardScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [allDocuments, setAllDocuments] = useState<any[]>([]);

  // Statistics State
  const [stats, setStats] = useState({
    totalFlashcards: 0,
    totalQuestions: 0,
    completedDocs: 0,
    totalMaterials: 0
  });

  const [weeklyStats, setWeeklyStats] = useState({
    data: [] as any[],
    max: 100,
    note: "Start studying to see your activity!"
  });

  const [quoteIndex, setQuoteIndex] = useState(0);
  const bgAnim = useSharedValue(0);

  const dynamicStyles = getStyles(colors);

  // BrainlyxAI Chat State
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatListRef = React.useRef<FlatList>(null);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/ai/sessions');
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const loadSession = async (id: number) => {
    setIsTyping(true);
    try {
      const response = await api.get(`/ai/session/${id}`);
      setChatHistory(response.data.messages || []);
      setCurrentSessionId(id);
      setIsHistoryVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to load chat history.');
    } finally {
      setIsTyping(false);
    }
  };

  const startNewChat = () => {
    setChatHistory([]);
    setCurrentSessionId(null);
    setIsHistoryVisible(false);
    setChatMessage('');
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMsg = { role: 'user', content: chatMessage.trim() };
    const newHistory = [...chatHistory, userMsg];

    // Add user message to UI immediately
    setChatHistory(newHistory);
    setChatMessage('');
    setIsTyping(true);

    try {
      const response = await api.post('/ai/chat', {
        message: userMsg.content,
        history: chatHistory,
        sessionId: currentSessionId
      });

      setChatHistory([...newHistory, { role: 'assistant', content: response.data.reply }]);
      setCurrentSessionId(response.data.sessionId);
      fetchSessions(); // Refresh sessions list
    } catch (error) {
      console.error('Chat error:', error);
      Alert.alert('BrainlyxAI', 'Network error. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents');
      const docs = response.data;
      setAllDocuments(docs);

      const sortedDocs = [...docs].sort((a: any, b: any) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      setDocuments(sortedDocs.slice(0, 5)); // Take top 5 recent

      // Calculate Stats
      const completed = docs.filter((d: any) => d.status === 'completed');

      const flashcardsCount = completed.reduce((acc: number, doc: any) => {
        if (doc.flashcards) {
          try {
            const cards = JSON.parse(doc.flashcards);
            return acc + (Array.isArray(cards) ? cards.length : 0);
          } catch { return acc; }
        }
        return acc;
      }, 0);

      const questionsCount = completed.reduce((acc: number, doc: any) => {
        if (doc.questions) {
          try {
            const questions = JSON.parse(doc.questions);
            const objCount = questions.objective?.length || 0;
            const essayCount = questions.essay?.length || 0;
            const caseCount = questions.caseStudy?.length || 0;
            return acc + objCount + essayCount + caseCount;
          } catch { return acc; }
        }
        return acc;
      }, 0);

      setStats({
        totalFlashcards: flashcardsCount,
        totalQuestions: questionsCount,
        completedDocs: completed.length,
        totalMaterials: docs.length
      });

      // Calculate Weekly Activity (Last 7 Days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return {
          date: d.toISOString().split('T')[0],
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }), // "Mon", "Tue"
          count: 0
        };
      }).reverse(); // [Today-6, ..., Today]

      docs.forEach((doc: any) => {
        const uploadDate = new Date(doc.uploadedAt).toISOString().split('T')[0];
        const dayStat = last7Days.find(d => d.date === uploadDate);
        if (dayStat) {
          dayStat.count += 1;
        }
      });

      // Find max for scaling (min 1 to avoid division by zero)
      const maxCount = Math.max(...last7Days.map(d => d.count), 1);

      // Find most active day
      const mostActive = last7Days.reduce((prev, current) => (current.count > prev.count) ? current : prev, { count: -1, dayName: '' });
      const mostActiveText = mostActive.count > 0
        ? `You've been most active on ${mostActive.dayName}s!`
        : "No activity this week yet.";

      setWeeklyStats({ data: last7Days, max: maxCount, note: mostActiveText });

    } catch (error) {
      console.error('Failed to fetch docs or calculate stats', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDocuments();

      // Polling for processing documents
      const pollInterval = setInterval(() => {
        const hasProcessing = documents.some(d => d.status === 'processing');
        if (hasProcessing) {
          fetchDocuments();
        }
      }, 5000);

      return () => clearInterval(pollInterval);
    }, [documents])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 10000); // 10 seconds

    bgAnim.value = withRepeat(withTiming(1, { duration: 5000 }), -1, true);

    return () => clearInterval(interval);
  }, []);

  const animatedBgStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${bgAnim.value * 15}deg` },
      { scale: 1 + bgAnim.value * 0.2 }
    ],
    opacity: interpolate(bgAnim.value, [0, 1], [0.4, 0.6])
  }));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDocuments();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (isChatVisible) fetchSessions();
  }, [isChatVisible]);

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={dynamicStyles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <RNStatusBar barStyle="dark-content" />

        {/* Header Section */}
        <View style={dynamicStyles.header}>
          <View>
            <Text style={dynamicStyles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Student'}! 👋</Text>
            <Text style={dynamicStyles.subtitle}>Ready to ace your exams?</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={dynamicStyles.profileButton}>
            <Ionicons name="person" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Quote Card */}
        <View style={dynamicStyles.quoteCard}>
          <Animated.View style={[dynamicStyles.quoteDecoration, animatedBgStyle]}>
            <Ionicons name="school" size={140} color="white" />
          </Animated.View>

          <View style={dynamicStyles.quoteContentWrapper}>
            <View style={dynamicStyles.quoteIconContainer}>
              <Ionicons name="chatbox-ellipses-outline" size={24} color="white" />
            </View>
            <Animated.View
              key={quoteIndex}
              entering={FadeInRight.springify()}
              exiting={FadeOutLeft.duration(200)}
              style={dynamicStyles.quoteTextContainer}
            >
              <Text style={dynamicStyles.quoteText}>"{currentQuote.text}"</Text>
              <Text style={dynamicStyles.quoteAuthor}>— {currentQuote.author}</Text>
            </Animated.View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={dynamicStyles.actionsGrid}>
          <TouchableOpacity
            style={[dynamicStyles.actionCard, { backgroundColor: colors.primaryLight }]}
            onPress={() => router.push('/(tabs)/upload')}
          >
            <Ionicons name="cloud-upload" size={32} color={colors.primary} />
            <Text style={[dynamicStyles.actionText, { color: colors.primary }]}>Upload Document</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[dynamicStyles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}
            onPress={() => router.push('/record-lecture')}
          >
            <Ionicons name="mic" size={32} color={colors.secondary} />
            <Text style={[dynamicStyles.actionText, { color: colors.secondary }]}>Record Live Lecture</Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Activity Section */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Weekly Activity</Text>
          <View style={dynamicStyles.chartCard}>
            <View style={dynamicStyles.chartArea}>
              {weeklyStats.data.length > 0 ? (
                weeklyStats.data.map((item, index) => (
                  <ChartBar
                    key={index}
                    height={(item.count / weeklyStats.max) * 100 || 5} // Min height 5 for visibility
                    label={item.dayName}
                    active={item.dayName === new Date().toLocaleDateString('en-US', { weekday: 'short' })}
                    delay={100 + (index * 100)}
                    colors={colors}
                    dynamicStyles={dynamicStyles}
                  />
                ))
              ) : (
                // Fallback for initial load
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                  <ChartBar key={idx} height={5} label={day} colors={colors} dynamicStyles={dynamicStyles} />
                ))
              )}
            </View>
            <Text style={dynamicStyles.chartNote}>{weeklyStats.note}</Text>
          </View>
        </View>

        {/* Key Statistics Grid */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Key Statistics</Text>
          <View style={dynamicStyles.statsGrid}>
            <StatItem
              label="Questions"
              value={stats.totalQuestions.toString()}
              icon="help-circle"
              color={colors.secondary}
              delay={300}
              dynamicStyles={dynamicStyles}
            />
            <StatItem
              label="Flashcards"
              value={stats.totalFlashcards.toString()}
              icon="albums-outline"
              color="#10B981"
              delay={400}
              dynamicStyles={dynamicStyles}
            />
            <StatItem
              label="Documents"
              value={stats.totalMaterials.toString()}
              icon="document-text"
              color="#F59E0B"
              delay={500}
              dynamicStyles={dynamicStyles}
            />
            <StatItem
              label="Completed"
              value={stats.completedDocs.toString()}
              icon="checkmark-done-circle"
              color={colors.primary}
              delay={600}
              dynamicStyles={dynamicStyles}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={dynamicStyles.section}>
          <View style={dynamicStyles.sectionHeader}>
            <Text style={dynamicStyles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/study')}>
              <Text style={dynamicStyles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {documents.length === 0 ? (
            <View style={dynamicStyles.emptyState}>
              <Ionicons name="documents-outline" size={48} color={colors.textSecondary} />
              <Text style={dynamicStyles.emptyStateText}>No documents uploaded yet.</Text>
              <Button
                title="Upload Now"
                onPress={() => router.push('/(tabs)/upload')}
                variant="primary"
                style={{ marginTop: 16 }}
              />
            </View>
          ) : (
            documents.map((item, index) =>
              <RecentItem
                key={item.id}
                item={item}
                index={index}
                colors={colors}
                dynamicStyles={dynamicStyles}
                router={router}
              />
            )
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={dynamicStyles.fab}
        onPress={() => setIsChatVisible(true)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={dynamicStyles.fabGradient}
        >
          <Ionicons name="chatbubbles" size={28} color="white" />
        </LinearGradient>
        <View style={dynamicStyles.fabBadge}>
          <Ionicons name="sparkles" size={10} color="white" />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isChatVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsChatVisible(false)}
      >
        <View style={dynamicStyles.chatContainer}>
          {/* Chat Header */}
          <View style={dynamicStyles.chatHeader}>
            <TouchableOpacity onPress={() => setIsChatVisible(false)} style={dynamicStyles.chatCloseBtn}>
              <Ionicons name="close" size={24} color={colors.secondary} />
            </TouchableOpacity>
            <View style={dynamicStyles.chatTitleContainer}>
              <View style={dynamicStyles.chatAiIconBadge}>
                <Ionicons name="sparkles" size={16} color="white" />
              </View>
              <Text style={dynamicStyles.chatTitle}>BrainlyxAI</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <TouchableOpacity onPress={() => setIsHistoryVisible(!isHistoryVisible)}>
                <Ionicons name={isHistoryVisible ? "chatbox-outline" : "list-outline"} size={24} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={startNewChat}>
                <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {isHistoryVisible ? (
            <FlatList
              data={sessions}
              keyExtractor={(item) => item.id.toString()}
              style={dynamicStyles.chatList}
              contentContainerStyle={dynamicStyles.historyListContent}
              renderItem={({ item }) => (
                <TouchableOpacity style={dynamicStyles.historyItem} onPress={() => loadSession(item.id)}>
                  <View style={dynamicStyles.historyIcon}>
                    <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={dynamicStyles.historyTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={dynamicStyles.historyDate}>{new Date(item.updatedAt).toLocaleDateString()}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.border} />
                </TouchableOpacity>
              )}
              ListHeaderComponent={
                <Text style={dynamicStyles.historyHeader}>Past Conversations</Text>
              }
              ListEmptyComponent={
                <View style={dynamicStyles.emptyHistory}>
                  <Ionicons name="time-outline" size={48} color={colors.border} />
                  <Text style={dynamicStyles.emptyHistoryText}>No past conversations found.</Text>
                </View>
              }
            />
          ) : (
            <FlatList
              ref={chatListRef}
              data={chatHistory}
              keyExtractor={(_, index) => index.toString()}
              style={dynamicStyles.chatList}
              contentContainerStyle={dynamicStyles.chatListContent}
              onContentSizeChange={() => chatHistory.length > 0 && chatListRef.current?.scrollToEnd({ animated: true })}
              renderItem={({ item }) => (
                <View style={[
                  dynamicStyles.messageWrapper,
                  item.role === 'user' ? dynamicStyles.userWrapper : dynamicStyles.aiWrapper
                ]}>
                  {item.role === 'assistant' && (
                    <View style={dynamicStyles.aiAvatar}>
                      <Ionicons name="sparkles" size={12} color="white" />
                    </View>
                  )}
                  <View style={{ flex: 1, alignItems: item.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    {item.role === 'assistant' && (
                      <Text style={dynamicStyles.aiBadgeText}>BrainlyxAI</Text>
                    )}
                    <View style={[
                      dynamicStyles.messageBubble,
                      item.role === 'user' ? dynamicStyles.userBubble : dynamicStyles.aiBubble
                    ]}>
                      {item.role === 'user' ? (
                        <Text style={dynamicStyles.userMessageText}>{item.content}</Text>
                      ) : (
                        <Markdown style={markdownStyles(colors) as any}>
                          {item.content}
                        </Markdown>
                      )}
                    </View>
                  </View>
                </View>
              )}
              ListHeaderComponent={
                <View style={dynamicStyles.chatWelcome}>
                  <Ionicons name="school" size={64} color={colors.primary} />
                  <Text style={dynamicStyles.chatWelcomeTitle}>Hello, I'm BrainlyxAI!</Text>
                  <Text style={dynamicStyles.chatWelcomeSubtitle}>I'm here to help you understand your study topics better. Ask me anything!</Text>
                </View>
              }
            />
          )}

          {!isHistoryVisible && isTyping && (
            <View style={dynamicStyles.typingIndicator}>
              <Text style={dynamicStyles.typingText}>BrainlyxAI is thinking...</Text>
            </View>
          )}

          {!isHistoryVisible && (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <View style={dynamicStyles.chatInputContainer}>
                <TextInput
                  style={dynamicStyles.chatInput}
                  placeholder="Ask me anything..."
                  value={chatMessage}
                  onChangeText={setChatMessage}
                  multiline
                  placeholderTextColor={colors.textSecondary}
                />
                <TouchableOpacity
                  onPress={handleSendMessage}
                  style={[dynamicStyles.sendBtn, !chatMessage.trim() && { opacity: 0.5 }]}
                  disabled={!chatMessage.trim()}
                >
                  <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          )}
        </View>
      </Modal>
    </View>
  );
}

const markdownStyles = (colors: any) => ({
  body: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 24, // Improved for readability
  },
  heading1: {
    ...Typography.h1,
    fontSize: 22,
    color: colors.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  heading2: {
    ...Typography.h2,
    fontSize: 18,
    color: colors.secondary,
    marginTop: 10,
    marginBottom: 6,
  },
  heading3: {
    ...Typography.h3,
    fontSize: 16,
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  paragraph: {
    marginVertical: 6,
  },
  strong: {
    fontWeight: '800',
    color: colors.primary,
  },
  list_item: {
    marginVertical: 4,
  },
  bullet_list: {
    marginVertical: 6,
  },
  ordered_list: {
    marginVertical: 6,
  },
  code_inline: {
    backgroundColor: colors.primary + '10',
    color: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  code_block: {
    backgroundColor: colors.background, // Match app background
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fence: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary + '40',
    paddingLeft: 12,
    marginVertical: 8,
    fontStyle: 'italic',
    color: colors.textSecondary,
  },
});

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    ...Typography.h2,
    color: colors.text,
    fontSize: 24,
  },
  subtitle: {
    ...Typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  quoteCard: {
    marginHorizontal: Spacing.xl,
    backgroundColor: colors.secondary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    overflow: 'hidden',
    position: 'relative',
    height: 180,
    justifyContent: 'center',
  },
  quoteDecoration: {
    position: 'absolute',
    right: -30,
    bottom: -30,
    opacity: 0.15,
  },
  quoteContentWrapper: {
    zIndex: 1,
  },
  quoteIconContainer: {
    marginBottom: 12,
    opacity: 0.8,
  },
  quoteTextContainer: {
    width: '100%',
  },
  quoteText: {
    ...Typography.h3,
    color: 'white',
    fontSize: 18,
    lineHeight: 26,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  quoteAuthor: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    flex: 1,
    height: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  actionText: {
    ...Typography.caption,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.h3,
    color: colors.text,
    fontSize: 18,
  },
  seeAll: {
    ...Typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recentInfo: {
    flex: 1,
    marginRight: 12,
  },
  recentTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  recentSubtitle: {
    ...Typography.caption,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    ...Typography.body,
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  chartCard: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  chartCol: {
    alignItems: 'center',
    gap: 8,
    width: 30,
  },
  chartBar: {
    width: 10,
    borderRadius: 5,
    minHeight: 10,
  },
  chartLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
  },
  chartNote: {
    ...Typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 16,
    width: '48%',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    ...Typography.h3,
    fontSize: 16,
    color: colors.text,
  },
  statLabel: {
    ...Typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 25,
    width: 64,
    height: 64,
    borderRadius: 32,
    ...Shadows.medium,
    elevation: 8,
    zIndex: 999,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    zIndex: 10,
  },
  chatTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatAiIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatTitle: {
    ...Typography.h3,
    fontSize: 18,
    color: colors.text,
  },
  chatCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
    padding: 20,
    paddingBottom: 40,
  },
  chatWelcome: {
    alignItems: 'center',
    paddingVertical: 40,
    opacity: 0.8,
  },
  chatWelcomeTitle: {
    ...Typography.h2,
    fontSize: 22,
    color: colors.text,
    marginTop: 16,
  },
  chatWelcomeSubtitle: {
    ...Typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 8,
    paddingHorizontal: 40,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    // Removed width: '100%' as it can cause issues in flex layouts with padding
  },
  aiWrapper: {
    justifyContent: 'flex-start',
    gap: 10,
    paddingRight: 20, // Add room for avatar + bubble alignment
  },
  userWrapper: {
    justifyContent: 'flex-end',
    paddingLeft: 40, // Let user bubble push from right
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  aiBadgeText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 4,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  messageBubble: {
    maxWidth: '100%', // Let container constraint handle it
    padding: 16,
    borderRadius: 20,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
    ...Shadows.small,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    ...Shadows.small,
  },
  userMessageText: {
    ...Typography.body,
    fontSize: 15,
    color: 'white',
  },
  typingIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  typingText: {
    ...Typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    gap: 12,
  },
  chatInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    maxHeight: 100,
    color: colors.text,
    fontSize: 15,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyHeader: {
    ...Typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  historyListContent: {
    padding: 24,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  historyTitle: {
    ...Typography.body,
    fontWeight: '600',
    fontSize: 15,
    color: colors.text,
  },
  historyDate: {
    ...Typography.caption,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 100,
    opacity: 0.5,
  },
  emptyHistoryText: {
    ...Typography.caption,
    marginTop: 16,
  },
});
