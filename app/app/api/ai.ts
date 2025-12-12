// app/api/ai.ts

export type Word = {
  english: string;
  japanese: string;
  pos: string;
  example: string;
};

// .env に入れたキーを読み込み
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

// AIが使えないときに返すローカル単語リスト
const FALLBACK_WORDS: Word[] = [
  {
    english: "achievement",
    japanese: "達成",
    pos: "名詞",
    example: "She celebrated her achievement.",
  },
  {
    english: "budget",
    japanese: "予算",
    pos: "名詞",
    example: "We need to review the budget.",
  },
  {
    english: "improve",
    japanese: "改善する",
    pos: "動詞",
    example: "We must improve the process.",
  },
  {
    english: "conference",
    japanese: "会議",
    pos: "名詞",
    example: "The conference starts at 9 a.m.",
  },
  {
    english: "estimate",
    japanese: "見積もる",
    pos: "動詞",
    example: "Can you estimate the cost?",
  },
];

if (!OPENAI_API_KEY) {
  console.warn(
    "⚠️ EXPO_PUBLIC_OPENAI_API_KEY が設定されていません。ローカル単語のみを使用します。"
  );
}

export async function fetchWordsAI(): Promise<Word[]> {
  // キーがなければ即フォールバック
  if (!OPENAI_API_KEY) {
    return FALLBACK_WORDS;
  }

  const prompt = `
あなたはTOEIC対策用の英単語帳を作るアシスタントです。
次の TypeScript 型にそのまま入る形で JSON を出力してください。

type Word = {
  english: string;
  japanese: string;
  pos: string;
  example: string;
};

条件:
- TOEICに出そうな単語を10個
- 出力は JSON 配列のみ（余計な文章や説明文は一切書かない）
- 例: [{"english":"...", "japanese":"...", "pos":"...", "example":"..."}, ...]
`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("OpenAI API error:", errorText);
      console.warn("AIが使えないのでローカル単語を使用します。");
      return FALLBACK_WORDS;
    }

    const data = await res.json();
    const content: string | undefined =
      data.choices?.[0]?.message?.content?.trim();

    console.log("AI生データ:", content);

    if (!content) {
      console.warn("AIから内容が返ってこなかったのでローカル単語を使用します。");
      return FALLBACK_WORDS;
    }

    // ★ ここで ```json ～ ``` を取り除く
    let jsonText = content.trim();

    // 先頭が ``` で始まっていたらコードブロックを削る
    if (jsonText.startsWith("```")) {
      // 1行目の ``` または ```json を削除
      jsonText = jsonText.replace(/^```[a-zA-Z]*\n/, "");
      // 最後の ``` を削除
      jsonText = jsonText.replace(/```$/, "").trim();
    }

    try {
      const words = JSON.parse(jsonText) as Word[];
      console.log("AIから取得:", words);
      return words;
    } catch (e) {
      console.error(
        "JSON のパースに失敗しました。ローカル単語を使用します。content:",
        jsonText
      );
      return FALLBACK_WORDS;
    }

  } catch (e) {
    console.error("AI 呼び出し全体でエラー。ローカル単語を使用します。", e);
    return FALLBACK_WORDS;
  }
}
