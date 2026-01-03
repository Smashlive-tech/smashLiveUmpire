import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import StopwatchTimer, {
  StopwatchTimerMethods,
} from "react-native-animated-stopwatch-timer";

/* ================= TYPES ================= */

type Player = { name: string };
type Team = { name: string; players: Player[] };

type Match = {
  id: string;
  title: string;
  court: string;
  teams: { A: Team; B: Team };
};

/* ================= MOCK DATA ================= */

const mockMatch: Match = {
  id: "1",
  title: "Men’s Doubles – Final",
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
};

/* ================= BADMINTON RULE HELPERS ================= */

// BWF-compliant set win logic
const isSetWon = (a: number, b: number) => {
  const max = Math.max(a, b);
  const min = Math.min(a, b);

  if (max === 30) return true; // 30–29 cap
  if (max >= 21 && max - min >= 2) return true;

  return false;
};

const getSetWinner = (set: { A: number; B: number }): "A" | "B" =>
  set.A > set.B ? "A" : "B";

/* ================= SCREEN ================= */

export default function StartMatchScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const mutedIconColor = isDark ? "#9CA3AF" : "#475569";

  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<Match | null>(null);

  const [showServeModal, setShowServeModal] = useState(true);
  const [servingTeam, setServingTeam] = useState<"A" | "B" | null>(null);

  const [currentSet, setCurrentSet] = useState(0);
  const [sets, setSets] = useState([
    { A: 0, B: 0 },
    { A: 0, B: 0 },
    { A: 0, B: 0 },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [setFinished, setSetFinished] = useState(false);

  const stopwatchTimerRef = useRef<StopwatchTimerMethods>(null);

  useEffect(() => {
    setTimeout(() => {
      setMatch(mockMatch);
      setLoading(false);
    }, 500);
  }, []);

  /* ================= SCORE LOGIC (VALIDATED) ================= */

  const updateScore = (team: "A" | "B", delta: number) => {
    if (!isRunning || setFinished) return;

    setSets((prev) => {
      const updated = [...prev];
      const current = updated[currentSet];
      const opponent = team === "A" ? "B" : "A";

      const nextScore = current[team] + delta;

      // ❌ Invalid score ranges
      if (nextScore < 0 || nextScore > 30) return prev;

      updated[currentSet] = { ...current, [team]: nextScore };

      if (delta > 0) setServingTeam(team);

      const a = updated[currentSet].A;
      const b = updated[currentSet].B;

      // ✅ Check set completion
      if (isSetWon(a, b)) {
        stopwatchTimerRef.current?.pause();
        setIsRunning(false);
        setSetFinished(true);

        Alert.alert(
          "Set Complete",
          `${match?.teams[getSetWinner({ A: a, B: b })].name} won Set ${
            currentSet + 1
          }`
        );
      }

      return updated;
    });
  };

  /* ================= TIMER ================= */

  const handlePlay = () => {
    stopwatchTimerRef.current?.play();
    setIsRunning(true);
  };

  const handlePause = () => {
    stopwatchTimerRef.current?.pause();
    setIsRunning(false);
  };

  /* ================= SUBMIT LOGIC (MATCH VALIDATION) ================= */

  const handleSubmitSet = () => {
    const playedSets = sets.slice(0, currentSet + 1);
    const winners = playedSets.map(getSetWinner);

    const winsA = winners.filter((w) => w === "A").length;
    const winsB = winners.filter((w) => w === "B").length;

    // ❌ Invalid match state
    if (winsA < 2 && winsB < 2 && currentSet === 2) {
      Alert.alert("Invalid Result", "Match winner not decided yet.");
      return;
    }

    Alert.alert(
      "Submit Set Result",
      `Submit result for Set ${currentSet + 1}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: () => {
            // 🏆 Match completed early
            if (winsA === 2 || winsB === 2) {
              router.push({
                pathname: "/result/confirm_result",
                params: {
                  set1A: sets[0].A,
                  set1B: sets[0].B,
                  set2A: sets[1].A,
                  set2B: sets[1].B,
                  set3A: sets[2].A,
                  set3B: sets[2].B,
                },
              });
              return;
            }

            // ➡️ Move to next set
            setCurrentSet((s) => s + 1);
            setSetFinished(false);
            setServingTeam(null);
            stopwatchTimerRef.current?.reset();
            setShowServeModal(true);
          },
        },
      ]
    );
  };

  /* ================= LOADING ================= */

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

  /* ================= UI ================= */

  return (
    <ScreenWrapper>
      {/* ================= SERVE MODAL ================= */}
      <Modal visible={showServeModal} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/60 px-6">
          <View className="bg-light-card dark:bg-dark-card rounded-2xl p-6 w-full">
            <Text className="text-lg font-bold text-center mb-4 text-light-text dark:text-dark-text">
              Select First Serving Team
            </Text>

            {(["A", "B"] as const).map((side) => (
              <TouchableOpacity
                key={side}
                onPress={() => {
                  setServingTeam(side);
                  setShowServeModal(false);
                  handlePlay();
                }}
                className="py-3 mb-3 rounded-lg bg-primary"
              >
                <Text className="text-black text-center font-semibold">
                  {match.teams[side].name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* ================= HEADER ================= */}
      <View className="px-5 pt-4 pb-3">
        <Text className="text-lg font-bold text-center text-light-text dark:text-dark-text">
          {match.title}
        </Text>

        {/* TEAMS */}
        <View className="flex-row gap-4 mt-4">
          {(["A", "B"] as const).map((side) => (
            <View
              key={side}
              className="flex-1 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg p-3"
            >
              <Text className="font-semibold mb-1 text-light-text dark:text-dark-text">
                {match.teams[side].name}
              </Text>

              {match.teams[side].players.map((p) => (
                <Text
                  key={p.name}
                  className="text-sm text-light-muted dark:text-dark-muted"
                >
                  • {p.name}
                </Text>
              ))}

              {servingTeam === side && (
                <View className="flex-row items-center mt-2">
                  <MaterialIcons
                    name="sports-tennis"
                    size={16}
                    color="#8AFF1A"
                  />
                  <Text className="ml-1 text-primary text-sm font-medium">
                    Serving
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* SET INDICATOR */}
        <View className="flex-row justify-center gap-2 mt-3">
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              className={`px-3 py-1 rounded-full ${
                i === currentSet
                  ? "bg-primary"
                  : "bg-light-border dark:bg-dark-border"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  i === currentSet
                    ? "text-black"
                    : "text-light-muted dark:text-dark-muted"
                }`}
              >
                Set {i + 1}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ================= SCORE ================= */}
      <View className="flex-1 items-center justify-center">
        <View className="flex-row w-full justify-between px-5">
          {(["A", "B"] as const).map((side) => (
            <View key={side} className="items-center flex-1">
              <Text className="text-[72px] font-extrabold text-light-text dark:text-dark-text">
                {sets[currentSet][side]}
              </Text>

              <View className="flex-row gap-4 mt-4">
                <TouchableOpacity
                  disabled={!isRunning || setFinished}
                  onPress={() => updateScore(side, -1)}
                  className={`w-14 h-14 rounded-full items-center justify-center ${
                    isRunning && !setFinished
                      ? "bg-light-card dark:bg-dark-card"
                      : "bg-light-border dark:bg-dark-border opacity-50"
                  }`}
                >
                  <Ionicons name="remove" size={28} color={mutedIconColor} />
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={!isRunning || setFinished}
                  onPress={() => updateScore(side, 1)}
                  className={`w-14 h-14 rounded-full items-center justify-center ${
                    isRunning && !setFinished
                      ? "bg-light-card dark:bg-dark-card"
                      : "bg-light-border dark:bg-dark-border opacity-50"
                  }`}
                >
                  <Ionicons name="add" size={28} color={mutedIconColor} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* TIMER */}
        <View className="mt-10 items-center">
          <StopwatchTimer
            ref={stopwatchTimerRef}
            trailingZeros={0}
            decimalSeparator=":"
            textCharStyle={{
              fontSize: 36,
              fontWeight: "bold",
              color: isDark ? "#FFFFFF" : "#0F172A",
            }}
          />

          <View className="flex-row gap-6 mt-4 bg-light-card dark:bg-dark-card px-6 py-3 rounded-lg">
            <TouchableOpacity onPress={isRunning ? handlePause : handlePlay}>
              <Ionicons
                name={isRunning ? "pause" : "play"}
                size={26}
                color="#8AFF1A"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Reset Timer",
                  "Do you want to reset the timer for this set?",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Reset",
                      onPress: () => {
                        stopwatchTimerRef.current?.reset();
                        setIsRunning(false);
                      },
                    },
                  ]
                )
              }
            >
              <Ionicons name="refresh" size={26} color="#8AFF1A" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ================= FOOTER ================= */}
      <View className="p-4 border-t mb-10 border-light-border dark:border-dark-border">
        <TouchableOpacity
          disabled={!setFinished}
          onPress={handleSubmitSet}
          className={`h-12 rounded-lg items-center justify-center ${
            setFinished ? "bg-primary" : "bg-primary/40"
          }`}
        >
          <Text className="text-black text-base font-bold">
            {currentSet < 2 ? "Submit Set Result" : "Submit Match Result"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
