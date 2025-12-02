// app/(tabs)/index.tsx
//ホーム画面

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// ★ テストで使う単語リスト（あとで増やしてOK）
const WORDS = [
  { english: "apple", japanese: "りんご" },
  { english: "book", japanese: "本" },
  { english: "computer", japanese: "コンピュータ" },
  { english: "music", japanese: "音楽" },
];

export default function HomeScreen() {
  // どの単語を出題中か（0番目〜）
  const [index, setIndex] = useState(0);
  // 今の状態：ready / question / answer
  const [mode, setMode] = useState<"ready" | "question" | "answer">("ready");

  const currentWord = WORDS[index];

  // ボタンが押されたときの処理
  const handlePress = () => {
    if (mode === "ready") {
      // テスト開始 → 1問目の「問題」を表示
      setMode("question");
    } else if (mode === "question") {
      // 「答えを見る」
      setMode("answer");
    } else {
      // 次の問題へ
      const nextIndex = (index + 1) % WORDS.length;
      setIndex(nextIndex);
      setMode("question");
    }
  };

  // 状態に応じて表示するメッセージを切り替え
  let message = "ボタンを押してテストを始めよう！";
  if (mode === "question") {
    message = `${currentWord.english} の意味は？`;
  } else if (mode === "answer") {
    message = `${currentWord.english}：${currentWord.japanese}`;
  }

  // ボタンに表示するテキストも切り替え
  let buttonLabel = "テストをはじめる";
  if (mode === "question") {
    buttonLabel = "答えを見る";
  } else if (mode === "answer") {
    buttonLabel = "次の問題";
  }

  return (
    <View style={styles.container}>
      {/* 上のエリア：タイトル＋説明 */}
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>片手でできる単語テスト</Text>
          <Text style={styles.subtitle}>
            親指だけでサクサク解ける、スマホ専用の英単語アプリ。
          </Text>
        </View>

        {/* 今日やること */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>今日やること</Text>
          <Text style={styles.sectionText}>・単語リストから問題を出す</Text>
          <Text style={styles.sectionText}>・答えを見る → 次の問題の流れを作る</Text>
        </View>

        {/* 単語メッセージ表示エリア */}
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </View>

      {/* 下：親指で押しやすいボタン */}
      <TouchableOpacity style={styles.mainButton} onPress={handlePress}>
        <Text style={styles.mainButtonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // 画面全体
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    justifyContent: "space-between", // 上のエリアとボタンを上下に分ける
  },

  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#cccccc",
    lineHeight: 22,
  },

  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: "#dddddd",
    marginBottom: 4,
  },

  messageBox: {
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#1e1e1e",
  },
  messageText: {
    fontSize: 15,
    color: "#ffffff",
    lineHeight: 22,
  },

  mainButton: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#121212",
  },
});
