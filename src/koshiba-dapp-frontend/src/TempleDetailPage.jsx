import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";
import "./TempleDetailPage.css";

function TempleDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [temple, setTemple] = useState(null);
    const [user, setUser] = useState(null);
    const [currentTemple, setCurrentTemple] = useState(null); // ユーザーの現在の所属寺院
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false); // 確認ダイアログの表示状態
    const [events, setEvents] = useState([]); // 運営方針データ
    const [payments, setPayments] = useState([]); // 運営収支データ

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // ユーザー情報を取得
                const userData = await koshiba_dapp_backend.getMe();
                console.log("ユーザー情報:", userData);
                
                if (userData) {
                    // ユーザーデータをセット
                    setUser({
                        last_name: userData.last_name || "",
                        first_name: userData.first_name || "",
                        grade: userData.grade || { Student: null },
                        templeId: userData.templeId
                    });
                    
                    // ユーザーの所属寺院情報を取得
                    if (userData.templeId) {
                        try {
                            const currentTempleData = await koshiba_dapp_backend.getTemple(userData.templeId);
                            console.log("ユーザーの所属寺院データ:", currentTempleData);
                            
                            // レスポンスが配列の場合は最初の要素を取り出す
                            if (Array.isArray(currentTempleData) && currentTempleData.length > 0) {
                                setCurrentTemple(currentTempleData[0]);
                            } else if (currentTempleData) {
                                setCurrentTemple(currentTempleData);
                            }
                        } catch (err) {
                            console.error("所属寺院データの取得エラー:", err);
                            // 所属寺院の取得に失敗してもユーザー体験に影響しないようにする
                        }
                    }
                }
                
                let templeData;
                
                // URLパラメータからIDが提供された場合
                if (id) {
                    const response = await koshiba_dapp_backend.getTemple(Number(id));
                    console.log("寺院詳細データの生レスポンス:", response);
                    
                    // レスポンスが配列の場合は最初の要素を取り出す
                    if (Array.isArray(response)) {
                        if (response.length > 0) {
                            templeData = response[0];
                        } else {
                            throw new Error("指定された寺院が見つかりません");
                        }
                    } else {
                        templeData = response;
                    }
                    
                    if (!templeData) {
                        throw new Error("指定された寺院が見つかりません");
                    }
                    console.log("加工後の寺院詳細データ:", templeData);
                } 
                // IDが提供されない場合は、ユーザーの所属寺院を取得
                else if (userData && userData.templeId) {
                    const response = await koshiba_dapp_backend.getTemple(userData.templeId);
                    console.log("所属寺院データの生レスポンス:", response);
                    
                    // レスポンスが配列の場合は最初の要素を取り出す
                    if (Array.isArray(response)) {
                        if (response.length > 0) {
                            templeData = response[0];
                        } else {
                            throw new Error("所属寺院の情報が取得できません");
                        }
                    } else {
                        templeData = response;
                    }
                    
                    if (!templeData) {
                        throw new Error("所属寺院の情報が取得できません");
                    }
                    console.log("加工後の所属寺院データ:", templeData);
                } else {
                    throw new Error("所属寺院情報がありません");
                }
                
                // 必要なフィールドが存在しない場合にデフォルト値を設定
                if (templeData) {
                    // address オブジェクトが存在しない場合は空オブジェクトを設定
                    if (!templeData.address) {
                        templeData.address = {};
                    }
                    
                    // 必須フィールドがない場合はデフォルト値を設定
                    const addressDefaults = {
                        postal_code: "",
                        province: "",
                        city: "",
                        street: "",
                        building: ""
                    };
                    
                    templeData.address = {
                        ...addressDefaults,
                        ...templeData.address
                    };
                    
                    // description が存在しない場合は空文字列を設定
                    if (!templeData.description) {
                        templeData.description = "詳細情報はありません。";
                    }
                    
                    // image_url が存在しない場合はデフォルト画像を設定
                    if (!templeData.image_url) {
                        templeData.image_url = "https://via.placeholder.com/800x400?text=寺院画像はありません";
                    }
                }
                
                setTemple(templeData);
                
                // 表示中の寺院IDに紐づく運営方針データを取得
                try {
                    const templeId = templeData.id;
                    const eventsData = await koshiba_dapp_backend.getEventListByTempleId(templeId);
                    console.log("表示中の寺院の運営方針データ:", eventsData);
                    setEvents(eventsData || []);
                } catch (eventError) {
                    console.error("運営方針データの取得に失敗しました:", eventError);
                    setEvents([]);
                }
                
                // 表示中の寺院IDに紐づく運営収支データを取得
                try {
                    const templeId = templeData.id;
                    const paymentsData = await koshiba_dapp_backend.getPaymentListByTempleId(templeId);
                    console.log("表示中の寺院の運営収支データ:", paymentsData);
                    setPayments(paymentsData || []);
                } catch (paymentError) {
                    console.error("運営収支データの取得に失敗しました:", paymentError);
                    setPayments([]);
                }
                
            } catch (err) {
                console.error("データ取得エラー:", err);
                setError(err.message || "情報の取得に失敗しました");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, [id]);

    // 所属寺院変更の確認を表示
    const showChangeConfirmation = () => {
        if (!user) {
            setError("ユーザー情報が見つかりません。ログインしてください。");
            return;
        }
        
        if (!temple) {
            setError("寺院情報が見つかりません。");
            return;
        }
        
        // 既に別の寺院に所属している場合、または所属寺院がない場合は確認ダイアログを表示
        if (currentTemple && currentTemple.id !== temple.id) {
            // 所属寺院が異なる場合は変更確認
            setShowConfirmation(true);
        } else if (!currentTemple) {
            // 所属寺院がない場合も確認ダイアログを表示
            setShowConfirmation(true);
        } else {
            // 同じ寺院の場合は何もしない（ボタンは非表示または非活性になっているはず）
            setError("すでにこの寺院に所属しています。");
        }
    };
    
    // 確認ダイアログをキャンセル
    const cancelChange = () => {
        setShowConfirmation(false);
    };

    // 所属寺院に設定する関数
    const updateTemple = async () => {
        try {
            setIsUpdating(true);
            setError("");
            setShowConfirmation(false);
            
            if (!user) {
                throw new Error("ユーザー情報が見つかりません。ログインしてください。");
            }
            
            // ユーザー情報のデフォルト値を設定
            const lastName = user.last_name || "";
            const firstName = user.first_name || "";
            
            // gradeを正しい形式に設定
            // ユーザーの現在のgradeを維持する
            const grade = user.grade || { Student: null };
            
            console.log("更新情報:", {
                last_name: lastName,
                first_name: firstName,
                grade: grade,
                temple_id: temple.id
            });
            
            // バックエンドAPIを呼び出して所属寺院を更新（個別のパラメータとして渡す）
            await koshiba_dapp_backend.updateMe(
                lastName,
                firstName,
                grade,
                temple.id
            );
            
            // 成功メッセージを表示
            setSuccessMessage(
                currentTemple 
                    ? `${temple.name}に所属寺院を変更しました` 
                    : `${temple.name}を所属寺院として設定しました`
            );
            
            // ユーザー情報と所属寺院情報を更新
            const updatedUser = await koshiba_dapp_backend.getMe();
            if (updatedUser) {
                setUser({
                    last_name: updatedUser.last_name || "",
                    first_name: updatedUser.first_name || "",
                    grade: updatedUser.grade || { Student: null },
                    templeId: updatedUser.templeId
                });
                setCurrentTemple(temple);
            }
            
            // 3秒後にメッセージを消す
            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        } catch (err) {
            console.error("所属寺院更新エラー:", err);
            setError("所属寺院の更新に失敗しました: " + (err.message || ""));
        } finally {
            setIsUpdating(false);
        }
    };

    // 検索ページに戻る関数
    const goBackToSearch = () => {
        navigate("/search");
    };
    
    // 支出/収入のステータスに基づいたクラス名を返す
    const getPaymentStatusClass = (status) => {
        if (!status) return "";
        
        // statusがオブジェクトの場合（Enum変換後）
        if (typeof status === 'object') {
            if ('Expenses' in status) {
                return "payment-status-expenses";
            } else if ('Income' in status) {
                return "payment-status-income";
            }
        } 
        // 文字列の場合は従来通り
        else if (typeof status === 'string') {
            if (status === "Expenses") {
                return "payment-status-expenses";
            } else if (status === "Income") {
                return "payment-status-income";
            }
        }
        
        return "";
    };
    
    // 金額を3桁区切りでフォーマットする関数
    const formatAmount = (amount) => {
        if (amount === undefined || amount === null) return "0";
        return amount.toLocaleString();
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

    // エラー表示
    if (error) {
        return (
            <div className="temple-detail-page">
                <div className="error-container">
                    <div className="error-message">{error}</div>
                    <button className="back-button" onClick={goBackToSearch}>
                        寺院検索に戻る
                    </button>
                </div>
            </div>
        );
    }

    // 寺院データがない場合
    if (!temple) {
        return (
            <div className="temple-detail-page">
                <div className="error-container">
                    <div className="error-message">寺院情報が見つかりません</div>
                    <button className="back-button" onClick={goBackToSearch}>
                        寺院検索に戻る
                    </button>
                </div>
            </div>
        );
    }

    // ユーザーの所属寺院かどうかを確認
    const isMyTemple = user && currentTemple && currentTemple.id === temple.id;

    // 住所を整形する関数
    const formatAddress = () => {
        const { postal_code, province, city, street, building } = temple.address;
        
        // 郵便番号がある場合は先頭に表示
        const postalPart = postal_code ? `〒${postal_code} ` : '';
        
        // 主要な住所部分を結合
        const mainAddress = `${province || ''}${city || ''}${street || ''}`;
        
        // 建物名がある場合は末尾に追加
        const buildingPart = building ? ` ${building}` : '';
        
        // すべての部分を結合
        return postalPart + mainAddress + buildingPart || '住所情報がありません';
    };

    return (
        <div className="temple-detail-page">
            <div className="temple-detail-container">
                {/* 成功メッセージ */}
                {successMessage && <div className="success-message">{successMessage}</div>}
                
                {/* 確認ダイアログ */}
                {showConfirmation && (
                    <div className="confirmation-dialog">
                        <div className="confirmation-content">
                            <h3>所属寺院の変更</h3>
                            {currentTemple ? (
                                <p>現在の所属寺院「{currentTemple?.name || '不明'}」から「{temple.name}」に変更しますか？</p>
                            ) : (
                                <p>「{temple.name}」を所属寺院として設定しますか？</p>
                            )}
                            <div className="confirmation-buttons">
                                <button className="cancel-button" onClick={cancelChange}>キャンセル</button>
                                <button className="confirm-button" onClick={updateTemple}>
                                    {currentTemple ? "変更する" : "設定する"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="temple-header">
                    <h1 className="temple-name">{temple.name}</h1>
                </div>
                
                <div className="temple-image-large">
                    <img src={temple.image_url} alt={temple.name} />
                </div>
                
                <div className="temple-info-section">
                    <h2 className="section-title">基本情報</h2>
                    <div className="info-row">
                        <span className="info-label">住所</span>
                        <span className="info-value">
                            {formatAddress()}
                        </span>
                    </div>
                </div>
                
                <div className="temple-description-section">
                    <h2 className="section-title">寺院について</h2>
                    <p className="temple-description">{temple.description}</p>
                </div>
                
                {/* 運営方針セクション */}
                <div className="temple-policy-section">
                    <h2 className="section-title">運営方針</h2>
                    <div className="dashboard-card policy-card">
                        <div className="policy-event-list">
                            {events.length > 0 ? (
                                events.slice(0, 3).map((event) => (
                                    <div key={event.event_id} className="policy-event-item">
                                        <div className="policy-event-header">
                                            <h4 className="policy-event-title">{event.title}</h4>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-data-message">現在投票できる議案はありません</p>
                            )}
                        </div>
                        
                        <Link to={`/temple-policy/${temple.id}`} className="see-more-link">
                            ＞＞投票はこちら
                        </Link>
                    </div>
                </div>
                
                {/* 運営収支セクション */}
                <div className="temple-payment-section">
                    <h2 className="section-title">運営収支</h2>
                    <div className="dashboard-card payment-card">
                        <div className="payment-list">
                            {payments.length > 0 ? (
                                payments.slice(0, 3).map((payment) => (
                                    <div key={payment.payment_id} className="payment-item">
                                        <div className="payment-item-header">
                                            <h4 className="payment-item-title">{payment.title}</h4>
                                            <div className="payment-item-amount">
                                                <span className={`payment-status ${getPaymentStatusClass(payment.status)}`}>
                                                    {typeof payment.status === 'object' && 'Expenses' in payment.status ? "-" : "+"}
                                                    {formatAmount(payment.amount)}円
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-data-message">収支情報はありません</p>
                            )}
                        </div>
                        
                        <Link to={`/temple-payment/${temple.id}`} className="see-more-link">
                            ＞＞詳細はこちら
                        </Link>
                    </div>
                </div>
                
                <div className="temple-actions">
                    {isMyTemple ? (
                        <div className="my-temple-badge">
                            <span>現在の所属寺院です</span>
                        </div>
                    ) : (
                        <button 
                            className="set-temple-button"
                            onClick={showChangeConfirmation}
                            disabled={isUpdating || isMyTemple}
                        >
                            {isUpdating ? "設定中..." : "所属寺院に設定する"}
                        </button>
                    )}
                </div>
                
                {/* 検索に戻るボタンをページ下部に配置 */}
                <div className="back-button-container">
                    <button className="back-button" onClick={goBackToSearch}>
                        ← 検索に戻る
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TempleDetailPage; 