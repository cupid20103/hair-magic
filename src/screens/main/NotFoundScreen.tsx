import React from "react";
import { Text, View } from "react-native";

const NotFoundScreen: React.FC = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-base text-gray-500 dark:text-white">
        Not Found!
      </Text>
    </View>
  );
};

export default NotFoundScreen;
