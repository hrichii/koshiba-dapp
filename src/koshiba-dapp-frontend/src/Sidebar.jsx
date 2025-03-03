import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";
import "./Sidebar.css"; // ★ サイドバー専用のCSSを読み込む
import Image_koshiba from "./img/koshiba.jpg";
import Image_logo from "./img/logo.jpg";

function Sidebar() {
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // get_user() を呼び出してユーザー情報を取得
    useEffect(() => {
        async function fetchUser() {
        try {
            const userData = await koshiba_dapp_backend.get_user();
            setUser(userData);
        } catch (error) {
            console.error("ユーザー情報取得中にエラーが発生しました:", error);
        }
        }
        fetchUser();
    }, []);

    const handleDeleteUser = async () => {
        try {
        await koshiba_dapp_backend.delete_user();
        // ユーザー削除後、ログイン画面（"/"）へ遷移
        navigate("/");
        } catch (error) {
        console.error("ユーザー削除中にエラーが発生しました:", error);
        }
    };

    return (
        <div className="sidebar">
        {/* ロゴ部分 */}
        <div className="logo">
            <img src={Image_logo} alt="ロゴ" />
        </div>

        {/* ナビゲーションリンク */}
        <ul className="nav-links">
            <li><Link to="/home">ホーム</Link></li>
            <li><Link to="/search">お寺を探す</Link></li>
            <li><Link to="/participate">寺運営に参加</Link></li>
            <li><Link to="/notifications">お知らせ</Link></li>
        </ul>

        {/* アカウント情報 */}
        <div className="account-section">
            <div className="account-info-row">
            <img src={Image_koshiba} alt="小柴" />
            {/* ユーザー情報が取得できたら、last_nameとfirst_nameを結合して表示 */}
            <Link to="/account">
                {user ? user.last_name + user.first_name : "Loading..."}
            </Link>
            </div>
            {/* ログアウト・アカウント削除 */}
            <ul className="account-menu">
            <li><Link to="/">ログアウト</Link></li>
            <li>
                <button 
                className="delete-account-button" 
                onClick={() => setShowModal(true)}
                >
                アカウント削除
                </button>
            </li>
            </ul>
        </div>

        {/* モーダル表示 */}
        {showModal && (
            <div className="modal-overlay">
            <div className="modal">
                <p>本当にアカウントを削除しますか？</p>
                <div className="modal-buttons">
                <button onClick={() => setShowModal(false)}>キャンセル</button>
                <button onClick={handleDeleteUser}>削除</button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
}

export default Sidebar;
