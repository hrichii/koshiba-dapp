// App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./ThemeStyles.css"; // テーマスタイルをインポート
import LoginPage from "./LoginPage";
import MainPage from "./MainPage";
import RegisterPage from "./RegisterPage";
import SearchTemplePage from "./SearchTemplePage";
import NotificationPage from "./NotificationPage";
import AccountInfoPage from "./AccountInfoPage";
import OfferingPage from "./OfferingPage"; // 御布施ページをインポート
import PolicyPage from "./PolicyPage"; // 運営方針ページをインポート
import PrayerService from "./Notification/PrayerService";
import GomakiService from "./Notification/GomakiService";
import BuddhistItemsDiscount from "./Notification/BuddhistItemsDiscount";
import DedicatedParking from "./Notification/DedicatedParking";
import PriorityReservation from "./Notification/PriorityReservation";
import AnnualEvents from "./Notification/AnnualEvents";
import TempleNewsletter from "./Notification/TempleNewsletter";
import YearEndPrayer from "./Notification/YearEndPrayer";
import OssuaryUsage from "./Notification/OssuaryUsage";
import SpecialCeremony from "./Notification/SpecialCeremony";
import PriorityParticipation from "./Notification/PriorityParticipation";
import PurificationService from "./Notification/PurificationService";
import "./App.css"; // 全体レイアウト用
import Sidebar from "./Sidebar"; // ★ Sidebarをインポート
import NotificationDetail from "./Notification/NotificationDetail";

function App() {
  // useState追加: サイドバーの表示状態を管理
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              {/* モバイルヘッダーコンポーネントを削除 */}
              
              {/* サイドバー */}
              <Sidebar isOpen={sidebarOpen} />
              
              <div className="main-content">
                <Routes>
                  <Route path="home" element={<MainPage />} />
                  <Route path="search" element={<SearchTemplePage />} />
                  <Route path="offering" element={<OfferingPage />} />  {/* 御布施ページのルートを追加 */}
                  <Route path="policy" element={<PolicyPage />} />  {/* 運営方針ページのルートを追加 */}
                  <Route path="notification" element={<NotificationPage />} />
                  <Route path="account" element={<AccountInfoPage />} />
                  
                  {/* お知らせ詳細ページ - 固定パス */}
                  <Route path="notification/prayer-service" element={<PrayerService />} />
                  <Route path="notification/gomaki-service" element={<GomakiService />} />
                  <Route path="notification/buddhist-items-discount" element={<BuddhistItemsDiscount />} />
                  <Route path="notification/dedicated-parking" element={<DedicatedParking />} />
                  <Route path="notification/priority-reservation" element={<PriorityReservation />} />
                  <Route path="notification/annual-events" element={<AnnualEvents />} />
                  <Route path="notification/temple-newsletter" element={<TempleNewsletter />} />
                  <Route path="notification/year-end-prayer" element={<YearEndPrayer />} />
                  <Route path="notification/ossuary-usage" element={<OssuaryUsage />} />
                  <Route path="notification/special-ceremony" element={<SpecialCeremony />} />
                  <Route path="notification/priority-participation" element={<PriorityParticipation />} />
                  <Route path="notification/purification-service" element={<PurificationService />} />

                  {/* 動的ルーティングによるお知らせ詳細ページ */}
                  <Route path="notification/notice-prayer-service" element={<PrayerService />} />
                  <Route path="notification/service-gomaki-service" element={<GomakiService />} />
                  <Route path="notification/benefit-buddhist-items-discount" element={<BuddhistItemsDiscount />} />
                  <Route path="notification/benefit-dedicated-parking" element={<DedicatedParking />} />
                  <Route path="notification/benefit-priority-reservation" element={<PriorityReservation />} />
                  <Route path="notification/event-annual-events" element={<AnnualEvents />} />
                  <Route path="notification/notice-temple-newsletter" element={<TempleNewsletter />} />
                  <Route path="notification/event-year-end-prayer" element={<YearEndPrayer />} />
                  <Route path="notification/notice-ossuary-usage" element={<OssuaryUsage />} />
                  <Route path="notification/event-special-ceremony" element={<SpecialCeremony />} />
                  <Route path="notification/benefit-priority-participation" element={<PriorityParticipation />} />
                  <Route path="notification/service-purification-service" element={<PurificationService />} />

                  {/* 汎用的なお知らせ詳細ページのルート */}
                  <Route path="notification/:id" element={<NotificationDetail />} />
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
