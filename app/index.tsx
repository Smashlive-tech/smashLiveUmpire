import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function TestScreen() {
  const [count, setCount] = useState(0);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#101622] items-center justify-center">
      <View className="bg-blue-100 dark:bg-[#1A2233] p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 w-11/12 items-center">
        <Text className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Smash Live Tailwind Test
        </Text>

        <Text className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Count: {count}
        </Text>

        <TouchableOpacity
          className="bg-[#0d59f2] px-6 py-3 rounded-xl active:scale-95"
          onPress={() => setCount((prev) => prev + 1)}
        >
          <Text className="text-white font-semibold text-base">Increase</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
