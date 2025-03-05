// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import MainPage from "./MainPage";
import RegisterPage from "./RegisterPage";
import SearchTemplePage from "./SearchTemplePage";
import ParticipatePage from "./ParticipatePage";
import NotificationPage from "./NotificationPage";
import AccountInfoPage from "./AccountInfoPage";
import "./App.css"; // 全体レイアウト用
import Sidebar from "./Sidebar"; // ★ Sidebarをインポート

function App() {
  return (
    <Router>
      <Routes>
        {/* ログインページ（サイドバーなし） */}
        <Route path="/" element={<LoginPage />} />
        {/* 登録ページ（サイドバーなし） */}
        <Route path="/register" element={<RegisterPage />} />

        {/* その他のページ（サイドバーあり） */}
        <Route
          path="/*"
          element={
            <div className="app-container">
              <Sidebar />
              <div className="main-content">
                <Routes>
                  <Route path="home" element={<MainPage />} />
                  <Route path="search" element={<SearchTemplePage />} />
                  <Route path="participate" element={<ParticipatePage />} />
                  <Route path="notifications" element={<NotificationPage />} />
                  <Route path="account" element={<AccountInfoPage />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
