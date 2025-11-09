import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Tournament = {
  id: string;
  name: string;
  dateRange: string;
  courtAssigned: string;
  matchCount: number;
  image: string;
  status: "assigned" | "upcoming" | "live";
};

// ===== Sample Data =====
const assignedData: Tournament[] = [
  {
    id: "1",
    name: "City Open 2024",
    dateRange: "Oct 26 - Oct 28, 2024",
    courtAssigned: "Courts 3–5",
    matchCount: 15,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCkZKAjkJsQ5390HonSOho1F4R5MBo98z88RtFq8j-itRNMTs9pcoMyGhmq6nDmG4k_qscIuqKDKuY6Ls4Ow-Le4KY2FnmGrhfRZcUHxi2gZ8GM7Qye-jZlIxL20R6dV9Jza_h89u7YdwrIUlK4yJ_c37CZ1cW31j3P9-EYzrdN7T74eCA8SctU0GjqD0avSjACdlVax1FzwJLQCbYkbnt6CMNTn_zJeW3DP5AimyEwhLzwNmOwWKb5_uV3BU3qQ9pMmDAJ44mSQXpR",
    status: "assigned",
  },
  {
    id: "2",
    name: "Summer Cup 2024",
    dateRange: "Aug 10 - Aug 12, 2024",
    courtAssigned: "Court 1",
    matchCount: 12,
    image: "https://picsum.photos/600/401",
    status: "assigned",
  },
  {
    id: "3",
    name: "Regional Knockout",
    dateRange: "Sep 05 - Sep 07, 2024",
    courtAssigned: "Courts 2–4",
    matchCount: 20,
    image: "https://picsum.photos/600/402",
    status: "assigned",
  },
];

const upcomingData: Tournament[] = [
  {
    id: "4",
    name: "Champions Trophy",
    dateRange: "Nov 15 - Nov 17, 2024",
    courtAssigned: "Unassigned",
    matchCount: 25,
    image: "https://picsum.photos/600/403",
    status: "upcoming",
  },
  {
    id: "5",
    name: "Winter Smash 2024",
    dateRange: "Dec 10 - Dec 12, 2024",
    courtAssigned: "Court 2",
    matchCount: 18,
    image: "https://picsum.photos/600/404",
    status: "upcoming",
  },
];

const liveData: Tournament[] = [
  {
    id: "6",
    name: "National Finals 2024",
    dateRange: "Dec 01 - Dec 03, 2024",
    courtAssigned: "Court 1",
    matchCount: 10,
    image: "https://picsum.photos/600/405",
    status: "live",
  },
  {
    id: "7",
    name: "Interstate Qualifiers",
    dateRange: "Dec 05 - Dec 07, 2024",
    courtAssigned: "Court 5",
    matchCount: 8,
    image: "https://picsum.photos/600/406",
    status: "live",
  },
];

// ===== Card Component =====
const TournamentCard = ({ item }: { item: Tournament }) => {
  const router = useRouter();
  return (
    <View
      className="mr-4 rounded-xl bg-white dark:bg-[#1A2233] border border-zinc-200 dark:border-gray-700 shadow-sm overflow-hidden"
      style={{ width: 280 }}
    >
      <Image
        source={{ uri: item.image }}
        style={{
          width: "100%",
          height: 130,
        }}
      />

      <View className="p-4 flex-1 justify-between">
        <View>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {item.dateRange}
          </Text>

          <Text className="text-base font-bold text-gray-900 dark:text-white mt-1">
            {item.name}
          </Text>

          <View className="mt-3">
            <View className="flex-row items-center gap-1.5 mb-1">
              <Ionicons name="tennisball-outline" size={16} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-300">
                Court Assigned: {item.courtAssigned}
              </Text>
            </View>

            <View className="flex-row items-center gap-1.5">
              <Ionicons name="trophy-outline" size={16} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-300">
                {item.matchCount} Matches
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          className="bg-primary px-4 py-2 rounded-lg mt-4 self-start"
          onPress={() => {
            router.push(`/home/${item.id}`);
          }}
        >
          <Text className="text-white text-sm font-medium">
            Open Tournament
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

// ===== Section Component =====
const TournamentSection = ({
  title,
  data,
}: {
  title: string;
  data: Tournament[];
}) => (
  <>
    <Text className="px-4 pt-6 pb-3 text-[22px] font-bold tracking-[-0.015em] text-zinc-900 dark:text-white ml-2">
      {title}
    </Text>

    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TournamentCard item={item} />}
      contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
    />
  </>
);

// ===== Main Home Screen =====
export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView
      edges={["top"]}
      className="flex-1 bg-background-light dark:bg-[#101622]"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-[32px] font-bold text-zinc-900 dark:text-white">
            Hi, Umpire 👋
          </Text>

          <View className="mt-2 flex-row items-center">
            <Ionicons name="location-sharp" size={18} color="#6b7280" />
            <Pressable className="flex-row items-center ml-1">
              <Text className="text-zinc-600 dark:text-zinc-400 mr-1">
                Hyderabad, India
              </Text>
              <Ionicons name="chevron-down" size={16} color="#6b7280" />
            </Pressable>
          </View>
        </View>

        {/* Tournament Sections */}
        <TournamentSection title="Ongoing" data={assignedData} />
        <TournamentSection title="Upcoming" data={upcomingData} />
        <TournamentSection title="Past" data={liveData} />
      </ScrollView>
    </SafeAreaView>
  );
}
