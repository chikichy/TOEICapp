// 記憶モード画面
import React, { useEffect, useState } from "react";

// AIで単語を呼び出す機能
import { fetchWordsAI } from "../api/ai";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
      <View style={front.container}>
        <Text style={front.title}>記憶モード</Text>
        <Text style={front.subtitle}>単語を読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={front.container}>
      <Text style={front.title}>記憶モード</Text>
      <Text style={front.subtitle}>カードをタップして,ほにゃほにゃ</Text>

      {/* 単語カード */}
      <TouchableOpacity style={front.card} onPress={TapDetail}>
        {!showPage ? (
          // 表：英単語のみ
          <View style={front.cardLine}>
            <Text style={front.nameLabel}>英単語</Text>
            {/* データが入ってなかったときの保険として ?. を使用 */}
            <Text style={front.englishExam}>{currentWord.english}</Text>
            <Text style={front.mean}>押したら意味を表示</Text>
          </View>
        ) : (
          // 裏：意味・品詞・例文
          <View style={front.cardLine}>
            <Text style={front.IMI}>意味</Text>
            <Text style={front.meanText}>
              {currentWord.japanese} ({currentWord.pos})
            </Text>

            <View style={front.exaBox}>
              <Text style={front.exaLabel}>使い方</Text>
              <Text style={front.exaText}>{currentWord.example}</Text>
            </View>

            <Text style={front.hint}>もう一度タップで英単語</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* 次の単語へボタン */}
      <TouchableOpacity style={front.nextButton} onPress={TapNextWord}>
        <Text style={front.nextButtonText}>次の単語</Text>
      </TouchableOpacity>
    </View>
  );
}

const front = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center", // 横方向
    justifyContent: "center", // 縦方向
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    color: "#ffffff",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#dddddd",
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    marginBottom: 16,
  },
  cardLine: {
    width: "100%",
    minHeight: 220,
    borderRadius: 16,
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "#333333",
    padding: 20,
    justifyContent: "center",
  },
  nameLabel: {
    fontSize: 14,
    color: "#aaaaaa",
    marginBottom: 8,
  },
  englishExam: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  mean: {
    fontSize: 14,
    color: "#cccccc",
  },
  IMI: {
    fontSize: 14,
    color: "#aaaaaa",
    marginBottom: 8,
  },
  meanText: {
    fontSize: 22,
    color: "#ffffff",
    marginBottom: 16,
  },
  exaBox: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#252525",
    marginBottom: 12,
  },
  exaLabel: {
    fontSize: 13,
    color: "#aaaaaa",
    marginBottom: 4,
  },
  exaText: {
    fontSize: 14,
    color: "#ffffff",
  },
  hint: {
    fontSize: 12,
    color: "#888888",
    marginTop: 8,
  },
  nextButton: {
    width: "100%",
    maxWidth: 360,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#121212",
  },
});
