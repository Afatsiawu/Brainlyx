import React, { useEffect, useMemo } from 'react';
import {
    GestureResponderEvent,
    PanResponder,
    PanResponderGestureState,
    Platform,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle
} from 'react-native';
import Animated, {
    Easing,
    Keyframe,
    cancelAnimation,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming
} from 'react-native-reanimated';

/**
 * Entering animation that flips a view into place from a 3D perspective.
 *
 * Usage: <Animated.View entering={flipIn3D(200)} />
 */
export const flipIn3D = (delay = 0, duration = 600) => {
    // Reanimated's web backend crashes when an animated element is torn down
    // (its cleanup reads layout from a detached element), so entrance
    // animations are disabled on web. Native keeps the full effect.
    if (Platform.OS === 'web') {
        return undefined;
    }
    return new Keyframe({
        0: {
            opacity: 0,
            transform: [
                { perspective: 800 },
                { rotateX: '80deg' },
                { translateY: 30 }
            ],
        },
        100: {
            opacity: 1,
            transform: [
                { perspective: 800 },
                { rotateX: '0deg' },
                { translateY: 0 }
            ],
        },
    })
        .duration(duration)
        .delay(delay);
};

interface AutoRotating3DProps {
    children: React.ReactNode;
    size?: number;
    duration?: number;
    /** Constant lean off the horizontal axis, in degrees. */
    tilt?: number;
    style?: StyleProp<ViewStyle>;
}

/**
 * A container that continuously rotates its children in 3D space.
 * Great for logos and "AI core" style orbs.
 */
export function AutoRotating3D({
    children,
    size = 120,
    duration = 12000,
    tilt = 18,
    style,
}: AutoRotating3DProps) {
    const spin = useSharedValue(0);

    useEffect(() => {
        // Reanimated's web backend crashes when a looping animation is removed
        // (its cleanup reads layout from a detached element), so the spin is
        // native-only. The static 3D tilt still renders on web.
        if (Platform.OS === 'web') {
            return;
        }
        spin.value = withRepeat(
            withTiming(360, { duration, easing: Easing.linear }),
            -1,
            false
        );
        // Stop the looping animation on unmount.
        return () => {
            cancelAnimation(spin);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { perspective: 800 },
            { rotateX: `${tilt}deg` },
            { rotateY: `${spin.value}deg` },
        ],
    }));

    // On web, render a plain view: Reanimated's web animation teardown can
    // crash when the element is removed, so no animated style is applied.
    if (Platform.OS === 'web') {
        return (
            <View style={[styles.autoRotating, { width: size, height: size }, style]}>
                {children}
            </View>
        );
    }

    return (
        <Animated.View
            style={[styles.autoRotating, { width: size, height: size }, style, animatedStyle]}
        >
            {children}
        </Animated.View>
    );
}

interface Tilt3DCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    /** Maximum rotation on each axis, in degrees. */
    maxTilt?: number;
    enabled?: boolean;
}

/**
 * A card that tilts in 3D while it is dragged horizontally, then springs
 * back to rest. Vertical swipes are left to the parent ScrollView, so this
 * stays friendly to scrolling.
 */
export function Tilt3DCard({
    children,
    style,
    maxTilt = 14,
    enabled = true,
}: Tilt3DCardProps) {
    const rotateX = useSharedValue(0);
    const rotateY = useSharedValue(0);

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => false,
                onMoveShouldSetPanResponder: (
                    _event: GestureResponderEvent,
                    gesture: PanResponderGestureState
                ) =>
                    enabled &&
                    Math.abs(gesture.dx) > 8 &&
                    Math.abs(gesture.dx) > Math.abs(gesture.dy),
                onPanResponderMove: (
                    _event: GestureResponderEvent,
                    gesture: PanResponderGestureState
                ) => {
                    rotateY.value = Math.max(-maxTilt, Math.min(maxTilt, gesture.dx / 6));
                    rotateX.value = Math.max(-maxTilt, Math.min(maxTilt, -gesture.dy / 6));
                },
                onPanResponderRelease: () => {
                    rotateX.value = withSpring(0, { damping: 12, stiffness: 120 });
                    rotateY.value = withSpring(0, { damping: 12, stiffness: 120 });
                },
                onPanResponderTerminate: () => {
                    rotateX.value = withSpring(0, { damping: 12, stiffness: 120 });
                    rotateY.value = withSpring(0, { damping: 12, stiffness: 120 });
                },
                onPanResponderTerminationRequest: () => true,
            }),
        [enabled, maxTilt, rotateX, rotateY]
    );

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { perspective: 900 },
            { rotateX: `${rotateX.value}deg` },
            { rotateY: `${rotateY.value}deg` },
        ],
    }));

    // Plain view on web: Reanimated's web animation teardown can crash when
    // the animated element is removed.
    if (Platform.OS === 'web') {
        return <View style={style}>{children}</View>;
    }

    return (
        <Animated.View style={[style, animatedStyle]} {...panResponder.panHandlers}>
            {children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    autoRotating: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
