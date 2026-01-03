import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  LayoutAnimation,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  useColorScheme,
} from "react-native";

// Enable animation for Android expand/collapse (UNCHANGED)
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HelpSupportScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "How do I start a match?",
      answer:
        "Once you are assigned to a tournament, go to the 'Matches' section. Select the match you are officiating and tap the 'Start Match' button to begin scoring.",
    },
    {
      id: 2,
      question: "How do I update scores during a match?",
      answer:
        "On the scoring screen, you can use the + and - buttons beside each player or team to adjust the score. You can also use 'Undo' or 'Redo' for corrections during live scoring.",
    },
    {
      id: 3,
      question: "Can I pause or resume a live match?",
      answer:
        "Yes. Use the 'Pause' button on the scoring screen if the game is interrupted. When ready, simply tap 'Resume' to continue from the same score state.",
    },
    {
      id: 4,
      question: "How do I submit the final match result?",
      answer:
        "After the match concludes, tap 'Submit Result' on the scoring screen. Confirm the final scores and the winner before submission. Once confirmed, the match will be marked as 'Completed'.",
    },
    {
      id: 5,
      question: "What if I notice incorrect player data or court assignment?",
      answer:
        "If you find incorrect details such as player names or court assignments, please report it using the 'Report Issue' button available on the match page or contact support directly.",
    },
  ];

  const handleToggle = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenFAQ(openFAQ === id ? null : id);
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
          Help & Support
        </Text>
      </View>

      {/* ================= CONTENT ================= */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* ================= FAQ ================= */}
        <View className="mb-8 mt-4">
          <Text className="text-xl font-bold text-light-text dark:text-dark-text mb-4">
            Frequently Asked Questions
          </Text>

          <View className="bg-light-card dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border">
            {faqs.map((faq) => (
              <View
                key={faq.id}
                className="border-b border-light-border dark:border-dark-border"
              >
                <TouchableOpacity
                  onPress={() => handleToggle(faq.id)}
                  activeOpacity={0.8}
                  className="flex-row justify-between items-center px-5 py-4"
                >
                  <Text className="text-base font-medium text-light-text dark:text-dark-text flex-1 pr-4">
                    {faq.question}
                  </Text>
                  <MaterialIcons
                    name={openFAQ === faq.id ? "expand-less" : "expand-more"}
                    size={26}
                    color={mutedIconColor}
                  />
                </TouchableOpacity>

                {openFAQ === faq.id && (
                  <View className="px-5 pb-4">
                    <Text className="text-base text-light-muted dark:text-dark-muted leading-relaxed">
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* ================= CONTACT SUPPORT ================= */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-light-text dark:text-dark-text mb-4">
            Contact Support
          </Text>

          <View className="bg-light-card dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border">
            {/* Email */}
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("mailto:umpire-support@smashlive.com")
              }
              className="flex-row items-center justify-between px-5 py-5 border-b border-light-border dark:border-dark-border"
              activeOpacity={0.85}
            >
              <View className="flex-row items-center gap-4">
                <View className="size-11 rounded-full bg-primary/20 items-center justify-center">
                  <MaterialIcons name="mail" size={24} color="#8AFF1A" />
                </View>
                <Text className="text-base font-medium text-light-text dark:text-dark-text">
                  Email Support
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={26}
                color={mutedIconColor}
              />
            </TouchableOpacity>

            {/* Live Chat */}
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Live Chat",
                  "Connecting you with SmashLive Umpire Support..."
                )
              }
              className="flex-row items-center justify-between px-5 py-5"
              activeOpacity={0.85}
            >
              <View className="flex-row items-center gap-4">
                <View className="size-11 rounded-full bg-primary/20 items-center justify-center">
                  <MaterialIcons name="chat-bubble" size={22} color="#8AFF1A" />
                </View>
                <Text className="text-base font-medium text-light-text dark:text-dark-text">
                  Live Chat
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={26}
                color={mutedIconColor}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
