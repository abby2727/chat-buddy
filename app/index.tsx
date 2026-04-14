import ChatBubble from "@/components/ChatBubble";
import axios from "axios";
import { Stack } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Replace with your machine's local IP when testing on a physical device
// e.g. "http://192.168.1.x:3000/chat"
// const API_URL = "http://localhost:3000/chat";
const API_URL = "http://192.168.0.110:3000/chat";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatScreen() {
  const isDark = useColorScheme() === "dark";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  const colors = isDark ? darkColors : lightColors;

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const updated = [...messages, userMessage];

    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post<{ reply: string }>(API_URL, {
        messages: updated,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect to the server. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function scrollToBottom() {
    if (messages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          title: "ChatBuddy",
          headerRight: () => <View style={[styles.onlineDot, { backgroundColor: "#22C55E" }]} />,
        }}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: isDark ? "#1E1E2A" : "#EDEDF8" }]}>
              <Text style={styles.emptyIconText}>💬</Text>
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Ask me anything</Text>
            <Text style={[styles.emptySubtitle, { color: colors.subtle }]}>
              I'm ChatBuddy, your AI study assistant.{"\n"}Start a conversation below!
            </Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => <ChatBubble role={item.role} content={item.content} />}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
            showsVerticalScrollIndicator={false}
          />
        )}

        {loading && (
          <View style={[styles.typingRow, { backgroundColor: colors.background }]}>
            <View
              style={[styles.typingBubble, { backgroundColor: isDark ? "#1E1E2A" : "#FFFFFF" }]}
            >
              <ActivityIndicator size="small" color="#6C63FF" />
              <Text style={[styles.typingText, { color: colors.subtle }]}>
                ChatBuddy is typing…
              </Text>
            </View>
          </View>
        )}

        <View
          style={[
            styles.inputBar,
            { backgroundColor: colors.inputBar, borderTopColor: colors.border },
          ]}
        >
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            placeholder="Message ChatBuddy…"
            placeholderTextColor={colors.placeholder}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            multiline
            maxLength={1000}
          />
          <Pressable
            onPress={sendMessage}
            disabled={!input.trim() || loading}
            style={({ pressed }) => [
              styles.sendButton,
              {
                backgroundColor: !input.trim() || loading ? colors.sendDisabled : "#6C63FF",
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const lightColors = {
  background: "#F4F4F8",
  text: "#1A1A2E",
  subtle: "#6B7280",
  inputBar: "#F4F4F8",
  inputBg: "#FFFFFF",
  placeholder: "#9CA3AF",
  border: "#E5E7EB",
  sendDisabled: "#D1D5DB",
};

const darkColors = {
  background: "#0F0F13",
  text: "#E8E8F0",
  subtle: "#9CA3AF",
  inputBar: "#0F0F13",
  inputBg: "#1E1E2A",
  placeholder: "#6B7280",
  border: "#2A2A3A",
  sendDisabled: "#2A2A3A",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  emptyIconText: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  typingRow: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    gap: 8,
  },
  typingText: {
    fontSize: 13,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  input: {
    flex: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    lineHeight: 22,
    maxHeight: 120,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 20,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
});
