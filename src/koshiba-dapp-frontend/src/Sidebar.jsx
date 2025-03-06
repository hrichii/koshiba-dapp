import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";
import "./Sidebar.css"; // ★ サイドバー専用のCSSを読み込む
import Image_koshiba from "./img/koshiba.jpg";
import Image_logo from "./img/logo.jpg";

function Sidebar() {
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // get_user() を呼び出してユーザー情報を取得
    useEffect(() => {
        async function fetchUser() {
            setIsLoading(true);
            try {
                const userData = await koshiba_dapp_backend.get_user();
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
            await koshiba_dapp_backend.delete_user();
            // ユーザー削除後、ログイン画面（"/"）へ遷移
            navigate("/");
        } catch (error) {
            console.error("ユーザー削除中にエラーが発生しました:", error);
        }
    };

    // ユーザー登録画面へ遷移
    const handleGoToRegister = () => {
        navigate("/register");
        setSidebarOpen(false); // モバイルではサイドバーを閉じる
    };

    // サイドバーの開閉を切り替え
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // ナビゲーションリンクをクリックしたときの処理
    const handleNavLinkClick = () => {
        // モバイルではナビゲーションリンククリック時にサイドバーを閉じる
        if (window.innerWidth < 992) {
            setSidebarOpen(false);
        }
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

    return (
        <>
            {/* ハンバーガーメニューボタン（モバイル用） */}
            <button 
                className="menu-toggle"
                onClick={toggleSidebar}
                aria-label="メニューを開く"
            >
                ☰
            </button>
            
            {/* サイドバーオーバーレイ（モバイル用） */}
            <div 
                className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
            ></div>
            
            {/* サイドバー */}
            <div className={`sidebar ${sidebarOpen ? 'active' : ''}`}>
                {/* ロゴ部分 */}
                <div className="logo">
                    <img src={Image_logo} alt="ロゴ" />
                </div>

                {/* ナビゲーションリンク */}
                <ul className="nav-links">
                    <li>
                        <Link 
                            to="/home" 
                            className={isActive("/home") ? "active" : ""}
                            onClick={handleNavLinkClick}
                        >
                            ホーム
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/search" 
                            className={isActive("/search") ? "active" : ""}
                            onClick={handleNavLinkClick}
                        >
                            お寺を探す
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/participate" 
                            className={isActive("/participate") ? "active" : ""}
                            onClick={handleNavLinkClick}
                        >
                            寺運営に参加
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to="/notifications" 
                            className={isActive("/notifications") ? "active" : ""}
                            onClick={handleNavLinkClick}
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
                            <li><Link to="/" onClick={handleNavLinkClick}>ログアウト</Link></li>
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
            
            {/* モバイル用ボトムナビゲーション */}
            <div className="mobile-nav">
                <Link 
                    to="/home" 
                    className={`mobile-nav-item ${isActive("/home") ? "active" : ""}`}
                >
                    <span className="mobile-nav-icon">🏠</span>
                    <span>ホーム</span>
                </Link>
                <Link 
                    to="/search" 
                    className={`mobile-nav-item ${isActive("/search") ? "active" : ""}`}
                >
                    <span className="mobile-nav-icon">🔍</span>
                    <span>お寺を探す</span>
                </Link>
                <Link 
                    to="/participate" 
                    className={`mobile-nav-item ${isActive("/participate") ? "active" : ""}`}
                >
                    <span className="mobile-nav-icon">👥</span>
                    <span>参加</span>
                </Link>
                <Link 
                    to="/notifications" 
                    className={`mobile-nav-item ${isActive("/notifications") ? "active" : ""}`}
                >
                    <span className="mobile-nav-icon">🔔</span>
                    <span>お知らせ</span>
                </Link>
            </div>
        </>
    );
}

export default Sidebar;
