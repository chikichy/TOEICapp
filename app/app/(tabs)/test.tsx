import React, { useEffect,useState } from "react";

// AIで単語を呼び出す機能
import { fetchWordsAI } from "../api/ai";

import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

type Word = {
  english: string;
  japanese: string;
  pos?: string;
  example?: string;
};

//ダミータイプ
type Question ={
  english: string;  //英単語
  choices: string[];  //選択し
  correctIndex: number; //何番目の正解か
};

/*
const questions: Question[] =[
  {
    english: "accomplish",
    choices: ["達成する", "避ける", "決定する", "減らす"],
    correctIndex: 0,
  },
  {
    english: "distribute",
    choices: ["分配する","説明する","修理する","禁止する"],
    correctIndex: 0,
  },
  {
    english: "available",
    choices: ["利用可能な","不可能な","高価な","簡単な"],
    correctIndex: 0,
  },
];
*/

const TestScreen: React.FC = () => {
  // テスト用の問題リスト
  const [questions, setQuestions] = useState<Question[]>([]);
  // 今何問目か（0,1,2,…）
  const [currentIndex, setCurrentIndex] = useState(0);
  // ユーザーが選んだ選択肢（まだ選んでなければ null）
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  // 正解数
  const [score, setScore] = useState(0);
  // テストが終わったかどうか
  const [isFinished, setIsFinished] = useState(false);
  const currentQuestion = questions[currentIndex];

  // AI単語
  const [words, setWords] = useState<Word[]>([]);
  const [loadingWords, setLoadingWords] = useState(true);
  const [wordError, setWordError] = useState<string | null>(null);


  //選択肢をタップしたときの処理
  //indexはnumber型しか受け取らない
  const handleSelect = (index: number) => {
    //政界の時の処理　スコアを増やす
    if(index === currentQuestion.correctIndex){
      //安全に更新できる書き方
      setScore((prev)=> prev+1);
    }


    //選んでた時の処理
    if(selectedIndex !== null || isFinished) return;
    setSelectedIndex(index);
  };

  //次の問題に行く処理
  const handleNext = () =>{
    //何も選んでなかったら行かせない
    if(selectedIndex === null) return;

    const next = currentIndex+1;
    if (next >= questions.length) {
      setIsFinished(true);
    }else{
      setCurrentIndex(next);
      //選択状態のリセット
      setSelectedIndex(null);
    }
  };

  useEffect(()=>{
    //時間がかかる処理
    const loadFromAI = async ()=> {
      try{
        //読み込み中表示
        setLoadingWords(true);
        //エラーメッセージなし
        setWordError(null);

        const result = await fetchWordsAI();
        console.log("AIから取得(テスト)",result);
        //配列の中身が空か配列じゃなかったら実行
        if(!Array.isArray(result) || result.length === 0){
          setWordError("テストに使える単語がありません");
          //問題リストを空にする
          setQuestions([]);
          return;
        }
        //取得した単語を保存
        setWords(result);

        //単語をテスト問題に変換する
        const qs = createQuestionsFromWords(result);
        setQuestions(qs);

        //テスト状態をリセット
        //今何問目かをリセット
        setCurrentIndex(0);
        //選択肢を未選択
        setSelectedIndex(null);
        //正解数
        setScore(0);
        //テスト終了フラグ
        setIsFinished(false);

      }catch(e){
        //エラー時
        console.error("AI取得失敗(テスト)", e);
        setWordError("単語データの読み込みに失敗しました");
      }finally{
        //ローディングを終わらせる
        setLoadingWords(false);
      }
    };
    //実行
    loadFromAI();
  },[]);

    // ローディング中
  if (loadingWords) {
    return (
      <SafeAreaView style={front.safe}>
        <View style={front.center}>
          <Text style={front.message}>単語を読み込み中です...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // エラー
  if (wordError) {
    return (
      <SafeAreaView style={front.safe}>
        <View style={front.center}>
          <Text style={front.error}>{wordError}</Text>
          <TouchableOpacity
            style={front.nextButton}
            onPress={() => {
              // もう一度読み込み
              setIsFinished(false);
              setCurrentIndex(0);
              setSelectedIndex(null);
              setScore(0);
              // ↑ useEffect が再度走るようにしたいなら工夫もできるけど、
              // ひとまずは画面をリロードすればOK
            }}
          >
            <Text style={front.nextButtonText}>もう一度試す</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 問題が一つも作れなかったとき
  if (questions.length === 0) {
    return (
      <SafeAreaView style={front.safe}>
        <View style={front.center}>
          <Text style={front.message}>
            出題に使える問題がありません。
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ここまで来たら安全に currentQuestion を使える
  //const currentQuestion = questions[currentIndex];

  
  //テスト終了後の画面
  if(isFinished){
    const total = questions.length;
    //正答率
    const rate = Math.round((score/total)*100);

    return(
      <SafeAreaView style ={front.safe}>
        <ScrollView contentContainerStyle={front.center}>
          <Text style={front.title}>テスト結果</Text>
          <Text style={front.scoretext}>
            正解数:{score}/{total}(正答率{rate}%)
          </Text>

          <TouchableOpacity
            style={front.nextButton}
              onPress={()=>{
                //最初の状態に戻す
                setCurrentIndex(0);
                setSelectedIndex(null);
                setScore(0);
                setIsFinished(false);
              }}
            >
              <Text style={front.nextButtonText}></Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    )
  }

  //テスト中の画面
  return (
    <SafeAreaView style={front.safe}>
      <View style={front.container}>
        {/*タイトル*/}
        <Text style={front.title}>テストモード</Text>
        <Text style={front.subtitle}>4択から選んで</Text>

        {/*進捗*/}
        <Text style ={front.progress}>
          {currentIndex+1}/{questions.length}問目
        </Text>

        {/*問題*/}
        <View style={front.questionBox}>
          <Text style={front.questionLabel}>この英単語の意味は</Text>
          <Text style={front.questionWord}>{currentQuestion.english}</Text>
        </View>

        {/*選択肢*/}
        <View style={front.optionsContainer}>
          {currentQuestion.choices.map((choice, index) => {
            const isChosen = selectedIndex === index;
            const isCorrect = index === currentQuestion.correctIndex;

            let optionStyle = [front.optionButton];

            // すでに回答済みなら色を変える
            if (selectedIndex !== null) {
              if (isCorrect) {
                optionStyle.push(front.optionCorrect);
              } else if (isChosen && !isCorrect) {
                optionStyle.push(front.optionWrong);
              }
            }

            return(
              <TouchableOpacity
                key={index}
                style={optionStyle}
                activeOpacity={0.8}
                onPress={() => handleSelect(index)}
              >
                <Text style={front.optionText}>{choice}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/*次へボタン*/}
        <TouchableOpacity
          style = {[front.nextButton,
            selectedIndex === null && front.nextButtonDisabled,
          ]}
          activeOpacity={selectedIndex === null ? 1 : 0.8}
          //ボタンが押せない時はdisabledが効く
          onPress={handleNext}
          //選択肢を選んでいない時は押せない
          disabled={selectedIndex === null}
        >
          {/*最後の問題かどうかを判別*/}
          <Text style={front.nextButtonText}>
            {currentIndex === questions.length - 1 ? "結果を見る" : "次の問題へ"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// 配列シャッフル用（フィッシャー–イェーツ法）
const shuffleArray = <T,>(array: T[]): T[] => {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
};

// AIから来た単語リスト → テスト用の Question[] に変換
const createQuestionsFromWords = (words: Word[]): Question[] => {
  // 単語の順番をシャッフル
  const shuffledWords = shuffleArray(words);

  // 1回のテストで出す問題数（多すぎると大変なので10問まで）
  const MAX_QUESTIONS = 10;
  const selectedWords = shuffledWords.slice(0, MAX_QUESTIONS);

  return selectedWords.map((w) => {
    // w 以外の単語からダミー選択肢を作る
    const others = words.filter((other) => other.english !== w.english);
    const shuffledOthers = shuffleArray(others);
    const distractors = shuffledOthers.slice(0, 3); // 3つ分

    // 正解＋ダミーの日本語だけ抜き出し
    const allChoices = shuffleArray([
      w.japanese,
      ...distractors.map((d) => d.japanese),
    ]);

    // 正解が今どの位置にいるか調べる
    const correctIndex = allChoices.findIndex(
      (jp) => jp === w.japanese
    );

    return {
      english: w.english,
      choices: allChoices,
      correctIndex,
    };
  });
};

export default TestScreen;

const front = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    marginBottom: 12,
  },
  progress: {
    fontSize: 14,
    marginBottom: 16,
  },
  questionBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  questionLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  questionWord: {
    fontSize: 32,
    fontWeight: "bold",
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
  },
  optionCorrect: {
    backgroundColor: "#c8e6c9",
    borderColor: "#4caf50",
  },
  optionWrong: {
    backgroundColor: "#ffcdd2",
    borderColor: "#f44336",
  },
  nextButton: {
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#4caf50",
    alignItems: "center",
    marginTop: 4,
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  scoreText: {
    fontSize: 20,
    marginTop: 8,
  },
  scoretext:{},
  error:{},
  message:{},
});
