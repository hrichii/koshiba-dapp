import React, { useState, useEffect } from "react";
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";
import "./SearchTemplePage.css";

function SearchTemplePage() {
    const [activeTab, setActiveTab] = useState("alphabetical"); // "alphabetical" or "map"
    const [temples, setTemples] = useState([]);
    const [filteredTemples, setFilteredTemples] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("あ");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [user, setUser] = useState(null);
    
    // 50音の配列
    const japaneseGroups = [
        "あ", "い", "う", "え", "お", 
        "か", "き", "く", "け", "こ", 
        "さ", "し", "す", "せ", "そ", 
        "た", "ち", "つ", "て", "と", 
        "な", "に", "ぬ", "ね", "の", 
        "は", "ひ", "ふ", "へ", "ほ", 
        "ま", "み", "む", "め", "も", 
        "や", "ゆ", "よ", 
        "ら", "り", "る", "れ", "ろ", 
        "わ", "を", "ん"
    ];

    // コンポーネントマウント時にデータを取得
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // バックエンドから寺院データを取得
                const templeData = await koshiba_dapp_backend.getTempleList();
                console.log("取得した寺院データ:", templeData);
                
                // APIから返されたデータを変換
                let processedData = [];
                if (Array.isArray(templeData)) {
                    processedData = templeData.map(temple => {
                        // 寺院名から適切な50音グループを取得
                        const group = getFirstCharGroup(temple.name);
                        return {
                            id: temple.id.toString(),
                            name: temple.name,
                            address: temple.address || "住所情報なし",
                            group: group
                        };
                    });
                }
                
                setTemples(processedData);
                filterTemplesByGroup("あ");
                
                // ユーザー情報を取得
                const userData = await koshiba_dapp_backend.getMe();
                if (Array.isArray(userData) && userData.length > 0) {
                    setUser(userData[0]);
                } else if (userData) {
                    setUser(userData);
                }
            } catch (err) {
                console.error("データ取得エラー:", err);
                setError("寺院データの取得に失敗しました。");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, []);

    // 寺院名の最初の文字から50音グループを取得
    const getFirstCharGroup = (templeName) => {
        if (!templeName || templeName.length === 0) return "あ";
        
        const firstChar = templeName.charAt(0);
        // ひらがなを確認
        if (japaneseGroups.includes(firstChar)) {
            return firstChar;
        }
        
        // カタカナをひらがなに変換して確認
        const hiragana = convertKatakanaToHiragana(firstChar);
        if (japaneseGroups.includes(hiragana)) {
            return hiragana;
        }
        
        // その他の文字は「あ」グループに入れる
        return "あ";
    };
    
    // カタカナをひらがなに変換する関数
    const convertKatakanaToHiragana = (char) => {
        const katakanaStart = 0x30A1; // カタカナ「ァ」のコードポイント
        const hiraganaStart = 0x3041; // ひらがな「ぁ」のコードポイント
        
        const code = char.charCodeAt(0);
        if (code >= katakanaStart && code <= katakanaStart + 90) {
            return String.fromCharCode(code - katakanaStart + hiraganaStart);
        }
        return char;
    };

    // 50音グループで寺院をフィルタリング
    const filterTemplesByGroup = (group) => {
        setSelectedGroup(group);
        const filtered = temples.filter(temple => temple.group === group);
        setFilteredTemples(filtered);
        setSearchKeyword("");
    };

    // キーワード検索
    const searchByKeyword = (e) => {
        const keyword = e.target.value;
        setSearchKeyword(keyword);
        
        if (keyword.trim() === "") {
            filterTemplesByGroup(selectedGroup);
            return;
        }
        
        const filtered = temples.filter(temple => 
            temple.name.includes(keyword) || 
            temple.address.includes(keyword)
        );
        setFilteredTemples(filtered);
    };

    // 所属寺院として設定
    const setAsMyTemple = async (templeId) => {
        if (!user) {
            setError("ユーザー情報が見つかりません。ログインしてください。");
            return;
        }
        
        try {
            setIsLoading(true);
            // バックエンドAPIを呼び出して所属寺院を更新
            await koshiba_dapp_backend.updateMe({ ...user, templeId: templeId });
            
            // 成功メッセージを表示
            console.log(`Temple ID ${templeId} が所属寺院として設定されました`);
            setSuccessMessage("所属寺院が正常に更新されました。");
            
            // 3秒後にメッセージを消す
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } catch (err) {
            console.error("所属寺院更新エラー:", err);
            setError("所属寺院の更新に失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    // ローディング表示
    if (isLoading) {
        return (
            <div className="temple-loading">
                <div className="loading-circle"></div>
                <p>読み込み中...</p>
            </div>
        );
    }

    return (
        <div className="search-temple-page">
            <h1 className="page-title">お寺を探す</h1>
            
            {/* タブ切り替え */}
            <div className="temple-tabs">
                <button 
                    className={`tab-button ${activeTab === "alphabetical" ? "active" : ""}`}
                    onClick={() => setActiveTab("alphabetical")}
                >
                    50音から探す
                </button>
                <button 
                    className={`tab-button ${activeTab === "map" ? "active" : ""}`}
                    onClick={() => setActiveTab("map")}
                >
                    地図から探す
                </button>
            </div>
            
            {/* エラーメッセージ */}
            {error && <div className="error-message">{error}</div>}
            
            {/* 成功メッセージ */}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            {/* 50音タブの内容 */}
            {activeTab === "alphabetical" && (
                <div className="alphabetical-container">
                    {/* 検索ボックス */}
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="寺院名または住所で検索"
                            value={searchKeyword}
                            onChange={searchByKeyword}
                        />
                    </div>
                    
                    {/* 50音グループ */}
                    <div className="japanese-groups">
                        {japaneseGroups.map(group => (
                            <button
                                key={group}
                                className={`group-button ${selectedGroup === group ? "active" : ""}`}
                                onClick={() => filterTemplesByGroup(group)}
                            >
                                {group}
                            </button>
                        ))}
                    </div>
                    
                    {/* 寺院リスト */}
                    <div className="temple-list">
                        {filteredTemples.length > 0 ? (
                            filteredTemples.map(temple => (
                                <div key={temple.id} className="temple-card">
                                    <div className="temple-info">
                                        <h3>{temple.name}</h3>
                                        <p>{temple.address}</p>
                                    </div>
                                    <button 
                                        className="set-temple-button"
                                        onClick={() => setAsMyTemple(temple.id)}
                                    >
                                        所属寺院に設定
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="no-results">
                                該当する寺院が見つかりません
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* 地図タブの内容 */}
            {activeTab === "map" && (
                <div className="map-container">
                    <div className="map-placeholder">
                        <div className="map-message">
                            <h2>地図表示機能は準備中です</h2>
                            <p>現在、地図APIとの連携を開発中です。もうしばらくお待ちください。</p>
                            <p>それまでは「50音から探す」タブをご利用ください。</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchTemplePage;
