// app/(tabs)/index.tsx
// ホーム画面

import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,

  // 上2つはスワイプに必要なやつ
  Animated,
  PanResponder,

  // スワイプの横幅・縦幅を取る
  Dimensions,
} from "react-native";

type Word = {
  english: string;
  japanese: string;
  pos?: string;      // ← いったんオプションにしておく
  example?: string;  // ← まだ使わないのでオプション
};

// テストで使う単語リスト
const WORDS: Word[] = [
  { english: "apple", japanese: "りんご" },
  { english: "book", japanese: "本" },
  { english: "computer", japanese: "コンピュータ" },
  { english: "music", japanese: "音楽" },
];

// スワイプ距離の設定
const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 120;

export default function HomeScreen() {
  //どの画面化の状態
  const[screen, setScreen] = useState<"home" | "memory">("home");

  // どの単語を出題中か（0番目〜）
  const [index, setIndex] = useState(0);

  // 覚えた数（右スワイプされた回数）
  const [remembered, setRemembered] = useState(0);

  // 下のテキストとボタンのラベル（中身はあとで作るので仮）
  const [message, setMessage] = useState("ボタンを押してスタート");
  const [buttonLabel, setButtonLabel] = useState("テスト開始");

  //裏ture 表false
  //isBack true/falseを維持
  const[isBack, setIsBack] = useState(false);

  const position = useRef(new Animated.ValueXY()).current;

  //記憶モードの状態をリセット
  const resetMemory = () =>{
    //単語は0番目
    setIndex(0);
    //覚えた下図のリセット
    setRemembered(0);
    //表にリセット
    setIsBack(false);
    //アニメーションを即座に指定した値に戻す
    position.setValue({x:0, y:0});
  };


  // PanResponder タッチスワイプする機能
  const SWIPE_Proc = useRef(
    PanResponder.create({
      // 画面をタッチした瞬間に「このビューでスワイプを扱うよ」という設定
      onStartShouldSetPanResponder: () => true,

      // カードが指の動きに合わせてついていく仕組み
      onPanResponderMove: Animated.event(
        // 指の動きを position に入力
        [
          null,
          { dx: position.x, dy: position.y },
        ],
        { useNativeDriver: false }
      ),

      // 指が離れたときのイベント
      // gesture に指の動きの情報が入っている
      onPanResponderRelease: (_, gesture) => {
        // 横の移動距離が閾値以上ならスワイプ成功
        if (Math.abs(gesture.dx) > SWIPE_THRESHOLD) {
          // 正なら右　負なら左
          const toRight = gesture.dx > 0;

          if (toRight) {
            // 右は記憶、左は覚えていない
            setRemembered((r) => r + 1);
          }

          // 一定速度で、画面幅の外まで飛ばす
          Animated.timing(position, {
            toValue: {
              x: toRight ? SCREEN_WIDTH : -SCREEN_WIDTH,
              y: 0,
            },
            duration: 200,
            useNativeDriver: true, // ← スペル修正！
          }).start(() => {
            // 飛び切ったあとに位置をリセットして次のカードへ
            position.setValue({ x: 0, y: 0 });
            setIndex((i) => i + 1);
            //新しいカードは「表から」
            //constで定義した関数
            setIsBack(false);
          });
        } else {
          // スワイプ距離が足りなかったときは元の位置にバネで戻す
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // ホーム画面の作成
  if (screen === "home") {
    return (
      <View style={front.container}>
        <Text style={front.title}>単語APP</Text>
        <Text style={front.sectionText}>モードを選んで</Text>

        <View style={{ width: "100%", marginTop: 24 }} />

        {/* 記憶モード */}
        <TouchableOpacity
          style={front.messageBox}
          onPress={() => {
            resetMemory();
            setScreen("memory");
          }}
        >
          <Text style={front.title}>記憶モード</Text>
          <Text style={front.sectionText}>
            覚えた単語をスワイプで分けよう
          </Text>
        </TouchableOpacity>

        {/* テストモード */}
        <TouchableOpacity
          style={[front.messageBox, { opacity: 0.5, margin: 16 }]}
          // TouchableOpacity専用の見た目設定 押している間の透明度設定 1は変わらん
          activeOpacity={1}
        >
          <Text style={front.title}>テストモード(まだ準備)</Text>
          <Text style={front.sectionText}>4拓テストができる場所</Text>
        </TouchableOpacity>
      </View>
    );
  }

      
      //結果画面の作成
      if(index >= WORDS.length){
        return (
          <View style={front.container}>
            <Text style={front.title}>記憶モード　結果</Text>
            <Text style={front.sectionText}>
              覚えた単語:{remembered}/{WORDS.length}
            </Text>
            <Text style={front.sectionText}>おつかれさま！</Text>

            <TouchableOpacity
              style={[front.messageBox,{marginTop: 24}]}
              onPress={() => {
                resetMemory();
                setScreen("home");
              }}
            >
              <Text style = {front.messageBox}>
                ホーム画面に戻る
              </Text>
            </TouchableOpacity>
        </View>
      );
    }

 const current = WORDS[index];

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ["-15deg", "0deg", "15deg"]
  });

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate }
    ]
  };

  return (
    <View style={front.container}>
      <Text style={front.title}>スワイプで覚える単語帳</Text>

      <Animated.View
        style={[front.messageBox, cardStyle]}
        {...SWIPE_Proc.panHandlers}
      >
        <TouchableOpacity
        //ボタンを押すと薄くなる
          activeOpacity={0.8}
          //押されたときに反転させる　表裏
          onPress={() => setIsBack((prev) => !prev)}
          //コンポーネントのスタイル設定
          style={{ width: "100%", alignItems: "center" }}
        >
        
          {/* 表側：英単語 */}
          {!isBack && (
            <>
              <Text style={front.title}>{current.english}</Text>
              <Text style={front.sectionText}>タップで意味を表示</Text>
            </>
          )}

          {/* 裏側：日本語の意味 */}
          {isBack && (
            <>
              <Text style={front.title}>{current.japanese}</Text>
              <Text style={front.sectionText}>タップで英単語に戻る</Text>
            </>
          )}
          <Text style={front.sectionText}>
             {index + 1} / {WORDS.length}
          </Text>   
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const front = StyleSheet.create({
  // 画面全体
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  title: {
    fontSize: 26,
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
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333333",
    backgroundColor: "#1e1e1e",
    width: "90%",
    alignItems: "center",
  },
});
