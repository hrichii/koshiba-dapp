import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import "./MainPage.css";
// バックエンドのモジュールをインポート
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";

import templeIcon from "./img/templeIcon.jpg";
import rankIcon from "./img/rankIcon.jpg";
import voteIcon from "./img/voteIcon.jpg";

/**
 * 数字を 0 から value までアニメーションしながら表示するコンポーネント
 * @param {number} value - 最終的な数値
 * @param {number} duration - アニメーション時間 (ms)
 * @param {string} suffix - 単位（例: "票"）
 */
function AnimatedNumber({ value, duration = 1500, suffix = "" }) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrameId;

    function animate(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newValue = progress * value;
      setCurrentValue(newValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  const displayValue = Math.floor(currentValue);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}

// ユーザー登録案内モーダルコンポーネント
function UserRegistrationModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>ユーザー登録が必要です</h2>
        <p>アプリを利用するにはユーザー登録が必要です。</p>
        <p>登録画面に移動して、必要な情報を入力してください。</p>
        
        <div className="button-group">
          <button
            type="button"
            className="register-button"
            onClick={onClose}
          >
            登録画面へ進む
          </button>
        </div>
      </div>
    </div>
  );
}

function MainPage() {
  const navigate = useNavigate();
  
  // 状態変数
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  // 認証チェック中
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  // データ読み込み中
  const [isLoading, setIsLoading] = useState(true);
  // エラーメッセージ
  const [error, setError] = useState("");
  // ユーザー登録モーダルの表示状態
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  
  // 認証状態のチェック
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authClient = await AuthClient.create();
        const authenticated = await authClient.isAuthenticated();
        
        if (!authenticated) {
          // 未認証の場合はログインページにリダイレクト
          navigate("/", { 
            state: { errorMessage: "ログインが必要です。Internet Identityでログインしてください。" } 
          });
          return;
        }
        
        setIsCheckingAuth(false);
        
        // 認証済みの場合はデータを取得
        await fetchData();
      } catch (err) {
        console.error("Auth check failed:", err);
        setError("認証状態の確認中にエラーが発生しました");
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // データ取得処理
  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching user data...");
      
      // ユーザー情報を取得
      const userData = await koshiba_dapp_backend.get_user();
      console.log("Raw user data:", userData);
      
      // バックエンドからの応答が配列や期待しない形式の場合の処理
      let processedUserData = userData;
      if (Array.isArray(userData)) {
        console.log("User data is an array - attempting to extract properties");
        if (userData.length === 0) {
          console.log("Empty array returned - user not found");
          processedUserData = null;
        } else {
          // 配列内の最初の要素を使用するか、必要に応じてマッピング
          processedUserData = userData[0];
        }
      } else if (typeof userData === 'object' && userData !== null && Object.keys(userData).length === 0) {
        console.log("Empty object returned - user not found");
        processedUserData = null;
      }
      
      // 処理したユーザーデータをログ出力
      console.log("Processed user data:", {
        value: processedUserData,
        type: typeof processedUserData,
        isNull: processedUserData === null,
        details: processedUserData ? {
          last_name: processedUserData.last_name,
          first_name: processedUserData.first_name,
          grade: processedUserData.grade,
          temple: processedUserData.temple,
          vote_count: processedUserData.vote_count
        } : 'No user data'
      });
      
      if (!processedUserData) {
        console.log("No valid user data found - continuing with null user data (temporary for testing)");
        // テスト目的のため、ユーザーデータがnullでも続行
        setUser(null);
        
        // イベント一覧を取得 (ユーザーデータがなくても)
        console.log("Fetching events data without user data...");
        const eventsData = await koshiba_dapp_backend.get_user_events();
        console.log("Events data:", eventsData);
        setEvents(eventsData);
        
        setIsLoading(false);
        return;
      }
      
      setUser(processedUserData);
      
      // イベント一覧を取得
      console.log("Fetching events data...");
      const eventsData = await koshiba_dapp_backend.get_user_events();
      console.log("Events data:", eventsData);
      setEvents(eventsData);
      
    } catch (err) {
      console.error("Data fetch error details:", {
        message: err.message,
        stack: err.stack,
        error: err
      });
      setError("データの取得中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };
  
  // 投票処理
  const handleVote = async (eventId, voteStatus) => {
    try {
      const updatedEvent = await koshiba_dapp_backend.update_vote(
        eventId,
        voteStatus
      );
      
      // イベント一覧を更新
      setEvents(events.map(event => 
        event.event_id === eventId ? updatedEvent : event
      ));
    } catch (err) {
      console.error("Vote failed:", err);
      setError("投票処理中にエラーが発生しました");
    }
  };

  // 登録画面へ遷移
  const handleGoToRegister = () => {
    navigate("/register");
  };

  // 認証チェック中またはデータロード中の表示
  if (isCheckingAuth || (isLoading && !showRegistrationModal)) {
    return (
      <div className="loading-container">
        <p>データを読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="container">
      {error && <p className="error-message">{error}</p>}

      {/* ユーザー登録モーダル */}
      {showRegistrationModal && (
        <UserRegistrationModal onClose={handleGoToRegister} />
      )}

      {/* メインコンテンツ (ユーザーデータの有無にかかわらず表示) */}
      <div className="user-info-container">
        {/* ユーザー名 */}
        <h2 className="user-name">
          {user && user.last_name && user.first_name ? 
            `${user.last_name} ${user.first_name}` : 
            "ゲストユーザー"}
        </h2>

        <div className="user-details">
          {/* 所属寺院 */}
          <div className="detail-item">
            <div className="icon-row">
              <img src={templeIcon} alt="寺院アイコン" className="icon" />
              <span>所属寺院</span>
            </div>
            <span className="status">
              {user && user.temple && user.temple.name ? 
                user.temple.name : 
                "所属寺院なし"}
            </span>
          </div>

          {/* 檀家グレード */}
          <div className="detail-item">
            <div className="icon-row">
              <img src={rankIcon} alt="檀家グレードアイコン" className="icon" />
              <span>檀家グレード</span>
            </div>
            <span className="status">
              {user && user.grade ? 
                `Rank ${Object.keys(user.grade)[0] || "不明"}` : 
                "グレード情報なし"}
            </span>
          </div>

          {/* 所持投票数 */}
          <div className="detail-item">
            <div className="icon-row">
              <img src={voteIcon} alt="投票アイコン" className="icon" />
              <span>所持投票数</span>
            </div>
            <span className="status">
              {user && user.vote_count !== undefined ? 
                `${user.vote_count}票` : 
                "0票"}
            </span>
          </div>
        </div>
      </div>

      <hr />

      {/* 見出し */}
      <h3 className="policy-title">
        {user && user.temple ? 
          `${user.temple.name}の運営方針` : 
          "お寺の運営方針"}
      </h3>

      {/* イベントをまとめるコンテナ */}
      <div className="policy-container">
        {events.length > 0 ? (
          events.map((event) => {
            const unvoted = event.vote.total - (event.vote.agree + event.vote.disagree);
            // ステータスバーの幅(%)を計算
            const agreeWidth =
              event.vote.total > 0 ? (event.vote.agree / event.vote.total) * 100 : 0;
            const disagreeWidth =
              event.vote.total > 0 ? (event.vote.disagree / event.vote.total) * 100 : 0;
            const noneWidth =
              event.vote.total > 0 ? (unvoted / event.vote.total) * 100 : 0;

            return (
              <div className="policy-item" key={event.event_id}>
                <h3>{event.title}</h3>
                <p>{event.content}</p>

                {/* ステータスバー */}
                <div className="status-bar-container">
                  <div className="status-bar">
                    <div
                      className="agree bar" 
                      style={{ "--final-width": `${agreeWidth}%` }}
                    />
                    <div
                      className="disagree bar"
                      style={{ "--final-width": `${disagreeWidth}%` }}
                    />
                    <div
                      className="none bar"
                      style={{ "--final-width": `${noneWidth}%` }}
                    />
                  </div>

                  {/* 賛成・反対・未投票の「票数」を表示 */}
                  <div className="ratio-text">
                    <span className="ratio-agree">
                      賛成: <AnimatedNumber value={event.vote.agree} suffix="票" />
                    </span>
                    {" / "}
                    <span className="ratio-disagree">
                      反対: <AnimatedNumber value={event.vote.disagree} suffix="票" />
                    </span>
                    {" / "}
                    <span className="ratio-none">
                      未投票: <AnimatedNumber value={unvoted} suffix="票" />
                    </span>
                  </div>
                </div>

                {/* 投票ボタン */}
                <button 
                  className="vote-button agree-btn"
                  onClick={() => handleVote(event.event_id, { Agree: null })}
                  disabled={!user || user.vote_count === 0 || (event.your_vote && Object.keys(event.your_vote)[0] === "Agree")}
                >
                  {user ? (user.vote_count > 0 ? `${user.vote_count}票 賛成に入れる` : "投票権がありません") : "ログイン後に投票できます"}
                </button>
                <button 
                  className="vote-button disagree-btn"
                  onClick={() => handleVote(event.event_id, { Disagree: null })}
                  disabled={!user || user.vote_count === 0 || (event.your_vote && Object.keys(event.your_vote)[0] === "Disagree")}
                >
                  {user ? (user.vote_count > 0 ? `${user.vote_count}票 反対に入れる` : "投票権がありません") : "ログイン後に投票できます"}
                </button>
              </div>
            );
          })
        ) : (
          <p className="no-events">現在、投票できるイベントはありません</p>
        )}
      </div>
    </div>
  );
}

export default MainPage;
