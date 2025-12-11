//記憶モード画面
import React, { useState,useEffect } from "react";

//aiで単語を呼び出す機能import
import { fetchWordsAI } from "../api/ai";


import{ 
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

//WORDSはWord型の内容が入った配列
const WORDS: Word[] = [
    {
        english: "apple",
        japanese: "リンゴ",
        pos: "名刺",
        example: "I eat an apple every morning.",
    },
    {
        english: "run",
        japanese: "走る",
        pos: "動詞",
        example: "うぇいうぇいえうぃ",
    },
];

//example defalut functionは；いらない
export default function MemoryGAMEN(){
  //AIテスト
  const testAI = async () => {
    const result = await fetchWordsAI();
    console.log("AIから帰ってきた単語リスト",result);
  };

  //単語リストの状態
  const[words, setWords] = useState<Word[]>(WORDS);
  //どの単語を表示しているか
  const[word, updateWord] = useState(0);
  //カードの表裏
  //false:表　英単語のみ, true:裏 意味などを表示
  const[showPage, setShowPage]= useState(false);

  const currentWords = WORDS[word];
    
  //カードをタップしたとき
  //前の値をひっくり返す
  //setShowPage ページを表示する関数
  const TapDatail = () => {
    const nextWord = (word+1) % words.length;
    updateWord(nextWord);
    setShowPage((prev) => !prev);
  };

    //次の単語
    const TapNextWord = () => {
        const nextWord = (word+1) % words.length;
        updateWord(nextWord);
        setShowPage(false); //ページを表で表示
    };


    return (
    <View style={front.container}>
      <Text style={front.title}>記憶モード</Text>
      <Text style={front.subtitle}>カードをタップして,ほにゃほにゃ</Text>

      {/* 単語カード */}
      <TouchableOpacity style={front.card} onPress={TapNextWord}>
        {!showPage ? (
          // 表：英単語のみ
          <View style={front.cardLine}>
            <Text style={front.nameLabel}>英単語</Text>
            {/*?データが入ってなかったときの保険*/}
            <Text style={front.englishExam}>{currentWord?.english}</Text>
            <Text style={front.mean}>押したら意味を表示</Text>
          </View>
        ) : (
          // 裏：意味・品詞・例文
          <View style={front.cardLine}>
            <Text style={front.IMI}>意味</Text>
            <Text style={front.meanText}>
              {currentWord?.japanese} ({currentWord?.pos})
            </Text>

            <View style={front.exaBox}>
              <Text style={front.exaLabel}>使い方</Text>
              <Text style={front.exaText}>{currentWord?.example}</Text>
            </View>

            <Text style={front.hint}>もう一度タップで英単語</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* 次の単語へボタン */}
      <TouchableOpacity style={front.nextButton} onPress={TapNextWord}>
        <Text style={front.nextButtonText}>次の単語</Text>
      </TouchableOpacity>

      {/* AIテストボタン */}
      <TouchableOpacity
        style={[front.nextButton, { marginTop: 12, backgroundColor: "#4caf50" }]}
        onPress={testAI}
      >
        <Text style={front.nextButtonText}>AIテスト</Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(()=>{
    const loadFromAI = async () => {
      try{
        //単語データを取りにいてresultに格納
        const result = await fetchWordsAI();
        console.log("AIから取得：",result);
        //resultの格納
        setWords(result);
        updateWord(0);
        //表を表示
        setShowPage(false);
      }catch(e){
        //エラー時の処理
        //error: エラー用メソッド
        //e: 受けっとったエラー内容
        console.error("AI取得失敗",e);
      }
    };

    
    loadFromAI();
}, []);

}

const front = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        alignItems: "center",//横比率
        justifyContent: "center" //縦比率
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
        paddingHorizontal: 20,
    },
    card: {

    },
    cardLine: {
        width: "100%",
        flex: 1,
        maxHeight: 320,
        borderRadius: 16,
        backgroundColor: "1e1e1e",
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