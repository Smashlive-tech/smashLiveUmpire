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

  const mutedIconColor = isDark ? "#9CA3AF" : "#475569";

  if (loading || !match) {
    return (
      <ScreenWrapper>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#8AFF1A" />
          <Text className="mt-3 text-light-muted dark:text-dark-muted">
            Loading result…
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  const winnerTeam = match.winner === "A" ? match.teams.A : match.teams.B;

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
              className={`flex-1 justify-center p-3 rounded-lg border ${
                match.winner === side
                  ? "bg-primary/10 border-primary/40"
                  : "bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border"
              }`}
            >
              {/* Team Name */}
              <Text
                className={`text-sm font-semibold mb-2 ${
                  match.winner === side
                    ? "text-primary"
                    : "text-light-text dark:text-dark-text"
                }`}
              >
                {match.teams[side].name}
              </Text>

              {/* Players */}
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

              {/* Score */}
              <Text
                className={`text-4xl font-extrabold mt-3 ${
                  match.winner === side
                    ? "text-primary"
                    : "text-light-text dark:text-dark-text"
                }`}
              >
                {match.score[side]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ================= MATCH INFO ================= */}
      <View className="flex-1 items-center justify-center px-5">
        <View className="w-full max-w-md rounded-2xl bg-light-card dark:bg-dark-card p-6 border border-light-border dark:border-dark-border">
          {/* Status */}
          <View className="flex-row justify-center mb-4">
            <View className="flex-row items-center bg-green-500/10 px-4 py-1.5 rounded-full">
              <MaterialIcons name="check-circle" size={16} color="#22C55E" />
              <Text className="ml-2 text-sm font-medium text-green-600">
                Completed
              </Text>
            </View>
          </View>

          <Text className="text-center text-sm text-light-muted dark:text-dark-muted mb-2">
            Match Duration: {match.duration}
          </Text>

          <View className="flex-row items-center justify-center mt-4">
            <MaterialIcons name="emoji-events" size={24} color="#8AFF1A" />
            <Text className="ml-2 text-lg font-bold text-primary">
              Winner: {winnerTeam.name}
            </Text>
          </View>
        </View>
      </View>

      {/* ================= FOOTER ================= */}
      <View className="p-4 mb-10 border-t border-light-border dark:border-dark-border">
        <TouchableOpacity
          onPress={() => router.push("/home")}
          className="h-14 w-full items-center justify-center rounded-lg bg-primary"
        >
          <Text className="text-base font-bold text-black">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
