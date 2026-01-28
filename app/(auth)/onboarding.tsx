import { Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Extrapolate,
    FadeIn,
    FadeInUp,
    interpolate,
    SharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    gradient: string[];
    accentColor: string;
}

const slides: OnboardingSlide[] = [
    {
        id: '1',
        title: 'Upload & Transform',
        description: 'Turn any lecture material into powerful study tools. PDFs, slides, images - we handle it all.',
        icon: 'cloud-upload',
        gradient: ['#667eea', '#764ba2'],
        accentColor: '#667eea',
    },
    {
        id: '2',
        title: 'AI-Powered Learning',
        description: 'Smart algorithms analyze your content to predict exam questions and create perfect flashcards.',
        icon: 'sparkles',
        gradient: ['#f093fb', '#f5576c'],
        accentColor: '#f093fb',
    },
    {
        id: '3',
        title: 'Ace Your Exams',
        description: 'Practice with confidence. Track progress, master concepts, and achieve your academic goals.',
        icon: 'trophy',
        gradient: ['#4facfe', '#00f2fe'],
        accentColor: '#4facfe',
    },
];

const FloatingParticle = ({ delay, duration }: { delay: number, duration: number }) => {
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        translateY.value = withRepeat(
            withTiming(-30, { duration }),
            -1,
            true
        );
        opacity.value = withRepeat(
            withTiming(0.8, { duration: duration / 2 }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.particle,
                animatedStyle,
                { left: `${Math.random() * 80 + 10}%`, top: `${Math.random() * 60 + 20}%` }
            ]}
        />
    );
};

const SlideItem = ({ item, index, scrollX }: { item: OnboardingSlide, index: number, scrollX: SharedValue<number> }) => {
    const cardStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.8, 1, 0.8],
            Extrapolate.CLAMP
        );
        const translateY = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [100, 0, 100],
            Extrapolate.CLAMP
        );
        const rotate = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [-10, 0, 10],
            Extrapolate.CLAMP
        );
        return {
            transform: [{ scale }, { translateY }, { rotate: `${rotate}deg` }],
            opacity: interpolate(
                scrollX.value,
                [(index - 0.5) * width, index * width, (index + 0.5) * width],
                [0, 1, 0],
                Extrapolate.CLAMP
            ),
        };
    });

    const iconStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [-20, 0, 20],
            Extrapolate.CLAMP
        );
        return {
            transform: [{ rotate: `${rotate}deg` }],
        };
    });

    return (
        <View style={[styles.slide, { width }]}>
            {/* Floating Particles */}
            <FloatingParticle delay={0} duration={3000} />
            <FloatingParticle delay={500} duration={4000} />
            <FloatingParticle delay={1000} duration={3500} />

            <Animated.View style={[styles.card, cardStyle]}>
                <LinearGradient
                    colors={item.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientCard}
                >
                    <Animated.View style={[styles.iconCircle, iconStyle]}>
                        <View style={styles.iconInner}>
                            <Ionicons name={item.icon} size={64} color="white" />
                        </View>
                    </Animated.View>

                    <View style={styles.textContent}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>

                    {/* Decorative Elements */}
                    <View style={[styles.decorCircle, styles.decorCircle1]} />
                    <View style={[styles.decorCircle, styles.decorCircle2]} />
                </LinearGradient>
            </Animated.View>

            {/* Feature Badges */}
            <Animated.View entering={FadeInUp.delay(300)} style={styles.badgeContainer}>
                <View style={[styles.badge, { backgroundColor: item.accentColor + '20' }]}>
                    <Ionicons name="checkmark-circle" size={16} color={item.accentColor} />
                    <Text style={[styles.badgeText, { color: item.accentColor }]}>
                        {index === 0 ? 'Instant Upload' : index === 1 ? 'Smart AI' : 'Track Progress'}
                    </Text>
                </View>
            </Animated.View>
        </View>
    );
};

export default function Onboarding() {
    const scrollX = useSharedValue(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();
    const flatListRef = useRef<FlatList<OnboardingSlide>>(null);

    const onScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const backgroundStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolate(
            scrollX.value,
            [0, width, width * 2],
            [0, 0.5, 1]
        );
        return {
            backgroundColor: `rgba(102, 126, 234, ${backgroundColor * 0.05})`,
        };
    });

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
            setCurrentIndex(currentIndex + 1);
        } else {
            router.replace('/(auth)/login');
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[StyleSheet.absoluteFill, backgroundStyle]} />

            {/* App Logo/Title */}
            <Animated.View entering={FadeIn.delay(200)} style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                    <Ionicons name="school" size={32} color={Colors.primary} />
                </View>
                <Text style={styles.logoText}>Brainlyx</Text>
            </Animated.View>

            <TouchableOpacity
                style={styles.skipButton}
                onPress={() => router.replace('/(auth)/login')}
            >
                <Text style={styles.skipText}>Skip</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.textSecondary} />
            </TouchableOpacity>

            <Animated.FlatList
                ref={flatListRef as any}
                data={slides}
                renderItem={({ item, index }) => <SlideItem item={item} index={index} scrollX={scrollX} />}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
                keyExtractor={(item) => item.id}
            />

            <View style={styles.footer}>
                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    {slides.map((slide, index) => {
                        const dotStyle = useAnimatedStyle(() => {
                            const dotWidth = interpolate(
                                scrollX.value,
                                [(index - 1) * width, index * width, (index + 1) * width],
                                [8, 32, 8],
                                Extrapolate.CLAMP
                            );
                            const opacity = interpolate(
                                scrollX.value,
                                [(index - 1) * width, index * width, (index + 1) * width],
                                [0.3, 1, 0.3],
                                Extrapolate.CLAMP
                            );

                            return {
                                width: dotWidth,
                                opacity,
                                backgroundColor: slide.accentColor,
                            };
                        });

                        return (
                            <Animated.View
                                key={index}
                                style={[styles.dot, dotStyle]}
                            />
                        );
                    })}
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    {currentIndex > 0 ? (
                        <Animated.View entering={FadeInUp.springify()} style={styles.btnWrapper}>
                            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                                <Ionicons name="arrow-back" size={24} color={Colors.text} />
                            </TouchableOpacity>
                        </Animated.View>
                    ) : (
                        <View style={styles.btnWrapper} />
                    )}

                    <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.btnWrapperLarge}>
                        <TouchableOpacity
                            style={[styles.nextButton, { backgroundColor: slides[currentIndex].accentColor }]}
                            onPress={handleNext}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.nextButtonText}>
                                {currentIndex === slides.length - 1 ? "Get Started" : "Continue"}
                            </Text>
                            <Ionicons name="arrow-forward" size={20} color="white" />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    logoContainer: {
        position: 'absolute',
        top: 60,
        left: Spacing.xl,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        zIndex: 10,
    },
    logoCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        ...Typography.h2,
        fontSize: 22,
        fontWeight: '900',
        color: Colors.primary,
    },
    skipButton: {
        position: 'absolute',
        top: 60,
        right: Spacing.xl,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: Colors.surface,
        borderRadius: 20,
    },
    skipText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    slide: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingTop: 100,
    },
    card: {
        width: '100%',
        height: height * 0.55,
        borderRadius: 32,
        overflow: 'hidden',
    },
    gradientCard: {
        flex: 1,
        padding: Spacing.xl * 1.5,
        justifyContent: 'space-between',
    },
    iconCircle: {
        alignSelf: 'center',
        marginTop: 20,
    },
    iconInner: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    textContent: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: 'rgba(255, 255, 255, 0.95)',
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    decorCircle: {
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 999,
    },
    decorCircle1: {
        width: 140,
        height: 140,
        top: -40,
        right: -40,
    },
    decorCircle2: {
        width: 100,
        height: 100,
        bottom: 20,
        left: -30,
    },
    badgeContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: '700',
    },
    particle: {
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
    },
    footer: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: 60,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 32,
        gap: 6,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    btnWrapper: {
        width: 56,
    },
    btnWrapperLarge: {
        flex: 1,
    },
    backButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    nextButton: {
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    nextButtonText: {
        fontSize: 17,
        fontWeight: '700',
        color: 'white',
    },
});
