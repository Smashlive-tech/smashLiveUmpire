import ScreenWrapper from "@/components/ScreenWrapper";
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

export default function MatchesScreen() {
  const [activeTab, setActiveTab] = useState("Today");
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const isDark = useColorScheme() === "dark";
  const router = useRouter();

  const tabs = ["Today", "Ongoing", "Upcoming", "Completed"];

  /* ================= MOCK DATA (UNCHANGED) ================= */
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

  /* ================= FETCH (UNCHANGED) ================= */
  const fetchMatches = async (status: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setMatches(allMatches.filter((m) => m.category === status));
    setLoading(false);
  };

  useEffect(() => {
    fetchMatches(activeTab);
  }, [activeTab]);

  const handleStartMatch = (matchId: number) => {
    router.push(`/start_match/${matchId}`);
  };

  const mutedIconColor = isDark ? "#9CA3AF" : "#475569";

  return (
    <ScreenWrapper>
      {/* ================= HEADER ================= */}
      <View className="flex-row items-center px-5 py-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color={mutedIconColor} />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-light-text dark:text-dark-text">
          Matches
        </Text>
      </View>

      {/* ================= TABS ================= */}
      <View className="flex-row px-4 justify-between border-b border-light-border dark:border-dark-border">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`pb-3 pt-4 mx-2 border-b-[3px] ${
              activeTab === tab ? "border-primary" : "border-transparent"
            }`}
          >
            <Text
              className={`text-m font-semibold ${
                activeTab === tab
                  ? "text-light-text dark:text-primary"
                  : "text-light-muted dark:text-dark-muted"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ================= CONTENT ================= */}
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {loading && (
          <View className="items-center py-20">
            <ActivityIndicator size="large" color="#8AFF1A" />
          </View>
        )}

        {!loading && matches.length > 0 && (
          <View className="gap-2 mb-5">
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
                  className="flex-row rounded-xl overflow-hidden bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border"
                >
                  <View className="flex-1 p-4">
                    <Text className="text-sm text-light-muted dark:text-dark-muted mb-1">
                      Match #{match.id} • {match.court}
                    </Text>

                    <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-3">
                      {match.event}
                    </Text>

                    <View className="mb-4">
                      <Text className="text-sm font-medium text-light-muted dark:text-dark-muted mb-1">
                        Team 1:
                      </Text>
                      {team1Players.map((p: string, i: number) => (
                        <Text
                          key={i}
                          className="text-base text-light-text dark:text-dark-text ml-2"
                        >
                          • {p}
                        </Text>
                      ))}

                      <View className="h-3" />

                      <Text className="text-sm font-medium text-light-muted dark:text-dark-muted mb-1">
                        Team 2:
                      </Text>
                      {team2Players.map((p: string, i: number) => (
                        <Text
                          key={i}
                          className="text-base text-light-text dark:text-dark-text ml-2"
                        >
                          • {p}
                        </Text>
                      ))}
                    </View>

                    {activeTab === "Today" && (
                      <TouchableOpacity
                        onPress={() => handleStartMatch(match.id)}
                        className="bg-primary rounded-lg h-9 items-center justify-center"
                      >
                        <Text className="text-black font-semibold text-[15px]">
                          Start Match
                        </Text>
                      </TouchableOpacity>
                    )}

                    {activeTab === "Ongoing" && (
                      <TouchableOpacity
                        onPress={() => router.push(`/start_match/${match.id}`)}
                        className="bg-primary rounded-lg h-9 items-center justify-center"
                      >
                        <Text className="text-black font-semibold text-[15px]">
                          Continue Match
                        </Text>
                      </TouchableOpacity>
                    )}

                    {activeTab === "Upcoming" && (
                      <View className="bg-light-border dark:bg-dark-border rounded-lg h-9 items-center justify-center">
                        <Text className="text-light-muted dark:text-dark-muted font-semibold text-[15px]">
                          Not Started Yet
                        </Text>
                      </View>
                    )}

                    {activeTab === "Completed" && (
                      <TouchableOpacity
                        onPress={() => router.push(`/result/${match.id}`)}
                        className="bg-primary rounded-lg h-9 items-center justify-center"
                      >
                        <Text className="text-black font-semibold text-[15px]">
                          View Result
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <Image
                    source={{ uri: match.image }}
                    className="w-[45%] h-full"
                    resizeMode="cover"
                  />
                </View>
              );
            })}
          </View>
        )}

        {!loading && matches.length === 0 && (
          <View className="items-center py-16 px-4">
            <Ionicons
              name="tennisball-outline"
              size={48}
              color={mutedIconColor}
            />
            <Text className="text-lg font-semibold text-light-text dark:text-dark-text mt-3">
              No {activeTab} Matches
            </Text>
            <Text className="text-sm text-light-muted dark:text-dark-muted mt-1 text-center">
              When matches are available, they’ll appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
