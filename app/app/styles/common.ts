import {StyleSheet}from "react-native";

export const common = StyleSheet.create({
    //画面全体の土台
    safe:{
        //画面比率
        flex:1,
        //背景
        backgroundColor: "#f5f5f5",
    },
    //中身のレイアウト
    container:{
        flex:1,
        //画面の端にくっつかないように
        padding: 16,
    },
    //画面タイトル
    title:{
        //文字サイズ
        fontSize:24,
        //太文字
        fontWeight: "bold",
    },
    //サブタイトル
    subtitle:{
        fontSize: 12,
        color: "#666",
        //上下に余白
        marginTop: 4,
        marginBottom: 12,
    },
    //カードのUI
    card:{
        padding:16,
        //角丸の設定
        borderRadius: 12,
        backgroundColor: "#ffffff",
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    //メインボタン
    primaryButton:{
        paddingVertical:14,
        borderRadius: 8,
        //ボタンの色
        backgroundColor: '#4caf50',
        //中央ぞろえ
        alignItems: "center",
    },
    //ボタンの文字
    primaryButtonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },

});