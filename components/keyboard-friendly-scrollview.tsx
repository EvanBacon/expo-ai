"use client";

import React, { useCallback, useRef } from "react";
import { ScrollViewProps } from "react-native";

import Animated, {
  KeyboardState,
  scrollTo,
  useAnimatedKeyboard,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export function KeyboardFriendlyScrollView({
  children,
  ...props
}: ScrollViewProps) {
  const ref = useAnimatedRef<Animated.ScrollView>();
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const keyboard = useAnimatedKeyboard();
  const { bottom } = useSafeAreaInsets();
  const scrollOffset = useSharedValue(0);
  const lastKeyboardState = useSharedValue(KeyboardState.UNKNOWN);
  const keyboardHeight = useSharedValue(0);
  const scrollOffsetAtStart = useSharedValue(0);
  const isTouching = useSharedValue(false);
  const lastKeyboardPosition = useSharedValue(0);
  const isScrollViewControlled = useSharedValue(false);

  // A self-contained check to lazily determine how large the keyboard is when it's open.
  useDerivedValue(() => {
    if (keyboard.state.value === KeyboardState.OPEN) {
      keyboardHeight.value = keyboard.height.value;
    }
  });

  const scrollToBottom = useCallback(() => {
    timeout.current && clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      ref.current?.scrollToEnd({ animated: true });
    }, 15);
  }, [ref]);

  const scrollToBottomIfNotPanning = useCallback(() => {
    if (
      keyboard.state.value === KeyboardState.OPENING ||
      keyboard.state.value === KeyboardState.CLOSING ||
      isScrollViewControlled.value
    ) {
      return;
    }
    scrollToBottom();
  }, [keyboard, isScrollViewControlled, scrollToBottom]);

  useDerivedValue(() => {
    if (
      !isScrollViewControlled.value &&
      keyboard.state.value === KeyboardState.CLOSING &&
      lastKeyboardState.value === KeyboardState.OPEN &&
      isTouching.value
    ) {
      isScrollViewControlled.value = true;
    }

    if (
      keyboard.state.value === KeyboardState.OPEN ||
      keyboard.state.value === KeyboardState.CLOSED
    ) {
      if (
        // Keyboard opened without user dragging.
        // This means we can move to a controlled position without it being unexpected behavior.
        !isScrollViewControlled.value &&
        lastKeyboardState.value !== keyboard.state.value &&
        keyboard.state.value === KeyboardState.OPEN
      ) {
        scrollTo(
          ref,
          0,
          // Scroll to some maximum offset
          Number.MAX_SAFE_INTEGER,
          true
        );
      }

      // Track that the native framework is no longer controlling the scroll view scrolling with the keyboard.
      isScrollViewControlled.value = false;
    }

    // Track last keyboard state
    if (lastKeyboardState.value !== keyboard.state.value) {
      lastKeyboardState.value = keyboard.state.value;
      scrollOffsetAtStart.value = scrollOffset.value;
    }
  });

  useDerivedValue(() => {
    if (isScrollViewControlled.value) {
      // The native framework is controlling the scroll view scrolling with the keyboard, so we shouldn't animate it ourselves.
      return;
    }

    if (keyboard.state.value === KeyboardState.OPENING) {
      scrollTo(
        ref,
        0,
        scrollOffsetAtStart.value + Math.max(0, keyboard.height.value - bottom),
        false
      );
    } else if (keyboard.state.value === KeyboardState.CLOSING) {
      scrollTo(
        ref,
        0,
        scrollOffsetAtStart.value -
          Math.max(0, keyboardHeight.value - keyboard.height.value - bottom), // Math.max(0, keyboard.height.value - bottom),
        false
      );
    }

    lastKeyboardPosition.value = keyboard.height.value;
  });

  const keyboardBlurUnderlayStyle = useAnimatedStyle(() => {
    const height = Math.max(keyboard.height.value, bottom);
    return {
      height,
    };
  }, [bottom]);

  return (
    <Animated.ScrollView
      {...props}
      onTouchStart={() => {
        isTouching.value = true;
      }}
      onTouchMove={() => {
        isTouching.value = true;
      }}
      onTouchEnd={() => {
        isTouching.value = false;
      }}
      onTouchCancel={() => {
        isTouching.value = false;
      }}
      onScroll={(e) => {
        scrollOffset.value = e.nativeEvent.contentOffset.y;
      }}
      onContentSizeChange={scrollToBottomIfNotPanning}
      onLayout={scrollToBottomIfNotPanning}
      scrollEventThrottle={16}
      ref={ref}
    >
      {children}
      {process.env.EXPO_OS !== "web" && (
        <Animated.View style={keyboardBlurUnderlayStyle} />
      )}
    </Animated.ScrollView>
  );
}
