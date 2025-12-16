// app/(tabs)/index.tsx
// ホーム画面：モード選択メニュー

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

const HomeScreen: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* アプリ名 */}
        <Text style={styles.title}>TOEIC 単語トレーナー</Text>
        <Text style={styles.subtitle}>
          記憶モードでじっくり暗記して、テストモードで力試し！
        </Text>

        {/* モード選択ボタンたち */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.modeButton}
            activeOpacity={0.8}
            onPress={() => router.push("/memory")}
          >
            <Text style={styles.modeTitle}>記憶モード</Text>
            <Text style={styles.modeDescription}>
              スワイプでサクサク暗記。カード式で意味と例文を確認。
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modeButton}
            activeOpacity={0.8}
            onPress={() => router.push("/test")}
          >
            <Text style={styles.modeTitle}>テストモード</Text>
            <Text style={styles.modeDescription}>
              4択クイズで実力チェック。AIが選んだ単語で問題を出題。
            </Text>
          </TouchableOpacity>
        </View>

        {/* 将来ここに「今日の成績」などを載せてもよさそう */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            まずはどちらかのモードを選んでスタートしてみよう！
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  buttonGroup: {
    gap: 16 as any,
  },
  modeButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: "#555",
  },
  footer: {
    marginTop: 32,
  },
  footerText: {
    fontSize: 13,
    color: "#777",
  },
});
