import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ClayShadows, Colors } from '@/constants/theme';

/**
 * Simulates the claymorphism inner highlight: a soft white sheen across the
 * top edge and a faint indigo shade near the bottom, baked into the card.
 */
const ClayHighlight = ({ radius }: { radius: number }) => (
    <LinearGradient
        colors={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0.06)', 'rgba(108,111,245,0.07)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
        pointerEvents="none"
    />
);

interface ClayCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    radius?: number;
    gradient?: [string, string];
    shadow?: typeof ClayShadows.small;
}

/**
 * A soft, puffy clay card: pastel gradient surface, big radius, layered outer
 * shadow and a baked-in inner highlight.
 */
export function ClayCard({
    children,
    style,
    radius = 32,
    gradient = ['#FFFFFF', '#EFEFFB'],
    shadow = ClayShadows.medium,
}: ClayCardProps) {
    return (
        <View style={[{ borderRadius: radius, overflow: 'hidden', ...shadow }, style]}>
            <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            <ClayHighlight radius={radius} />
            {children}
        </View>
    );
}

interface ClayButtonProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'primary' | 'white';
    radius?: number;
    onPress?: () => void;
    disabled?: boolean;
}

/**
 * A clay button with a puffy raised shadow that presses down on tap.
 */
export function ClayButton({
    children,
    style,
    variant = 'primary',
    radius = 22,
    onPress,
    disabled = false,
}: ClayButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                {
                    borderRadius: radius,
                    overflow: 'hidden',
                    opacity: disabled ? 0.55 : pressed ? 0.92 : 1,
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                    ...(variant === 'primary' ? ClayShadows.medium : ClayShadows.small),
                },
                style,
            ]}
        >
            <LinearGradient
                colors={variant === 'primary' ? ['#8487FF', '#5B5FE9'] : ['#FFFFFF', '#EEEEFA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
            />
            <ClayHighlight radius={radius} />
            {children}
        </Pressable>
    );
}

interface ClayChipProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'surface';
    radius?: number;
}

/**
 * Small puffy clay container for icons, avatars and stat badges.
 */
export function ClayChip({
    children,
    style,
    variant = 'primary',
    radius = 18,
}: ClayChipProps) {
    const tints: Record<string, [string, string]> = {
        primary: [Colors.primaryLight, '#D9D9FA'],
        secondary: ['#EFE7FE', '#E3D9FD'],
        accent: ['#D2FAF3', '#C2F3E8'],
        success: ['#D9F7E8', '#C6F0DA'],
        surface: ['#FFFFFF', '#EFEFFB'],
    };

    return (
        <View style={[{ borderRadius: radius, overflow: 'hidden', ...ClayShadows.small }, style]}>
            <LinearGradient
                colors={tints[variant] ?? tints.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
            />
            <ClayHighlight radius={radius} />
            {children}
        </View>
    );
}
