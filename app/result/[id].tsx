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
// import axios from "axios";

type Player = { name: string };
type Team = { name: string; players: Player[] };
type Match = {
  id: string;
  title: string;
  court: string;
  duration: string;
  teams: { A: Team; B: Team };
  score: { A: number; B: number };
  winner: "A" | "B";
};

export default function ViewResultScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const { id } = useLocalSearchParams<{ id: string }>();

  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchResult = async () => {
      try {
        // ===== API CALL (commented for now) =====
        // const res = await axios.get(`https://your-api.com/api/matches/${id}/result`);
        // setMatch(res.data);

        // ===== Static Mock Data =====
        const mockMatch: Match = {
          id: "1",
          title: "Men's Doubles – Final",
          court: "Court 3",
          duration: "00:45:30",
          teams: {
            A: {
              name: "Team Malaysia",
              players: [{ name: "Aaron Chia" }, { name: "Soh Wooi Yik" }],
            },
            B: {
              name: "Team Indonesia",
              players: [
                { name: "Mohammad Ahsan" },
                { name: "Hendra Setiawan" },
              ],
            },
          },
          score: { A: 21, B: 18 },
          winner: "A",
        };

        setTimeout(() => setMatch(mockMatch), 400);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchResult();
  }, [id]);

  if (loading || !match) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-[#101622]">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-3 text-gray-500 dark:text-gray-400">
          Loading result…
        </Text>
      </SafeAreaView>
    );
  }

  const winnerTeam = match.winner === "A" ? match.teams.A : match.teams.B;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#101622]">
      {/* ===== Header (Same style as StartMatchScreen) ===== */}
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

        {/* ===== Player Cards (same layout, no buttons) ===== */}
        <View className="flex-row gap-4">
          {(["A", "B"] as const).map((side) => (
            <View
              key={side}
              className={`flex-1 justify-center p-3 rounded-lg ${
                match.winner === side
                  ? "bg-blue-100 dark:bg-blue-900/40 border border-blue-400/40"
                  : "bg-gray-100 dark:bg-gray-800/50"
              }`}
            >
              {/* Team Name */}
              <Text
                className={`text-sm font-semibold mb-2 text-left ${
                  match.winner === side
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
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

              {/* Score Display */}
              <Text
                className={`text-4xl font-extrabold mt-3 ${
                  match.winner === side
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {match.score[side]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ===== Match Info & Winner Section ===== */}
      <View className="flex-1 items-center justify-center px-5">
        <View className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1A2233] p-6 shadow-md">
          {/* Status */}
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

          <Text className="text-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            Match Duration: {match.duration}
          </Text>

          <View className="flex-row items-center justify-center mt-4">
            <MaterialIcons
              name="emoji-events"
              size={24}
              color={isDark ? "#60a5fa" : "#2563EB"}
            />
            <Text className="ml-2 text-lg font-bold text-blue-600 dark:text-blue-400">
              Winner: {winnerTeam.name}
            </Text>
          </View>
        </View>
      </View>

      {/* ===== Footer Buttons ===== */}
      <View className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#101622]">
        <TouchableOpacity
          onPress={() => router.push("/home")}
          className="h-14 w-full items-center justify-center rounded-lg bg-blue-600"
        >
          <Text className="text-base font-bold text-white">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
