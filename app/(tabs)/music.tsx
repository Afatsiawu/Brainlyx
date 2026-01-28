import { Input } from '@/components/ui/Input';
import { Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useMusic } from '@/context/MusicContext';
import api from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface Playlist {
    id: string;
    name: string;
    description: string;
    images: { url: string }[];
    external_urls: { spotify: string };
    tracks: { total: number };
}

export default function MusicScreen() {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { playPlaylist } = useMusic();
    const router = useRouter();

    const fetchPlaylists = async (query?: string) => {
        try {
            const response = await api.get('/music/playlists', {
                params: { q: query || undefined }
            });
            setPlaylists(response.data);
        } catch (error) {
            console.error('Failed to fetch playlists:', error);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchPlaylists();
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim().length > 2) {
                setLoading(true);
                fetchPlaylists(searchQuery);
            } else if (searchQuery.trim().length === 0) {
                fetchPlaylists();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPlaylists(searchQuery);
        setRefreshing(false);
    };

    const handleOpenPlayer = (playlist: Playlist) => {
        playPlaylist({ id: playlist.id, name: playlist.name });
    };

    if (loading && playlists.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Tuning in to focus...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.primary + '20', Colors.background]}
                style={styles.headerGradient}
            >
                <View style={styles.header}>
                    <Animated.View entering={FadeInDown.duration(800)}>
                        <Text style={styles.title}>Study Beats</Text>
                        <Text style={styles.subtitle}>Play in-app to stay focused while studying.</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(200)} style={styles.searchContainer}>
                        <Input
                            placeholder="Find a mood or genre..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            icon="search-outline"
                            containerStyle={styles.searchInputContainer}
                        />
                    </Animated.View>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
            >
                <View style={styles.content}>
                    {playlists.map((playlist, index) => playlist && (
                        <Animated.View
                            entering={FadeInUp.delay(index * 50).duration(400)}
                            key={playlist.id}
                            style={styles.playlistCardContainer}
                        >
                            <TouchableOpacity
                                style={styles.playlistCard}
                                onPress={() => handleOpenPlayer(playlist)}
                                activeOpacity={0.85}
                            >
                                <Image
                                    source={{ uri: playlist.images[0]?.url }}
                                    style={styles.playlistImage}
                                />
                                <View style={styles.playlistInfo}>
                                    <Text style={styles.playlistName} numberOfLines={1}>{playlist.name}</Text>
                                    <Text style={styles.playlistDesc} numberOfLines={2}>
                                        {playlist.description || 'No description available.'}
                                    </Text>
                                    <View style={styles.playlistFooter}>
                                        <View style={styles.trackCount}>
                                            <Ionicons name="musical-notes" size={14} color={Colors.textSecondary} />
                                            <Text style={styles.trackCountText}>{playlist.tracks.total} tracks</Text>
                                        </View>
                                        <View style={styles.spotifyBadge}>
                                            <Ionicons name="musical-notes" size={14} color="#1DB954" />
                                            <Text style={styles.spotifyText}>Play In-App</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.playIconButton}>
                                    <Ionicons name="play" size={24} color="white" />
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}

                    {playlists.length === 0 && !loading && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search-outline" size={64} color={Colors.border} />
                            <Text style={styles.emptyText}>No matches found for "{searchQuery}"</Text>
                        </View>
                    )}
                </View>

                <View style={styles.safetyPadding} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scroll: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    loadingText: {
        ...Typography.body,
        marginTop: 16,
        color: Colors.textSecondary,
    },
    headerGradient: {
        paddingTop: 60,
        paddingBottom: 20,
    },
    header: {
        paddingHorizontal: Spacing.xl,
    },
    title: {
        ...Typography.h1,
        fontSize: 34,
        color: Colors.text,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
        marginTop: 8,
        fontSize: 16,
        marginBottom: 20,
    },
    searchContainer: {
        marginTop: 10,
    },
    searchInputContainer: {
        marginBottom: 0,
    },
    content: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.md,
    },
    playlistCardContainer: {
        marginBottom: 16,
        ...Shadows.small,
    },
    playlistCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    playlistImage: {
        width: 100,
        height: 100,
    },
    playlistInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    playlistName: {
        ...Typography.h3,
        fontSize: 16,
        color: Colors.text,
        marginBottom: 2,
    },
    playlistDesc: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: 8,
        lineHeight: 14,
        fontSize: 11,
    },
    playlistFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    trackCount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    trackCountText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontSize: 11,
    },
    spotifyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.secondary + '15',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    spotifyText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.secondary,
    },
    playIconButton: {
        width: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.secondary + '10',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    emptyText: {
        ...Typography.body,
        color: Colors.textSecondary,
        marginTop: 16,
        textAlign: 'center',
    },
    safetyPadding: {
        height: 120,
    }
});
