import { Colors, Spacing } from '@/constants/theme';
import React from 'react';
import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    icon?: React.ReactNode;
}

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
    const getVariantStyle = (): ViewStyle => {
        switch (variant) {
            case 'secondary':
                return { backgroundColor: Colors.secondary };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: Colors.primary
                };
            case 'ghost':
                return { backgroundColor: 'transparent' };
            default:
                return { backgroundColor: Colors.primary };
        }
    };

    const getTextStyle = (): TextStyle => {
        switch (variant) {
            case 'outline':
            case 'ghost':
                return { color: Colors.primary };
            default:
                return { color: Colors.surface };
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                getVariantStyle(),
                disabled && styles.disabled,
                style
            ]}
            disabled={disabled || loading}
            activeOpacity={0.8}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.surface} />
            ) : (
                <>
                    {icon}
                    <Text style={[styles.text, getTextStyle(), textStyle, icon ? { marginLeft: 8 } : {}]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        flexDirection: 'row',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.5,
    },
});
