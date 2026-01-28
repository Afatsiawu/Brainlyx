import { Spacing, Typography } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, SlideInDown } from 'react-native-reanimated';

export default function UploadScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const [uploading, setUploading] = useState(false);

    const dynamicStyles = getStyles(colors);

    const handleUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;
            const file = result.assets[0];

            setUploading(true);

            const formData = new FormData();
            formData.append('file', {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || 'application/pdf',
            } as any);

            const response = await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setUploading(false);

            if (response.data) {
                Alert.alert(
                    'Success',
                    'Document uploaded! Processing started.',
                    [{ text: 'OK', onPress: () => router.push('/(tabs)') }]
                );
            }
        } catch (error) {
            console.error('Upload failed', error);
            setUploading(false);
            Alert.alert('Error', 'Failed to upload document');
        }
    };

    return (
        <ScrollView style={dynamicStyles.container} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={dynamicStyles.header}>
                <Text style={dynamicStyles.headerTitle}>Upload Materials</Text>
                <Text style={dynamicStyles.headerSubtitle}>
                    Import your lecture notes, PDFs, or handouts.
                </Text>
            </View>

            <View style={dynamicStyles.main}>
                <Animated.View entering={FadeInUp.delay(200)} style={dynamicStyles.uploadCard}>
                    <TouchableOpacity
                        style={dynamicStyles.dropZone}
                        onPress={handleUpload}
                        activeOpacity={0.8}
                        disabled={uploading}
                    >
                        <View style={[dynamicStyles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                            <Ionicons name="cloud-upload" size={48} color={colors.primary} />
                        </View>
                        <Text style={dynamicStyles.dropTitle}>Tap to Browse Files</Text>
                        <Text style={dynamicStyles.dropSubtitle}>
                            Supports PDF, DOCX, TXT
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View entering={SlideInDown.delay(400)} style={dynamicStyles.infoSection}>
                    <Text style={dynamicStyles.sectionTitle}>What happens next?</Text>

                    <View style={dynamicStyles.stepItem}>
                        <View style={[dynamicStyles.stepIcon, { backgroundColor: colors.primaryLight }]}>
                            <Text style={[dynamicStyles.stepNumber, { color: colors.primary }]}>1</Text>
                        </View>
                        <View style={dynamicStyles.stepContent}>
                            <Text style={dynamicStyles.stepTitle}>AI Analysis</Text>
                            <Text style={dynamicStyles.stepDesc}>We scan your document for key concepts.</Text>
                        </View>
                    </View>

                    <View style={dynamicStyles.stepLine} />

                    <View style={dynamicStyles.stepItem}>
                        <View style={[dynamicStyles.stepIcon, { backgroundColor: colors.secondary + '20' }]}>
                            <Text style={[dynamicStyles.stepNumber, { color: colors.secondary }]}>2</Text>
                        </View>
                        <View style={dynamicStyles.stepContent}>
                            <Text style={dynamicStyles.stepTitle}>Flashcards & Quiz</Text>
                            <Text style={dynamicStyles.stepDesc}>Automatically generated study sets.</Text>
                        </View>
                    </View>
                </Animated.View>
            </View>

            {uploading && (
                <Animated.View entering={FadeIn} style={dynamicStyles.overlay}>
                    <View style={dynamicStyles.loadingCard}>
                        <Text style={dynamicStyles.loadingText}>Uploading & Processing...</Text>
                        <Text style={dynamicStyles.loadingSub}>This may take a moment</Text>
                    </View>
                </Animated.View>
            )}
        </ScrollView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingTop: 80,
        paddingHorizontal: Spacing.xl,
        paddingBottom: 40,
    },
    headerTitle: {
        ...Typography.h1,
        color: colors.text,
        fontSize: 32,
        marginBottom: 8,
    },
    headerSubtitle: {
        ...Typography.body,
        color: colors.textSecondary,
        fontSize: 18,
    },
    main: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
    },
    uploadCard: {
        backgroundColor: colors.surface,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: 'dashed',
        marginBottom: 40,
        overflow: 'hidden',
    },
    dropZone: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    dropTitle: {
        ...Typography.h2,
        color: colors.text,
        fontSize: 20,
        marginBottom: 8,
    },
    dropSubtitle: {
        ...Typography.body,
        color: colors.textSecondary,
    },
    infoSection: {
        marginBottom: 40,
    },
    sectionTitle: {
        ...Typography.h3,
        color: colors.text,
        marginBottom: 24,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    stepNumber: {
        ...Typography.caption,
        fontWeight: '700',
        fontSize: 14,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        ...Typography.body,
        fontWeight: '600',
        color: colors.text,
    },
    stepDesc: {
        ...Typography.caption,
        color: colors.textSecondary,
    },
    stepLine: {
        width: 2,
        height: 24,
        backgroundColor: colors.border,
        marginLeft: 15,
        marginVertical: 4,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingCard: {
        backgroundColor: colors.surface,
        padding: 32,
        borderRadius: 24,
        alignItems: 'center',
    },
    loadingText: {
        ...Typography.h3,
        color: colors.text,
        marginBottom: 8,
    },
    loadingSub: {
        ...Typography.caption,
        color: colors.textSecondary,
    },
});
