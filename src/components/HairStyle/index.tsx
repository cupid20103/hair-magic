import React from "react";
import { Pressable } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { HairStyleProps } from "@/types/component";

const HairStyle: React.FC<HairStyleProps> = ({ image, onPress }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const onPressIn = () => {
    scale.value = withTiming(1.2, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };

  const onPressOut = () => {
    scale.value = withTiming(1, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };

  return (
    <Pressable
      className="flex-1 h-24 rounded-xl overflow-hidden"
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View className="w-full h-full" style={animatedStyle}>
        <Image
          className="w-full h-full"
          source={image}
          contentFit="cover"
          transition={1000}
        />
      </Animated.View>
    </Pressable>
  );
};

export default HairStyle;
