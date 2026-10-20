import { Colors, ClayShadows, Spacing } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    ViewStyle
} from 'react-native';

interface ButtonProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    icon?: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
}

// Clay surface highlight overlay shared by all clay surfaces
const ClayHighlight = ({ radius }: { radius: number }) => (
    <LinearGradient
        colors={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0.06)', 'rgba(108,111,245,0.07)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
        pointerEvents="none"
    />
);

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    loading = false,
    style,
    textStyle,
    disabled,
    icon,
    ...props
}) => {
    const isFilled = variant === 'primary' || variant === 'secondary';

    return (
        <Pressable
            disabled={disabled || loading}
            style={({ pressed }) => [
                styles.button,
                variant === 'secondary' && { ...ClayShadows.medium },
                variant === 'primary' && { ...ClayShadows.medium },
                variant === 'outline' && { ...ClayShadows.small, borderColor: 'rgba(255,255,255,0.7)' },
                !isFilled && variant !== 'ghost' && styles.outlineFill,
                pressed && { transform: [{ scale: 0.96 }], opacity: 0.92 },
                disabled && styles.disabled,
                style,
            ]}
            {...props}
        >
            {isFilled ? (
                <>
                    <LinearGradient
                        colors={variant === 'secondary' ? ['#C4B5FD', '#9F8BF8'] : ['#8487FF', '#5B5FE9']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[StyleSheet.absoluteFill, { borderRadius: 22 }]}
                    />
                    <ClayHighlight radius={22} />
                </>
            ) : null}
            {loading ? (
                <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.surface} />
            ) : (
                <>
                    {icon}
                    <Text style={[styles.text, variant === 'outline' || variant === 'ghost' ? { color: Colors.primary } : { color: Colors.surface }, textStyle, icon ? { marginLeft: 8 } : {}]}>
                        {title}
                    </Text>
                </>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 52,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    outlineFill: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.5,
    },
});
