import React from 'react';
import { Platform } from 'react-native';
import Reanimated from 'react-native-reanimated';

// Re-export every named export (FadeInDown, useSharedValue, withSpring, ...)
export * from 'react-native-reanimated';

const ANIMATION_PROPS = ['entering', 'exiting', 'layout'];

/**
 * Reanimated's web backend can crash when an animated element is removed:
 * its teardown reads the element's layout from a detached node and throws
 * "Cannot read properties of undefined (reading 'top')".
 *
 * To keep the app stable in the browser we strip entrance/exit/layout
 * animations on web. Native (iOS/Android) keeps the full effects.
 */
const stripAnimationProps = (props: Record<string, any>) => {
    if (Platform.OS !== 'web') {
        return props;
    }
    const next: Record<string, any> = { ...props };
    ANIMATION_PROPS.forEach((prop) => delete next[prop]);
    return next;
};

const wrap = (Component: any, name: string) => {
    const Wrapped = (props: any) => {
        const ComponentAny = Component as any;
        return <ComponentAny {...stripAnimationProps(props)} />;
    };
    Wrapped.displayName = `WebSafeAnimated.${name}`;
    return Wrapped;
};

const Animated = {
    ...Reanimated,
    // Cast back to the original component types so generics (e.g. FlatList's
    // renderItem types) survive the wrapper.
    View: wrap(Reanimated.View, 'View') as unknown as typeof Reanimated.View,
    Text: wrap(Reanimated.Text, 'Text') as unknown as typeof Reanimated.Text,
    Image: wrap(Reanimated.Image, 'Image') as unknown as typeof Reanimated.Image,
    ScrollView: wrap(Reanimated.ScrollView, 'ScrollView') as unknown as typeof Reanimated.ScrollView,
    FlatList: wrap(Reanimated.FlatList, 'FlatList') as unknown as typeof Reanimated.FlatList,
};

export default Animated;
