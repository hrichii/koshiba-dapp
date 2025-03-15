import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";
import { AuthClient } from "@dfinity/auth-client";
import "./Sidebar.css"; // ★ サイドバー専用のCSSを読み込む
import Image_koshiba from "./img/koshiba.jpg";
import Image_logo from "./img/logo.jpg";
// ボトムバー用アイコン画像
import IconHome from "./img/home.png";
import IconSearch from "./img/search.png";
import IconParticipate from "./img/group_add.png";
import IconOffering from "./img/offering.png"; 
import IconNotification from "./img/information.png";
import IconAccount from "./img/account.png";

function Sidebar({ isOpen }) {
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // get_user() を呼び出してユーザー情報を取得
    useEffect(() => {
        async function fetchUser() {
            setIsLoading(true);
            try {
                const userData = await koshiba_dapp_backend.getMe();
                console.log("Sidebar - Raw user data:", userData);
                
                // バックエンドからの応答が配列や期待しない形式の場合の処理
                let processedData = userData;
                if (Array.isArray(userData)) {
                    console.log("User data is an array - attempting to extract properties");
                    if (userData.length === 0) {
                        console.log("Empty array returned - user not found");
                        processedData = null;
                    } else {
                        // 配列内の最初の要素を使用
                        processedData = userData[0];
                    }
                } else if (typeof userData === 'object' && userData !== null && Object.keys(userData).length === 0) {
                    console.log("Empty object returned - user not found");
                    processedData = null;
                }
                
                console.log("Sidebar - Processed user data:", processedData);
                setUser(processedData);
            } catch (error) {
                console.error("ユーザー情報取得中にエラーが発生しました:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUser();
    }, []);

    // 現在のパスに基づいてアクティブなリンクを判定
    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleDeleteUser = async () => {
        try {
            await koshiba_dapp_backend.deleteMe();
            // ユーザー削除後、ログイン画面（"/"）へ遷移
            navigate("/");
        } catch (error) {
            console.error("ユーザー削除中にエラーが発生しました:", error);
        }
    };

    // ユーザー登録画面へ遷移
    const handleGoToRegister = () => {
        navigate("/register");
    };

    // ユーザー名を表示する関数
    const displayUserName = () => {
        if (isLoading) return "読み込み中...";
        if (!user) return "ゲスト";
        
        // last_nameとfirst_nameが存在する場合のみ連結して表示
        const lastName = user.last_name || "";
        const firstName = user.first_name || "";
        
        if (lastName || firstName) {
            return `${lastName}${firstName}`;
        }
        
        return "ユーザー";
    };

    // ログアウト処理を追加
    const handleLogout = async () => {
        try {
            // AuthClientのインスタンスを取得
            const authClient = await AuthClient.create();
            
            // Internet Identityからログアウト
            await authClient.logout();
            
            // ログアウト後にログイン画面に遷移
            navigate("/");
            
            console.log("ログアウトが完了しました");
        } catch (error) {
            console.error("ログアウト中にエラーが発生しました:", error);
        }
    };

    return (
        <>
            {/* サイドバー - PCのみ表示 */}
            <div className={`sidebar ${isOpen ? 'active' : ''}`}>
                {/* ロゴ部分 - クリックでホームに遷移 */}
                <Link to="/home" className="logo">
                    <img src={Image_logo} alt="ロゴ" />
                </Link>

                {/* ナビゲーションリンク */}
                <ul className="nav-links">
                    <li>
                        <Link 
                            to="/search" 
                            className={isActive("/search") ? "active" : ""}
                        >
                            お寺を探す
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/participate" 
                            className={isActive("/participate") ? "active" : ""}
                        >
                            寺運営に参加
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/offering" 
                            className={isActive("/offering") ? "active" : ""}
                        >
                            御布施
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/notification" 
                            className={isActive("/notification") ? "active" : ""}
                        >
                            お知らせ
                        </Link>
                    </li>
                </ul>

                {/* アカウント情報 */}
                <div className="account-section">
                    <div className="account-info-row">
                        <img src={Image_koshiba} alt="小柴" />
                        <Link to={user ? "/account" : "#"}>
                            {displayUserName()}
                        </Link>
                    </div>
                    
                    {/* ユーザーの状態に応じたメニュー表示 */}
                    {user ? (
                        // ログイン済みの場合：ログアウトとアカウント削除を表示
                        <ul className="account-menu">
                            <li><button className="logout-link" onClick={handleLogout}>ログアウト</button></li>
                            <li>
                                <button 
                                    className="delete-account-button" 
                                    onClick={() => setShowModal(true)}
                                >
                                    アカウント削除
                                </button>
                            </li>
                        </ul>
                    ) : (
                        // 未ログインの場合：ユーザー登録リンクを表示
                        <ul className="account-menu">
                            <li>
                                <button 
                                    className="register-account-button" 
                                    onClick={handleGoToRegister}
                                >
                                    ユーザー登録
                                </button>
                            </li>
                        </ul>
                    )}
                </div>

                {/* モーダル表示 - デザイン改善版 */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="delete-account-modal">
                            <div className="modal-header">
                                <span className="warning-icon">⚠</span>
                                <h2>アカウント削除の確認</h2>
                            </div>
                            <div className="modal-content">
                                <p className="modal-message">本当にアカウントを削除しますか？</p>
                                <p className="modal-warning">この操作は取り消すことができません。アカウントを削除すると、すべてのデータが永久に失われます。</p>
                            </div>
                            <div className="modal-buttons">
                                <button 
                                    className="cancel-button"
                                    onClick={() => setShowModal(false)}
                                >
                                    キャンセル
                                </button>
                                <button 
                                    className="delete-button"
                                    onClick={handleDeleteUser}
                                >
                                    削除する
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* モバイル用ボトムナビゲーション - 常に表示 */}
            <div className="mobile-nav">
                <Link 
                    to="/home" 
                    className={`mobile-nav-item ${isActive("/home") ? "active" : ""}`}
                >
                    <img 
                        src={IconHome} 
                        alt="ホーム" 
                        className="mobile-nav-icon"
                    />
                    <span>ホーム</span>
                </Link>
                <Link 
                    to="/search" 
                    className={`mobile-nav-item ${isActive("/search") ? "active" : ""}`}
                >
                    <img 
                        src={IconSearch} 
                        alt="お寺を探す" 
                        className="mobile-nav-icon"
                    />
                    <span>お寺を探す</span>
                </Link>
                <Link 
                    to="/participate" 
                    className={`mobile-nav-item ${isActive("/participate") ? "active" : ""}`}
                >
                    <img 
                        src={IconParticipate} 
                        alt="参加" 
                        className="mobile-nav-icon"
                    />
                    <span>参加</span>
                </Link>
                <Link 
                    to="/offering" 
                    className={`mobile-nav-item ${isActive("/offering") ? "active" : ""}`}
                >
                    <img 
                        src={IconOffering} 
                        alt="御布施" 
                        className="mobile-nav-icon"
                    />
                    <span>御布施</span>
                </Link>
                <Link 
                    to="/notification" 
                    className={`mobile-nav-item ${isActive("/notification") ? "active" : ""}`}
                >
                    <img 
                        src={IconNotification} 
                        alt="お知らせ" 
                        className="mobile-nav-icon"
                    />
                    <span>お知らせ</span>
                </Link>
                <Link 
                    to={user ? "/account" : "/"}
                    className={`mobile-nav-item ${isActive("/account") || isActive("/") ? "active" : ""}`}
                >
                    <img 
                        src={IconAccount} 
                        alt="マイページ" 
                        className="mobile-nav-icon"
                    />
                    <span>{user ? "マイページ" : "ログイン"}</span>
                </Link>
            </div>
        </>
    );
}

export default Sidebar;
