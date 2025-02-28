import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MainPage from "./MainPage";
import SearchTemplePage from "./SearchTemplePage";
import ParticipatePage from "./ParticipatePage";
import NotificationPage from "./NotificationPage";
import AccountInfoPage from "./AccountInfoPage";
import "./App.css";

function Sidebar() {
  return (
    <div className="sidebar">
      {/* ロゴ部分 */}
      <div className="logo">DanDan</div>

      {/* ナビゲーションリンク */}
      <ul className="nav-links">
        <li><Link to="/">ホーム</Link></li>
        <li><Link to="/search">お寺を探す</Link></li>
        <li><Link to="/participate">寺運営に参加</Link></li>
        <li><Link to="/notifications">お知らせ</Link></li>
      </ul>

      {/* アカウント情報 */}
      <div className="account-section">
        <Link to="/account">山田太郎</Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/search" element={<SearchTemplePage />} />
            <Route path="/participate" element={<ParticipatePage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/account" element={<AccountInfoPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
