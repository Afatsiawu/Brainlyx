import { Colors, Typography } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProgressRingProps {
    progress: number; // 0 to 100
    size?: number;
    strokeWidth?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
    progress,
    size = 60,
    strokeWidth = 6
}) => {
    // Simplified version using circular views since we don't have SVG library by default
    // In a real app, use react-native-svg
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <View style={[
                styles.ring,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: strokeWidth,
                    borderColor: Colors.primaryLight
                }
            ]} />
            {/* We'll use a text percentage for now to keep it simple and clean */}
            <View style={styles.content}>
                <Text style={[Typography.caption, { fontWeight: '700', color: Colors.primary }]}>
                    {Math.round(progress)}%
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    ring: {
        position: 'absolute',
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
