// Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // ★ サイドバー専用のCSSを読み込む
import Image_koshiba from "./img/koshiba.jpg";
import Image_logo from "./img/logo.jpg";

function Sidebar() {
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
            <Link to="/account">小柴太郎</Link>
            </div>
            {/* ログアウト・アカウント削除 */}
            <ul className="account-menu">
            <li><Link to="/">ログアウト</Link></li>
            <li><Link to="#">アカウント削除</Link></li>
            </ul>
        </div>
        </div>
    );
}

export default Sidebar;
