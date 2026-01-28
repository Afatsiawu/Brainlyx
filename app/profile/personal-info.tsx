import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function PersonalInfoScreen() {
    const router = useRouter();
    const { user, updateUser } = useAuth();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!name) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        setLoading(true);
        try {
            // Simulated update (backend would usually be called here)
            await updateUser({ name });
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
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
                <Text style={styles.headerTitle}>Personal Information</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Animated.View entering={FadeIn.duration(400)}>
                    <View style={styles.avatarSection}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'S'}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.changePhotoBtn}>
                            <Text style={styles.changePhotoText}>Change Photo</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        <Input
                            label="Full Name"
                            value={name}
                            onChangeText={setName}
                            placeholder="Kwame Mensah"
                            icon="person-outline"
                        />
                        <Input
                            label="Email Address"
                            value={email}
                            editable={false} // Email usually doesn't change easily
                            placeholder="student@university.edu"
                            icon="mail-outline"
                        />

                        <View style={styles.infoBox}>
                            <Ionicons name="information-circle-outline" size={20} color={Colors.textSecondary} />
                            <Text style={styles.infoText}>
                                Your email address is linked to your academic institution and cannot be changed here.
                            </Text>
                        </View>
                    </View>

                    <Button
                        title="Save Changes"
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
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        ...Typography.h1,
        color: Colors.primary,
        fontSize: 32,
    },
    changePhotoBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    changePhotoText: {
        ...Typography.body,
        color: Colors.primary,
        fontWeight: '600',
    },
    form: {
        gap: 20,
        marginBottom: 32,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        padding: 16,
        borderRadius: 12,
        alignItems: 'flex-start',
        gap: 12,
    },
    infoText: {
        flex: 1,
        ...Typography.caption,
        color: Colors.textSecondary,
        lineHeight: 18,
    },
    saveButton: {
        marginTop: Spacing.md,
    },
});
