//記憶モード画面
import React, {useState} from "react";
//aiで単語を呼び出す
import {fetchWordAI} from "../../api/ai"

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn("⚠️ EXPO_PUBLIC_OPENAI_API_KEY が設定されていません");
}
export type Word = {
    english: string;
    japanese: string;
    pos: string;
    example: string;
};

export async function fetchWordsAI(): Promise<Word[]>{
    return[
        {
            english: "estimate",
            japanese: "見積もる",
            pos: "動詞",
            example: "We estimate the project will take three months.",
        },
        {
            english: "conference",
            japanese: "会議",
            pos: "名詞",
            example: "She attended the annual business conference.",
        },  
    ];
}