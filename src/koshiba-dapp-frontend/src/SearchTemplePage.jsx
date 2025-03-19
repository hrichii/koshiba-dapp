import React, { useState, useEffect } from "react";
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";
import { Link } from "react-router-dom";
import "./SearchTemplePage.css";

function SearchTemplePage() {
    const [temples, setTemples] = useState([]);
    const [filteredTemples, setFilteredTemples] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    
    // コンポーネントマウント時にデータを取得
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // バックエンドから寺院データを取得
                const templeData = await koshiba_dapp_backend.getTempleList();
                console.log("取得した寺院データ:", templeData);
                
                let processedData = [];
                
                if (Array.isArray(templeData)) {
                    // 各寺院データを処理
                    processedData = templeData.map(temple => {
                        // addressオブジェクトがない場合は初期化
                        if (!temple.address) {
                            temple.address = {};
                        }
                        
                        // 必須フィールドがない場合はデフォルト値を設定
                        const addressDefaults = {
                            postal_code: "",
                            province: "",
                            city: "",
                            street: "",
                            building: ""
                        };
                        
                        return {
                            ...temple,
                            address: {
                                ...addressDefaults,
                                ...temple.address
                            },
                            // 他のフィールドも必要に応じて初期化
                            description: temple.description || "詳細情報はありません",
                            image_url: temple.image_url || "https://via.placeholder.com/800x400?text=寺院画像はありません"
                        };
                    });
                    
                    setTemples(processedData);
                    setFilteredTemples(processedData);
                    console.log("処理後の寺院データ:", processedData);
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

    // キーワード検索
    const searchByKeyword = (e) => {
        const keyword = e.target.value;
        setSearchKeyword(keyword);
        
        if (keyword.trim() === "") {
            setFilteredTemples(temples);
            return;
        }
        
        const filtered = temples.filter(temple => 
            temple.name.includes(keyword) || 
            `${temple.address.province || ''}${temple.address.city || ''}${temple.address.street || ''}`.includes(keyword)
        );
        setFilteredTemples(filtered);
    };

    return (
        <div className="search-temple-page">
            {/* エラーメッセージ */}
            {error && <div className="error-message">{error}</div>}
            
            {/* 成功メッセージ */}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            <div className="temple-container">
                {/* 検索ボックス */}
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="寺院名または住所で検索"
                        value={searchKeyword}
                        onChange={searchByKeyword}
                    />
                </div>
                
                {/* 寺院リスト */}
                <div className="temple-grid">
                    {filteredTemples.length > 0 ? (
                        filteredTemples.map(temple => (
                            <div key={temple.id} className="temple-card">
                                <div className="temple-image">
                                    <img src={temple.image_url} alt={temple.name} />
                                </div>
                                <div className="temple-info">
                                    <h3>{temple.name}</h3>
                                    <p>{temple.address.province || ''}{temple.address.city || ''}{temple.address.street || ''}</p>
                                </div>
                                <Link to={`/temple/${temple.id}`} className="detail-button">
                                    詳細を見る
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            該当する寺院が見つかりません
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchTemplePage;
