import ScreenWrapper from "@/components/ScreenWrapper";
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

/* ================= SCREEN ================= */

export default function TournamentMatches() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const mutedIconColor = isDark ? "#9CA3AF" : "#475569";

  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<any[]>([]);

  /* ================= MOCK DATA (UNCHANGED) ================= */

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

  /* ================= LOAD MATCHES ================= */

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
    <ScreenWrapper>
      {/* ================= HEADER ================= */}
      <View className="flex-row items-center px-5 py-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color={mutedIconColor} />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-light-text dark:text-dark-text">
          Tournament Matches
        </Text>
      </View>

      {/* ================= CONTENT ================= */}
      <ScrollView
        className="flex-1 p-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {loading && (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color="#8AFF1A" />
          </View>
        )}

        {!loading && matches.length > 0 && (
          <View className="gap-3 mb-5">
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
                  className="flex-row rounded-xl bg-light-card dark:bg-dark-card
                             border border-light-border dark:border-dark-border
                             overflow-hidden"
                >
                  {/* ===== LEFT ===== */}
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
                      {team1Players.map((player: string, index: number) => (
                        <Text
                          key={index}
                          className="text-base text-light-text dark:text-dark-text ml-2"
                        >
                          • {player}
                        </Text>
                      ))}

                      <View className="h-3" />

                      <Text className="text-sm font-medium text-light-muted dark:text-dark-muted mb-1">
                        Team 2:
                      </Text>
                      {team2Players.map((player: string, index: number) => (
                        <Text
                          key={index}
                          className="text-base text-light-text dark:text-dark-text ml-2"
                        >
                          • {player}
                        </Text>
                      ))}
                    </View>

                    {/* ===== ACTION BUTTON ===== */}
                    <TouchableOpacity
                      onPress={() => {
                        if (match.status === "Completed") {
                          router.push(`/result/${match.id}`);
                        } else {
                          router.push(`/start_match/${match.id}`);
                        }
                      }}
                      className="bg-primary rounded-lg h-9 w-full items-center justify-center"
                    >
                      <Text className="text-black text-[15px] font-bold">
                        {match.status === "Live"
                          ? "Continue Match"
                          : match.status === "Upcoming"
                            ? "Start Match"
                            : "View Result"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* ===== RIGHT IMAGE ===== */}
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
          <View className="items-center justify-center py-16 px-4">
            <Ionicons
              name="tennisball-outline"
              size={48}
              color={mutedIconColor}
            />
            <Text className="text-lg font-semibold text-light-text dark:text-dark-text mt-3">
              No Matches Found
            </Text>
            <Text className="text-sm text-light-muted dark:text-dark-muted mt-1 text-center">
              Matches for this tournament will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}
