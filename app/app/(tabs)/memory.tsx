// 記憶モード画面
import React, { useEffect, useState } from "react";

// AIで単語を呼び出す機能
import { fetchWordsAI } from "../api/ai";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

type Word = {
  english: string;
  japanese: string;
  pos: string;
  example: string;
};

// 初期表示用のダミーデータ（AI結果が来る前に使う）
const WORDS: Word[] = [
  {
    english: "apple",
    japanese: "リンゴ",
    pos: "名詞",
    example: "I eat an apple every morning.",
  },
  {
    english: "run",
    japanese: "走る",
    pos: "動詞",
    example: "I run in the park every evening.",
  },
];

export default function MemoryGAMEN() {
  // 単語リストの状態（最初はダミーの WORDS）
  const [words, setWords] = useState<Word[]>(WORDS);

  // 何番目の単語を表示しているか（インデックス）
  const [wordIndex, setWordIndex] = useState(0);

  // カードの表裏（false:表, true:裏）
  const [showPage, setShowPage] = useState(false);

  // 今表示している単語オブジェクト
  const currentWord = words[wordIndex];

  // 画面表示時に一度だけ AI から単語を取得
  useEffect(() => {
    const loadFromAI = async () => {
      try {
        const result = await fetchWordsAI();
        console.log("AIから取得:", result);
        setWords(result);
        setWordIndex(0);
        setShowPage(false);
      } catch (e) {
        console.error("AI取得失敗", e);
      }
    };

    loadFromAI();
  }, []);

  // カードをタップしたとき（表⇔裏を切り替え）
  const TapDetail = () => {
    setShowPage((prev) => !prev);
  };

  // 次の単語へ
  const TapNextWord = () => {
    if (words.length === 0) return;
    const nextIndex = (wordIndex + 1) % words.length;
    setWordIndex(nextIndex);
    setShowPage(false);
  };

  // currentWord がまだ決まってないときの保険
  if (!currentWord) {
    return (
      <SafeAreaView style={front.safe}>
        <View style={front.container}>
          <Text style={front.title}>記憶モード</Text>
          <Text style={front.subtitle}>単語を読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={front.safe}>
      <View style={front.container}>
        <Text style={front.title}>記憶モード</Text>
        <Text style={front.subtitle}>カードをタップして表⇄裏を切り替え</Text>

        {/* 進捗（Testっぽく） */}
        <Text style={front.progress}>
          {wordIndex + 1} / {words.length}
        </Text>

        {/* 単語カード */}
        <TouchableOpacity style={front.card} onPress={TapDetail} activeOpacity={0.8}>
          {!showPage ? (
            // 表：英単語のみ
            <View style={front.cardLine}>
              <Text style={front.label}>英単語</Text>
              <Text style={front.bigWord}>{currentWord.english}</Text>
              <Text style={front.hint}>タップで意味を表示</Text>
            </View>
          ) : (
            // 裏：意味・品詞・例文
            <View style={front.cardLine}>
              <Text style={front.label}>意味</Text>
              <Text style={front.meanText}>
                {currentWord.japanese}（{currentWord.pos}）
              </Text>

              <View style={front.exaBox}>
                <Text style={front.exaLabel}>使い方</Text>
                <Text style={front.exaText}>{currentWord.example}</Text>
              </View>

              <Text style={front.hint}>もう一度タップで英単語</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* 次の単語へボタン（Testと同じ緑） */}
        <TouchableOpacity style={front.nextButton} onPress={TapNextWord} activeOpacity={0.8}>
          <Text style={front.nextButtonText}>次の単語</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const front = StyleSheet.create({
  // Testと同じ背景
  safe: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
  },

  // Test寄せの見出し
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
  },
  progress: {
    fontSize: 14,
    marginBottom: 16,
  },

  card: {
    width: "100%",
    marginBottom: 16,
  },

  // TestのquestionBox/白カード寄せ
  cardLine: {
    width: "100%",
    minHeight: 220,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    justifyContent: "center",

    // 影（Testと同様）
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },

  bigWord: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
  },

  meanText: {
    fontSize: 22,
    marginBottom: 12,
  },

  exaBox: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f3f3f3",
    marginBottom: 12,
  },
  exaLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  exaText: {
    fontSize: 14,
    color: "#222",
  },

  hint: {
    fontSize: 12,
    color: "#777",
    marginTop: 8,
  },

  // Testと同じ緑ボタン
  nextButton: {
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#4caf50",
    alignItems: "center",
    marginTop: 4,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
