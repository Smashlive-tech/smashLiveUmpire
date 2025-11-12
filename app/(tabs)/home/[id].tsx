import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TournamentMatches() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<any[]>([]);

  // ===== Mock Data =====
  const allMatches = [
    {
      id: 1,
      tournamentId: "1",
      court: "Court 1",
      event: "Men's Singles",
      team1: "Viktor Axelsen",
      team2: "Kento Momota",
      status: "Live",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBOjG2Dm456BaRaJc8scsloNW00wkdFO2Jvy_AINM_72HZn_9Wlv-MoOCJEORtUB3UVhVbchhulhg-lvD-LYgOPjdY4ZVffK5TvQYkrdzgb9Wyk6cpLiH7K__jEYq4kL7Hw6X9G1uupJ6jJfjn-75ebGxHjvWq18P2tiFApyd4jLDnDYfrIT7zNXxkB6KmVxctsDKme8cAy3XYFH98L-IOZBv26EhnNn6X9Z3pM7CVMgmahHYkH_UnwHShonn1GmH5lpyyXN-hsVmdB",
    },
    {
      id: 2,
      tournamentId: "1",
      court: "Court 2",
      event: "Women's Doubles",
      team1: "Chen Qing Chen & Jia Yi Fan",
      team2: "Nami Matsuyama & Chiharu Shida",
      status: "Completed",
      image: "https://picsum.photos/id/1033/400/300",
    },
    {
      id: 3,
      tournamentId: "1",
      court: "Court 3",
      event: "Mixed Doubles",
      team1: "Zheng Siwei & Huang Yaqiong",
      team2: "Dechapol Puavaranukroh & Sapsiree Taerattanachai",
      status: "Upcoming",
      image: "https://picsum.photos/id/1050/400/300",
    },
    {
      id: 4,
      tournamentId: "2",
      court: "Court 1",
      event: "Men's Doubles",
      team1: "Ahsan & Setiawan",
      team2: "Lee & Wang",
      status: "Upcoming",
      image: "https://picsum.photos/id/1025/400/300",
    },
  ];

  // ===== Load matches for selected tournament =====
  useEffect(() => {
    setLoading(true);
    setMatches([]);
    setTimeout(() => {
      const filtered = allMatches.filter((m) => m.tournamentId === id);
      setMatches(filtered);
      setLoading(false);
    }, 400);
  }, [id]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#101622]">
      {/* ===== Header ===== */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={22}
            color={isDark ? "#f9fafb" : "#111827"}
          />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Tournament Matches
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* ===== Content ===== */}
      <ScrollView
        className="flex-1 space-y-4 p-4"
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        )}

        {!loading && matches.length > 0 && (
          <View className="flex-1 gap-2 mb-5">
            {matches.map((match) => {
              const team1Players = match.team1
                .split("&")
                .map((p: string) => p.trim());
              const team2Players = match.team2
                .split("&")
                .map((p: string) => p.trim());

              return (
                <View
                  key={match.id}
                  className="flex-row justify-between items-stretch rounded-xl bg-white dark:bg-[#1A2233] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
                >
                  {/* ===== Left Side: Match Info ===== */}
                  <View className="flex-1 p-4">
                    <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Match #{match.id} • {match.court}
                    </Text>

                    <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      {match.event}
                    </Text>

                    <View className="mb-4">
                      <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Team 1:
                      </Text>
                      {team1Players.map((player: string, index: number) => (
                        <Text
                          key={index}
                          className="text-base text-gray-700 dark:text-gray-300 ml-2"
                        >
                          • {player}
                        </Text>
                      ))}

                      <View className="h-3" />

                      <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Team 2:
                      </Text>
                      {team2Players.map((player: string, index: number) => (
                        <Text
                          key={index}
                          className="text-base text-gray-700 dark:text-gray-300 ml-2"
                        >
                          • {player}
                        </Text>
                      ))}
                    </View>

                    {/* ===== Button Logic ===== */}
                    {match.status === "Live" && (
                      <TouchableOpacity
                        onPress={() => router.push(`/start_match/${match.id}`)}
                        className="bg-yellow-500 rounded-lg h-9 w-full items-center justify-center"
                      >
                        <Text className="text-white text-[15px] font-semibold">
                          Continue Match
                        </Text>
                      </TouchableOpacity>
                    )}

                    {match.status === "Upcoming" && (
                      <TouchableOpacity
                        onPress={() => router.push(`/start_match/${match.id}`)}
                        className="bg-blue-600 rounded-lg h-9 w-full items-center justify-center"
                      >
                        <Text className="text-white text-[15px] font-semibold">
                          Start Match
                        </Text>
                      </TouchableOpacity>
                    )}

                    {match.status === "Completed" && (
                      <TouchableOpacity
                        onPress={() => router.push("/result/[id]")}
                        className="bg-green-600 rounded-lg h-9 w-full items-center justify-center"
                      >
                        <Text className="text-white text-[15px] font-semibold">
                          View Result
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* ===== Right Side: Full Height Image ===== */}
                  <Image
                    source={{ uri: match.image }}
                    className="w-[45%] h-full"
                    style={{
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12,
                    }}
                    resizeMode="cover"
                  />
                </View>
              );
            })}
          </View>
        )}

        {!loading && matches.length === 0 && (
          <View className="flex flex-col items-center justify-center py-16 px-4">
            <Ionicons
              name="tennisball-outline"
              size={48}
              color={isDark ? "#9ca3af" : "#6b7280"}
            />
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-3">
              No Matches Found
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
              Matches for this tournament will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
