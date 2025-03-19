import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";
import { AuthClient } from "@dfinity/auth-client";
import "./Sidebar.css"; // ★ サイドバー専用のCSSを読み込む
import Image_logo from "./img/logo.jpg";
// ボトムバー用アイコン画像
import IconHome from "./img/home.png";
import IconSearch from "./img/search.png";
import IconVote from "./img/vote.png"; // 運営方針用アイコン
import IconWallet from "./img/wallet.png"; // 運営収支用アイコン
import IconOffering from "./img/offering.png"; 
import IconNotification from "./img/information.png";
import IconAccount from "./img/account.png";
// 折りたたみアイコンを追加
import IconLeftArrow from "./img/left_arrow.png";
import IconRightArrow from "./img/right_arrow.png";

function Sidebar({ isOpen: propIsOpen }) {
    const [showModal, setShowModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [principalId, setPrincipalId] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false); // サイドバー折りたたみ状態
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
                
                // Principal IDを取得
                try {
                    const principal = await koshiba_dapp_backend.getPrincipalDebug();
                    setPrincipalId(principal);
                } catch (error) {
                    console.error("Principal IDの取得に失敗しました:", error);
                }
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
            setShowModal(false);
            setShowAccountModal(false);
        } catch (error) {
            console.error("ユーザー削除中にエラーが発生しました:", error);
        }
    };

    // ユーザー登録画面へ遷移
    const handleGoToRegister = () => {
        navigate("/register");
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
            
            // モーダルを閉じる
            setShowAccountModal(false);
        } catch (error) {
            console.error("ログアウト中にエラーが発生しました:", error);
        }
    };
    
    // サイドバーの折りたたみ状態を切り替え
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <>
            {/* アカウントアイコンボタン */}
            <button 
                className={`account-icon-button ${showAccountModal ? 'active' : ''}`}
                onClick={() => setShowAccountModal(!showAccountModal)}
            >
                <img src={IconAccount} alt="アカウント" />
            </button>
            
            {/* アカウントモーダル */}
            {showAccountModal && (
                <div className="account-modal-overlay" onClick={() => setShowAccountModal(false)}>
                    <div className="account-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="account-modal-header">
                            <h3 className="account-modal-title">アカウント情報</h3>
                        </div>
                        
                        <div className="principal-id-container">
                            <p className="principal-id-label">Principal ID</p>
                            <p className="principal-id">{principalId || "読み込み中..."}</p>
                        </div>
                        
                        <div className="account-modal-actions">
                            <button 
                                className="modal-action-button logout"
                                onClick={handleLogout}
                            >
                                <span>ログアウト</span>
                            </button>
                            
                            <button 
                                className="modal-action-button delete"
                                onClick={() => {
                                    setShowAccountModal(false);
                                    setShowModal(true);
                                }}
                            >
                                <span>アカウント削除</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        
            {/* サイドバー - PCのみ表示 */}
            <div className={`sidebar ${propIsOpen ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
                {/* ロゴ部分 - クリックでホームに遷移 */}
                <Link to="/home" className="logo">
                    <img src={Image_logo} alt="ロゴ" />
                </Link>
                
                {/* ナビゲーションリンク */}
                <ul className="nav-links">
                    <li>
                        <Link 
                            to="/home" 
                            className={isActive("/home") ? "active" : ""}
                        >
                            <div className="sidebar-nav-item">
                                <img src={IconHome} alt="ホーム" className="sidebar-icon" />
                                <span className="nav-text">ホーム</span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/search" 
                            className={isActive("/search") ? "active" : ""}
                        >
                            <div className="sidebar-nav-item">
                                <img src={IconSearch} alt="お寺を探す" className="sidebar-icon" />
                                <span className="nav-text">お寺を探す</span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/policy" 
                            className={isActive("/policy") ? "active" : ""}
                        >
                            <div className="sidebar-nav-item">
                                <img src={IconVote} alt="運営方針" className="sidebar-icon" />
                                <span className="nav-text">運営方針</span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/payment" 
                            className={isActive("/payment") ? "active" : ""}
                        >
                            <div className="sidebar-nav-item">
                                <img src={IconWallet} alt="運営収支" className="sidebar-icon" />
                                <span className="nav-text">運営収支</span>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/offering" 
                            className={isActive("/offering") ? "active" : ""}
                        >
                            <div className="sidebar-nav-item">
                                <img src={IconOffering} alt="御布施" className="sidebar-icon" />
                                <span className="nav-text">御布施</span>
                            </div>
                        </Link>
                    </li>
                </ul>
                
                {/* サイドバー折りたたみボタン - 下部に配置 */}
                <button 
                    className="collapse-toggle"
                    onClick={toggleSidebar}
                    aria-label={isCollapsed ? "展開する" : "折りたたむ"}
                >
                    <img 
                        src={isCollapsed ? IconRightArrow : IconLeftArrow} 
                        alt={isCollapsed ? "展開" : "折りたたみ"} 
                        className="collapse-icon" 
                    />
                </button>
            </div>
            
            {/* アカウント削除確認モーダル */}
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
            
            {/* モバイル用ボトムナビゲーション */}
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
                    to="/policy" 
                    className={`mobile-nav-item ${isActive("/policy") ? "active" : ""}`}
                >
                    <img 
                        src={IconVote} 
                        alt="運営方針" 
                        className="mobile-nav-icon"
                    />
                    <span>運営方針</span>
                </Link>
                <Link 
                    to="/payment" 
                    className={`mobile-nav-item ${isActive("/payment") ? "active" : ""}`}
                >
                    <img 
                        src={IconWallet} 
                        alt="運営収支" 
                        className="mobile-nav-icon"
                    />
                    <span>運営収支</span>
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
            </div>
        </>
    );
}

export default Sidebar;
