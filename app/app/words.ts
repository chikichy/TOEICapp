//AIから単語データを受け取る

export type Word = {
    english: string;
    japanese: string;
    pos?: string;
    example?: string;
};

//レベル
export type WordLevel = "600"|"730"|"800";

//今は固定のデータ
const LOCAL_WORDS: Word[] = [
  {
    english: "apple",
    japanese: "りんご",
    pos: "noun",
    example: "I eat an apple every morning.",
  },
  {
    english: "book",
    japanese: "本",
    pos: "noun",
    example: "This book is very interesting.",
  },
  {
    english: "computer",
    japanese: "コンピュータ",
    pos: "noun",
    example: "I use a computer every day.",
  },
  {
    english: "music",
    japanese: "音楽",
    pos: "noun",
    example: "She likes classical music.",
  },
];

//ここにAIサーバー呼び出しを置く（将来的）
//単語を取る関数
export async function fetchWordsMock(level: WordLevel): Promise<Word[]> {
  //のちにレベル別
  console.log("単語データ取得（モック）: level =", level);

  await new Promise((resolve) => setTimeout(resolve, 500));

  return LOCAL_WORDS;
}