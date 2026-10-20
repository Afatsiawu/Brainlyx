import { Colors, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    containerStyle?: StyleProp<ViewStyle>;
    isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    containerStyle,
    style,
    isPassword,
    secureTextEntry,
    ...props
}) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const inputRef = useRef<TextInput>(null);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <Pressable
                onPress={() => inputRef.current?.focus()}
                style={[
                    styles.inputWrapper,
                    error ? styles.errorBorder : (isFocused ? styles.focusedBorder : styles.defaultBorder),
                    isFocused && styles.glow
                ]}
            >
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={isFocused ? Colors.secondary : Colors.textSecondary}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    ref={inputRef}
                    style={[styles.input, style]}
                    placeholderTextColor={Colors.textSecondary}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={isPassword ? !isPasswordVisible : secureTextEntry}
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={styles.eyeIcon}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={Colors.textSecondary}
                        />
                    </TouchableOpacity>
                )}
            </Pressable>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
        width: '100%',
    },
    label: {
        ...Typography.caption,
        marginBottom: Spacing.xs,
        fontWeight: '600',
        color: Colors.text,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E7E7F5', // clay inset fill
        borderRadius: 18,
        paddingHorizontal: Spacing.md,
        height: 54,
        borderWidth: 1,
        borderTopWidth: 2.5,
        borderColor: 'rgba(216,217,242,0.9)',
        borderTopColor: 'rgba(255,255,255,0.95)', // puffy top highlight
        shadowColor: '#4C4ED1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    defaultBorder: {},
    focusedBorder: {
        borderColor: Colors.primary,
    },
    errorBorder: {
        borderColor: Colors.error,
    },
    glow: {
        shadowColor: Colors.secondary,
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
    },
    icon: {
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: Colors.text,
    },
    eyeIcon: {
        padding: Spacing.xs,
    },
    errorText: {
        color: Colors.error,
        fontSize: 12,
        marginTop: Spacing.xs,
    },
});
