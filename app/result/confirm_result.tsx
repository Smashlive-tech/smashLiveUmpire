import ScreenWrapper from "@/components/ScreenWrapper";
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

  const mutedIconColor = isDark ? "#9CA3AF" : "#475569";

  if (loading || !match) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#8AFF1A" />
          <Text className="mt-3 text-light-muted dark:text-dark-muted">
            Loading match…
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      {/* ================= HEADER ================= */}
      <View className="px-5 pt-4 pb-3 mb-3">
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity onPress={() => router.back()} className="w-10">
            <Ionicons name="arrow-back" size={22} color={mutedIconColor} />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-light-text dark:text-dark-text text-center flex-1">
            {match.title}
          </Text>
        </View>

        {/* ================= PLAYER CARDS ================= */}
        <View className="flex-row gap-4">
          {(["A", "B"] as const).map((side) => (
            <View
              key={side}
              className="flex-1 justify-center p-3 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border"
            >
              <Text className="text-sm font-semibold text-light-text dark:text-dark-text mb-2">
                {match.teams[side].name}
              </Text>

              <View className="ml-1">
                {match.teams[side].players.map((player, idx) => (
                  <Text
                    key={idx}
                    className="text-base font-bold text-light-text dark:text-dark-text mb-1"
                  >
                    • {player.name}
                  </Text>
                ))}
              </View>

              <Text className="text-5xl font-extrabold text-center text-light-text dark:text-dark-text mt-3">
                {side === "A" ? (scoreA ?? "0") : (scoreB ?? "0")}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ================= INFO CARD ================= */}
      <View className="flex-1 items-center justify-center px-5">
        <View className="w-full max-w-md rounded-2xl bg-light-card dark:bg-dark-card p-6 border border-light-border dark:border-dark-border">
          <View className="flex-row justify-center mb-4">
            <View className="flex-row items-center bg-green-500/10 px-4 py-1.5 rounded-full">
              <MaterialIcons name="check-circle" size={16} color="#22C55E" />
              <Text className="ml-2 text-sm font-medium text-green-600">
                Completed
              </Text>
            </View>
          </View>

          <Text className="text-center text-sm text-light-muted dark:text-dark-muted mb-4">
            Confirm the final result before submission.
          </Text>

          <Text className="text-center text-xl font-bold text-light-text dark:text-dark-text mb-4">
            {match.teams.A.name}: {scoreA ?? "0"} | {match.teams.B.name}:{" "}
            {scoreB ?? "0"}
          </Text>
        </View>
      </View>

      {/* ================= FOOTER ================= */}
      <View className="p-4 border-t mb-10 border-light-border dark:border-dark-border">
        <TouchableOpacity
          onPress={() => alert("Result confirmed successfully!")}
          className="h-14 w-full items-center justify-center rounded-lg bg-primary"
        >
          <Text className="text-lg font-bold text-black">Confirm Result</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
