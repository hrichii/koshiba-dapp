import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { koshiba_dapp_backend } from "../../../declarations/koshiba-dapp-backend";
import "./NotificationDetail.css";

// お知らせ詳細ページの基本テンプレート
function NotificationDetail({ 
  title, 
  content, 
  requiredGrade = "D", // グレード表示のために残す
  headerImage,
  category,
  date,
  breadcrumbs = [
    { name: "お知らせ一覧", path: "/notification" }
  ]
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const contentRef = useRef(null);

  // 認証チェックとユーザーデータの取得
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // 認証状態の確認
        const authClient = await AuthClient.create();
        const authenticated = await authClient.isAuthenticated();
        
        if (!authenticated) {
          // 未認証の場合はログインページにリダイレクト
          navigate("/", { 
            state: { errorMessage: "ログインが必要です。Internet Identityでログインしてください。" } 
          });
          return;
        }
        
        // ユーザー情報を取得
        try {
          console.log("NotificationDetail: Trying to fetch user data...");
          const userData = await koshiba_dapp_backend.getMe();
          console.log("NotificationDetail: Raw user data:", userData);
          
          if (userData) {
            setUser(userData);
          } else {
            console.log("NotificationDetail: No user data returned");
            setUser(null);
          }
        } catch (fetchErr) {
          console.error("NotificationDetail: Error fetching user data:", fetchErr);
          console.error("NotificationDetail: Error details:", fetchErr.message, fetchErr.stack);
          setUser(null);
        }
        
      } catch (err) {
        console.error("Error during initialization:", err);
        setError("初期化中にエラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthAndFetchData();
  }, [navigate, requiredGrade]);

  useEffect(() => {
    // コンテンツがロードされた後にスクロール位置をトップに
    if (contentRef.current) {
      window.scrollTo(0, 0);
    }
  }, [title]);

  // カテゴリに対応する色を取得
  const getCategoryColor = (category) => {
    if (!category) return "";
    
    switch (category) {
      case 'お知らせ':
        return 'category-notice';
      case 'イベント':
        return 'category-event';
      case 'サービス':
        return 'category-service';
      case '特典':
        return 'category-benefit';
      default:
        return 'category-default';
    }
  };

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="loading-container">
        <p>データを読み込み中...</p>
      </div>
    );
  }

  // アクセス制限チェックを廃止し、常にコンテンツを表示する
  return (
    <div className="notification-detail-page" ref={contentRef}>
      <div className="breadcrumbs">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span className="breadcrumb-item" onClick={() => navigate(crumb.path)}>
              {crumb.name}
            </span>
            {index < breadcrumbs.length - 1 && <span className="breadcrumb-separator">›</span>}
          </React.Fragment>
        ))}
      </div>
      
      {error && <p className="error-message">{error}</p>}
      
      <div className="notification-meta">
        {category && (
          <span className={`category-tag ${getCategoryColor(category)}`}>
            {category}
          </span>
        )}
        {date && <span className="notification-date">{date}</span>}
      </div>
      
      <h1 className="detail-title">{title}</h1>
      
      {headerImage && (
        <div className="header-image">
          <img src={headerImage} alt={title} />
        </div>
      )}
      
      <div className="detail-content">
        {content}
      </div>
      
      <div className="action-buttons">
        <button className="back-button" onClick={() => {
          navigate("/notification", { 
            state: { 
              preserveFilter: true 
            }
          });
        }}>
          一覧に戻る
        </button>
      </div>
    </div>
  );
}

export default NotificationDetail; 