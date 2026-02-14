import { useMusic } from '@/context/MusicContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const COLORS = {
  active: '#8B5CF6',
  inactive: '#9BA8C7',
  background: '#FFFFFF',
  fabBg: '#8B5CF6',
};

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.outerContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.itemsWrapper}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label = options.title || route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const isCenter = route.name === 'index';

          if (isCenter) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.9}
                style={styles.fabContainer}
              >
                <View style={styles.fabShadow}>
                  <View style={styles.fab}>
                    <Ionicons name="home" size={24} color="white" />
                  </View>
                </View>
                <Text style={[styles.labelText, { color: isFocused ? COLORS.active : COLORS.inactive, marginTop: -2 }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          }

          let iconName: any = 'square-outline';
          if (route.name === 'upload') iconName = 'cloud-upload-outline';
          if (route.name === 'study') iconName = 'book-outline';
          if (route.name === 'music') iconName = 'musical-notes-outline';
          if (route.name === 'profile') iconName = 'person-outline';

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={isFocused ? COLORS.active : COLORS.inactive}
              />
              <Text style={[styles.labelText, { color: isFocused ? COLORS.active : COLORS.inactive }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const { playingPlaylist, isPlayerVisible, isMinimized, minimizePlayer, expandPlayer, stopMusic } = useMusic();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}>
        <Tabs.Screen name="upload" options={{ title: 'Upload' }} />
        <Tabs.Screen name="study" options={{ title: 'Study' }} />
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen
          name="youtube"
          options={{
            title: 'YouTube',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="play-circle" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>

      {/* Global Player Overlay */}
      {playingPlaylist && (
        <Animated.View
          entering={SlideInUp}
          style={[
            styles.modalContainer,
            { pointerEvents: (isPlayerVisible || isMinimized) ? 'auto' : 'none' },
            !isPlayerVisible && !isMinimized && { display: 'none' },
            isMinimized && styles.minimizedOverlay
          ]}
        >
          <View style={[styles.modalContent, isMinimized && styles.minimizedContent]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />

              <TouchableOpacity
                onPress={isMinimized ? expandPlayer : minimizePlayer}
                style={styles.headerActionButton}
              >
                <Ionicons
                  name={isMinimized ? "chevron-up" : "chevron-down"}
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>

              <Text style={styles.modalTitle} numberOfLines={1}>
                {playingPlaylist.name}
              </Text>

              <TouchableOpacity
                onPress={stopMusic}
                style={styles.headerActionButton}
              >
                <Ionicons name="stop-circle-outline" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>

            <View style={[styles.webviewWrapper, isMinimized && { height: 0, opacity: 0 }]}>
              <WebView
                source={{
                  html: `
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                        <style>
                          body { margin: 0; padding: 0; background-color: black; overflow: hidden; display: flex; justify-content: center; align-items: center; height: 100vh; }
                          iframe { width: 100%; height: 100%; border: none; }
                        </style>
                      </head>
                      <body>
                        <iframe 
                          src="https://www.youtube.com/embed/${playingPlaylist.id}?autoplay=1&controls=1&modestbranding=1&rel=0&playsinline=1"
                          frameborder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          referrerpolicy="strict-origin-when-cross-origin" 
                          allowfullscreen
                        ></iframe>
                      </body>
                    </html>
                  `,
                  baseUrl: "https://www.youtube.com"
                }}
                style={styles.webview}
                allowsInlineMediaPlayback={true}
                allowsFullscreenVideo={true}
                mediaPlaybackRequiresUserAction={false}
                startInLoadingState={true}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                originWhitelist={['*']}
                renderLoading={() => (
                  <View style={styles.webviewLoading}>
                    <ActivityIndicator size="large" color={COLORS.active} />
                  </View>
                )}
              />
            </View>

            {isMinimized && (
              <TouchableOpacity
                style={styles.expandArea}
                onPress={expandPlayer}
                activeOpacity={1}
              >
                <Text style={styles.minimizedText}>Music playing... Tap to expand</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    backgroundColor: 'white',
    // Removed rounded corners to make it a rectangle
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    // Removed position: absolute to prevent it from overlapping content
  },
  itemsWrapper: {
    flexDirection: 'row',
    width: '100%',
    height: 65, // Clean, standard height
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabContainer: {
    top: -15, // Keep a small lift for the home button to make it pop
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabShadow: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.active,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.fabBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  minimizedOverlay: {
    backgroundColor: 'transparent',
    pointerEvents: 'box-none',
  },
  modalContent: {
    height: height * 0.85,
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 25,
  },
  minimizedContent: {
    height: 70,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 80, // Above tab bar
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  headerActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHandle: {
    position: 'absolute',
    top: -6,
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  webviewWrapper: {
    flex: 1,
    backgroundColor: 'black',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  expandArea: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  minimizedText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.active,
  },
  webview: {
    flex: 1,
  },
  webviewLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
