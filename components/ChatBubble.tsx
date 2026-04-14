import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import Markdown from "react-native-markdown-display";

type Props = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatBubble({ role, content }: Props) {
  const isDark = useColorScheme() === "dark";
  const isUser = role === "user";

  const textColor = isUser ? "#FFFFFF" : isDark ? "#E8E8F0" : "#1A1A2E";
  const codeBackground = isUser ? "rgba(255,255,255,0.15)" : isDark ? "#0F0F13" : "#F0EFFE";

  const markdownStyles = {
    body: {
      color: textColor,
      fontSize: 15,
      lineHeight: 22,
    },
    strong: {
      fontWeight: "700" as const,
      color: textColor,
    },
    em: {
      fontStyle: "italic" as const,
      color: textColor,
    },
    bullet_list: {
      marginVertical: 4,
    },
    ordered_list: {
      marginVertical: 4,
    },
    list_item: {
      color: textColor,
      fontSize: 15,
      lineHeight: 22,
      flexDirection: "row" as const,
    },
    bullet_list_icon: {
      color: textColor,
      fontSize: 15,
      lineHeight: 22,
      marginRight: 6,
    },
    code_inline: {
      backgroundColor: codeBackground,
      color: isUser ? "#FFFFFF" : "#6C63FF",
      borderRadius: 4,
      paddingHorizontal: 4,
      fontFamily: "monospace",
      fontSize: 13,
    },
    fence: {
      backgroundColor: codeBackground,
      borderRadius: 8,
      padding: 10,
      marginVertical: 6,
    },
    code_block: {
      backgroundColor: codeBackground,
      borderRadius: 8,
      padding: 10,
      marginVertical: 6,
      color: textColor,
      fontFamily: "monospace",
      fontSize: 13,
    },
    paragraph: {
      marginTop: 0,
      marginBottom: 4,
      color: textColor,
      fontSize: 15,
      lineHeight: 22,
    },
    heading1: { color: textColor, fontWeight: "700" as const, fontSize: 18, marginBottom: 4 },
    heading2: { color: textColor, fontWeight: "700" as const, fontSize: 16, marginBottom: 4 },
    heading3: { color: textColor, fontWeight: "600" as const, fontSize: 15, marginBottom: 4 },
  };

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>CB</Text>
        </View>
      )}
      <View
        style={[
          styles.bubble,
          isUser
            ? styles.bubbleUser
            : isDark
              ? styles.bubbleAssistantDark
              : styles.bubbleAssistantLight,
        ]}
      >
        {isUser ? (
          <Text style={styles.textUser}>{content}</Text>
        ) : (
          <Markdown style={markdownStyles}>{content}</Markdown>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  rowUser: {
    justifyContent: "flex-end",
  },
  rowAssistant: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 2,
    flexShrink: 0,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleUser: {
    backgroundColor: "#6C63FF",
    borderBottomRightRadius: 4,
  },
  bubbleAssistantLight: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleAssistantDark: {
    backgroundColor: "#1E1E2A",
    borderBottomLeftRadius: 4,
  },
  textUser: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
  },
});
