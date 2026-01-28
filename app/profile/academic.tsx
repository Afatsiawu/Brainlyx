import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function AcademicScreen() {
    const router = useRouter();
    const { user, updateUser } = useAuth();

    const [university, setUniversity] = useState(user?.university || '');
    const [major, setMajor] = useState(user?.major || '');
    const [year, setYear] = useState(user?.year || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!university || !major || !year) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await updateUser({ university, major, year });
            Alert.alert('Success', 'Academic status updated');
        } catch (error) {
            Alert.alert('Error', 'Failed to update academic status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Academic Status</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Animated.View entering={FadeIn.duration(400)}>
                    <View style={styles.illustrationSection}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="school" size={40} color={Colors.primary} />
                        </View>
                        <Text style={styles.instructionText}>
                            Keep your academic information up to date to receive relevant study recommendations.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="University / School"
                            value={university}
                            onChangeText={setUniversity}
                            placeholder="e.g. Palm University"
                            icon="school-outline"
                        />
                        <Input
                            label="Major / Course"
                            value={major}
                            onChangeText={setMajor}
                            placeholder="e.g. Computer Science"
                            icon="book-outline"
                        />
                        <Input
                            label="Year / Level"
                            value={year}
                            onChangeText={setYear}
                            placeholder="e.g. Year 3 or Senior"
                            icon="calendar-outline"
                        />
                    </View>

                    <Button
                        title="Update Status"
                        onPress={handleSave}
                        loading={loading}
                        style={styles.saveButton}
                    />
                </Animated.View>
            </ScrollView>
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
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: Spacing.lg,
        paddingBottom: 20,
        backgroundColor: Colors.surface,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    headerTitle: {
        ...Typography.h2,
        fontSize: 18,
    },
    content: {
        padding: Spacing.xl,
    },
    illustrationSection: {
        alignItems: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    instructionText: {
        ...Typography.body,
        textAlign: 'center',
        color: Colors.textSecondary,
        lineHeight: 22,
    },
    form: {
        gap: 20,
        marginBottom: 32,
    },
    saveButton: {
        marginTop: Spacing.md,
    },
});
