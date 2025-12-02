//記憶モード画面
import react, {useState} from "react";

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
        setShowPage((prev) => !prev);
    };

    //次の単語
    const TapNextWord = () => {
        const nextWord = (word+1) % WORDS.length;
        updateWord(nextWord);
        setShowPage(false); //ページを表で表示
    };


    return(
        <View style={a.container}>
            <Text style={a.title}>記憶モード</Text>
            <Text style= {a.subtitle}>カードをタップして,ほにゃほにゃ</Text>

            {/*単語カード　タップで裏表 ゆくゆくはスワイプで */}
            <TouchableOpacity style={a.card} onPress={TapNextWord}>
                {!showPage ?(
                    //表　英単語のみ
                    //WORDSのオブジェクト
                    //japanese,eniglish,pos...etc
                    <View style={a.cardLine}>
                        <Text style={a.nameLabel}>英単語</Text>
                        <Text style={a.englishExam}>{currentWords.english}</Text>
                        <Text style={a.mean}>押したら意味を表示</Text>
                    </View>
                ):(
                    //裏：意味・品詞・例文
                    <View style={a.cardLine}>
                        <Text style={a.IMI}>意味</Text>
                        <Text style={a.meanText}>
                        {currentWords.japanese}({currentWords.pos})
                        </Text>

                        <View style={a.exaBox}>
                            <Text style={a.exaLabel}>使い方</Text>
                            <Text style={a.exaText}>{currentWords.example}</Text>
                        </View>

                        <Text style={a.hint}>もう一度タップで英単語</Text>
                    </View> 
                )}
            </TouchableOpacity>

            {/* 次の単語へボタン*/}
            <TouchableOpacity style={a.nextButton}  onPress={TapNextWord}>
                <Text style={a.nextButton}>次の単語</Text>
            </TouchableOpacity>
        </View>   
    );
}

const a = StyleSheet.create({
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