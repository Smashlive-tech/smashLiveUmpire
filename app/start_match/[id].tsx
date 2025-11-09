import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import StopwatchTimer, {
  StopwatchTimerMethods,
} from "react-native-animated-stopwatch-timer";
import { SafeAreaView } from "react-native-safe-area-context";

type Player = { name: string };
type Team = { name: string; players: Player[] };
type Match = {
  id: string;
  title: string;
  type: "1v1" | "2v2" | "4v4";
  court: string;
  teams: { A: Team; B: Team };
};

const mockMatches: Record<string, Match> = {
  "1": {
    id: "1",
    title: "Men's Singles – Final",
    type: "1v1",
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

export default function StartMatchScreen({ matchId }: { matchId: string }) {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  // Scores start from 0
  const [scores, setScores] = useState({ A: 0, B: 0 });
  const [servingTeam, setServingTeam] = useState<"A" | "B">("A");

  const [isRunning, setIsRunning] = useState(false);
  const stopwatchTimerRef = useRef<StopwatchTimerMethods>(null);

  useEffect(() => {
    setTimeout(() => {
      setMatch(mockMatches[matchId] || mockMatches["1"]);
      setLoading(false);
    }, 500);
  }, [matchId]);

  // ===== Score update + auto serve =====
  const updateScore = (team: "A" | "B", delta: number) => {
    setScores((prev) => {
      const newScore = { ...prev, [team]: Math.max(0, prev[team] + delta) };

      // Only change serve if score increased (not decreased)
      if (delta > 0) {
        setServingTeam(team);
      }

      return newScore;
    });
  };

  // ===== Stopwatch Controls =====
  const handlePlay = () => {
    stopwatchTimerRef.current?.play();
    setIsRunning(true);
  };

  const handlePause = () => {
    stopwatchTimerRef.current?.pause();
    setIsRunning(false);
  };

  const handleReset = () => {
    stopwatchTimerRef.current?.reset();
    setIsRunning(false);
    setScores({ A: 0, B: 0 }); // reset scores too
    setServingTeam("A");
  };

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
      {/* ===== Header ===== */}
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

        {/* Player Cards */}
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

              {/* Serving Indicator */}
              {servingTeam === side && (
                <View className="flex-row items-center mt-2">
                  <MaterialIcons
                    name="sports-tennis"
                    size={18}
                    color="#2563EB"
                  />
                  <Text className="ml-1 text-sm font-medium text-blue-600">
                    Serving
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* ===== Main Scoring Area ===== */}
      <View className="flex-1 px-5 items-center justify-center mb-4">
        <View className="flex-row w-full justify-between">
          {(["A", "B"] as const).map((side) => (
            <View key={side} className="items-center flex-1">
              <Text className="text-[80px] font-extrabold text-gray-900 dark:text-white leading-none mb-4">
                {scores[side]}
              </Text>

              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={() => updateScore(side, -1)}
                  className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800/50 items-center justify-center"
                >
                  <Ionicons
                    name="remove"
                    size={36}
                    color={isDark ? "#d1d5db" : "#4b5563"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => updateScore(side, 1)}
                  className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800/50 items-center justify-center"
                >
                  <Ionicons
                    name="add"
                    size={36}
                    color={isDark ? "#d1d5db" : "#4b5563"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* ===== Timer & Controls ===== */}
        <View className="mt-10 w-full max-w-sm items-center">
          <StopwatchTimer
            ref={stopwatchTimerRef}
            containerStyle={{
              backgroundColor: "transparent",
              marginBottom: 12,
            }}
            trailingZeros={0}
            decimalSeparator=":"
            textCharStyle={{
              fontSize: 38,
              fontWeight: "bold",
              color: isDark ? "#fff" : "#111827",
            }}
          />

          <View className="flex-row justify-center gap-6 p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
            <TouchableOpacity
              onPress={isRunning ? handlePause : handlePlay}
              className="p-3 rounded-lg "
            >
              <Ionicons
                name={isRunning ? "pause" : "play"}
                size={26}
                color="#2563EB"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ===== Footer Buttons ===== */}
      <View className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#101622]">
        <TouchableOpacity className="mb-3 h-14 w-full items-center justify-center rounded-lg bg-blue-600">
          <Text className="text-lg font-bold text-white">Submit Result</Text>
        </TouchableOpacity>

        <TouchableOpacity className="h-14 w-full items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600">
          <Text className="text-lg font-medium text-gray-600 dark:text-gray-300">
            Report Issue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
