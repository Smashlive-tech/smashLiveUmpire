import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Player = { name: string };
type Team = { name: string; players: Player[] };
type Match = {
  id: string;
  title: string;
  court: string;
  teams: { A: Team; B: Team };
};

const mockMatches: Record<string, Match> = {
  "1": {
    id: "1",
    title: "Men's Doubles – Final",
    court: "Court 3",
    teams: {
      A: {
        name: "Team Malaysia",
        players: [{ name: "Aaron Chia" }, { name: "Soh Wooi Yik" }],
      },
      B: {
        name: "Team Indonesia",
        players: [{ name: "Mohammad Ahsan" }, { name: "Hendra Setiawan" }],
      },
    },
  },
};

export default function ConfirmResultScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const { id, scoreA, scoreB } = useLocalSearchParams<{
    id: string;
    scoreA?: string;
    scoreB?: string;
  }>();

  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMatch(mockMatches[id as string] || mockMatches["1"]);
      setLoading(false);
    }, 400);
  }, [id]);

  if (loading || !match) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-[#101622]">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-3 text-gray-500 dark:text-gray-400">
          Loading match…
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#101622]">
      {/* ===== Header (Same as StartMatchScreen) ===== */}
      <View className="px-5 pt-4 pb-3 mb-3">
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity onPress={() => router.back()} className="w-10">
            <Ionicons
              name="arrow-back"
              size={22}
              color={isDark ? "#f9fafb" : "#111827"}
            />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-gray-900 dark:text-white text-center flex-1">
            {match.title}
          </Text>
        </View>

        {/* ===== Player Cards (same design as StartMatchScreen) ===== */}
        <View className="flex-row gap-4">
          {(["A", "B"] as const).map((side) => (
            <View
              key={side}
              className="flex-1 justify-center p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg"
            >
              {/* Team Name */}
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 text-left">
                {match.teams[side].name}
              </Text>

              {/* Player List */}
              <View className="ml-1">
                {match.teams[side].players.map((player, idx) => (
                  <Text
                    key={idx}
                    className="text-base font-bold text-gray-900 dark:text-white text-left mb-1"
                  >
                    • {player.name}
                  </Text>
                ))}
              </View>

              {/* Score */}
              <Text className="text-5xl font-extrabold text-center text-gray-900 dark:text-white mt-3">
                {side === "A" ? (scoreA ?? "0") : (scoreB ?? "0")}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ===== Match Info Card ===== */}
      <View className="flex-1 items-center justify-center px-5">
        <View className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1A2233] p-6 shadow-md">
          <View className="flex-row justify-center mb-4">
            <View className="flex-row items-center bg-green-500/10 dark:bg-green-500/20 px-4 py-1.5 rounded-full">
              <MaterialIcons
                name="check-circle"
                size={16}
                color={isDark ? "#4ade80" : "#16a34a"}
              />
              <Text className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">
                Completed
              </Text>
            </View>
          </View>

          <Text className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
            Confirm the final result before submission.
          </Text>

          <Text className="text-center text-xl font-bold text-gray-900 dark:text-white mb-4">
            {match.teams.A.name}: {scoreA ?? "0"} | {match.teams.B.name}:{" "}
            {scoreB ?? "0"}
          </Text>
        </View>
      </View>

      {/* ===== Footer ===== */}
      <View className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#101622]">
        <TouchableOpacity
          onPress={() => alert("Result confirmed successfully!")}
          className="h-14 w-full items-center justify-center rounded-lg bg-blue-600"
        >
          <Text className="text-lg font-bold text-white">Confirm Result</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
