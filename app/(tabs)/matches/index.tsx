import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

export default function MatchesScreen() {
  const [activeTab, setActiveTab] = useState("Today");
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const tabs = ["Today", "Ongoing", "Upcoming", "Completed"];

  // ===== Mock Data =====
  const allMatches = [
    {
      id: 101,
      court: "Court 1",
      event: "Women's Doubles - QF",
      team1: "Chen Qing Chen & Jia Yi Fan",
      team2: "Nami Matsuyama & Chiharu Shida",
      category: "Today",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBOjG2Dm456BaRaJc8scsloNW00wkdFO2Jvy_AINM_72HZn_9Wlv-MoOCJEORtUB3UVhVbchhulhg-lvD-LYgOPjdY4ZVffK5TvQYkrdzgb9Wyk6cpLiH7K__jEYq4kL7Hw6X9G1uupJ6jJfjn-75ebGxHjvWq18P2tiFApyd4jLDnDYfrIT7zNXxkB6KmVxctsDKme8cAy3XYFH98L-IOZBv26EhnNn6X9Z3pM7CVMgmahHYkH_UnwHShonn1GmH5lpyyXN-hsVmdB",
    },
    {
      id: 102,
      court: "Court 2",
      event: "Men's Singles - SF",
      team1: "Viktor Axelsen",
      team2: "Kento Momota",
      category: "Ongoing",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBOjG2Dm456BaRaJc8scsloNW00wkdFO2Jvy_AINM_72HZn_9Wlv-MoOCJEORtUB3UVhVbchhulhg-lvD-LYgOPjdY4ZVffK5TvQYkrdzgb9Wyk6cpLiH7K__jEYq4kL7Hw6X9G1uupJ6jJfjn-75ebGxHjvWq18P2tiFApyd4jLDnDYfrIT7zNXxkB6KmVxctsDKme8cAy3XYFH98L-IOZBv26EhnNn6X9Z3pM7CVMgmahHYkH_UnwHShonn1GmH5lpyyXN-hsVmdB",
    },
    {
      id: 103,
      court: "Court 3",
      event: "Mixed Doubles - Final",
      team1: "Zheng Siwei & Huang Yaqiong",
      team2: "Dechapol Puavaranukroh & Sapsiree Taerattanachai",
      category: "Upcoming",
      image: "https://picsum.photos/id/1050/400/300",
    },
    {
      id: 104,
      court: "Court 4",
      event: "Men's Doubles - Final",
      team1: "Ahsan & Setiawan",
      team2: "Lee & Wang",
      category: "Completed",
      image: "https://picsum.photos/id/1025/400/300",
    },
    {
      id: 105,
      court: "Court 5",
      event: "Women's Singles - SF",
      team1: "Tai Tzu Ying",
      team2: "Carolina Marin",
      category: "Upcoming",
      image: "https://picsum.photos/id/1027/400/300",
    },
  ];

  // ===== Fetch matches by category =====
  const fetchMatches = async (status: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const filtered = allMatches.filter((m) => m.category === status);
    setMatches(filtered);
    setLoading(false);
  };

  useEffect(() => {
    fetchMatches(activeTab);
  }, [activeTab]);

  // ===== Handle Start Match (Move from Today → Ongoing) =====
  const handleStartMatch = (matchId: number) => {
    // Simulate backend update
    const updated = allMatches.map((m) =>
      m.id === matchId ? { ...m, category: "Ongoing" } : m
    );
    setMatches(updated.filter((m) => m.category === "Today"));
    router.push(`/start_match/${matchId}`);
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white dark:bg-[#101622]">
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
          Matches
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* ===== Tabs ===== */}
      <View className="flex-row border-b border-gray-200 dark:border-gray-700 px-4 justify-between">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`items-center justify-center border-b-[3px] ${
              activeTab === tab ? "border-b-blue-600" : "border-b-transparent"
            } pb-[13px] pt-4 mx-2`}
          >
            <Text
              className={`text-m font-semibold ${
                activeTab === tab
                  ? "text-gray-900 dark:text-blue-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ===== Main Content ===== */}
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
                    {activeTab === "Today" && (
                      <TouchableOpacity
                        onPress={() => handleStartMatch(match.id)}
                        className="bg-blue-600 rounded-lg h-9 w-full items-center justify-center"
                      >
                        <Text className="text-white text-[15px] font-semibold">
                          Start Match
                        </Text>
                      </TouchableOpacity>
                    )}

                    {activeTab === "Ongoing" && (
                      <TouchableOpacity
                        onPress={() => router.push(`/start_match/${match.id}`)}
                        className="bg-yellow-500 rounded-lg h-9 w-full items-center justify-center"
                      >
                        <Text className="text-white text-[15px] font-semibold">
                          Continue Match
                        </Text>
                      </TouchableOpacity>
                    )}

                    {activeTab === "Upcoming" && (
                      <View className="bg-gray-300 dark:bg-gray-700 rounded-lg h-9 w-full items-center justify-center">
                        <Text className="text-white text-[15px] font-semibold">
                          Not Started Yet
                        </Text>
                      </View>
                    )}

                    {activeTab === "Completed" && (
                      <TouchableOpacity
                        onPress={() => router.push(`/result/${match.id}`)}
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
              No {activeTab} Matches
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
              When {activeTab.toLowerCase()} matches are available, they’ll
              appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
