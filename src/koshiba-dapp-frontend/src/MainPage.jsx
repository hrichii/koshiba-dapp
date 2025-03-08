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
    setError(null);
    
    try {
      // ユーザー情報を取得
      let userData = await koshiba_dapp_backend.get_user();
      console.log("User data:", userData);
      
      // ユーザーデータが配列の場合、最初の要素を取得
      if (Array.isArray(userData)) {
        if (userData.length > 0) {
          userData = userData[0];
        } else {
          userData = null;
        }
      }
      
      if (userData) {
        let temple_name = "所属寺院なし";
        
        // templeプロパティが配列として存在する場合
        if (Array.isArray(userData.temple) && userData.temple.length > 0) {
          // temple_idが0の場合は「所属寺院なし」のままにする
          if (userData.temple[0].id !== 0) {
            temple_name = userData.temple[0].name || "不明";
            console.log("Temple data from user object:", userData.temple[0]);
          }
        }
        // temple_idが存在する場合は、従来通り寺院情報を取得
        else if (userData.temple_id !== undefined && userData.temple_id !== 0) {
          try {
            const templeData = await koshiba_dapp_backend.get_temple(userData.temple_id);
            console.log("Temple data from API:", templeData);
            temple_name = templeData ? templeData.name : "不明";
          } catch (templeError) {
            console.error("Failed to fetch temple data:", templeError);
          }
        }
        
        // 檀家グレードに応じた投票権を設定
        let vote_count = userData.vote_count || 0;
        
        // グレードが存在する場合、グレードに応じた投票権を設定
        if (userData.grade) {
          const grade = Object.keys(userData.grade)[0];
          switch (grade) {
            case 'S':
              vote_count = 25;
              break;
            case 'A':
              vote_count = 15;
              break;
            case 'B':
              vote_count = 10;
              break;
            case 'C':
              vote_count = 5;
              break;
            case 'D':
              vote_count = 3;
              break;
            default:
              vote_count = 1;
          }
        }
        
        // ユーザー情報をセット
        setUser({
          ...userData,
          temple_name: temple_name,
          vote_count: vote_count
        });
      } else {
        setUser(null);
        setShowRegistrationModal(true);
      }
      
      // イベント情報を取得
      const eventsData = await koshiba_dapp_backend.get_user_events();
      console.log("Events data:", eventsData);
      
      // イベントデータがある場合は各イベントの投票状態をクリアする
      const processedEvents = eventsData 
        ? eventsData.map(event => ({
            ...event,
            your_vote: undefined // 初期状態では投票済みフラグをクリア
          })) 
        : [];
      
      setEvents(processedEvents);
      
    } catch (error) {
      console.error("Data fetch error:", error);
      setError("データの取得に失敗しました");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 投票処理
  const handleVote = async (eventId, voteStatus) => {
    try {
      console.log(`投票処理: イベントID=${eventId}, 投票=${JSON.stringify(voteStatus)}`);
      
      // バックエンドの投票処理を呼び出す
      const updatedEvent = await koshiba_dapp_backend.update_vote(
        eventId,
        voteStatus
      );
      
      console.log("投票結果:", updatedEvent);
      
      // バックエンドからの応答がない場合は、フロントエンドでモックデータを使用
      if (!updatedEvent) {
        // 現在のイベントを取得
        const currentEvent = events.find(e => e.event_id === eventId);
        if (!currentEvent) return;
        
        // 投票状態に応じてカウントを更新
        const updatedVote = { ...currentEvent.vote };
        
        if (voteStatus.Agree !== undefined) {
          updatedVote.agree += user.vote_count || 1;
        } else if (voteStatus.Disagree !== undefined) {
          updatedVote.disagree += user.vote_count || 1;
        }
        
        // イベント一覧を更新（該当するイベントにのみ投票済みフラグを設定）
        setEvents(events.map(event => 
          event.event_id === eventId 
            ? {
                ...event,
                vote: updatedVote,
                your_vote: voteStatus
              } 
            : event
        ));
      } else {
        // バックエンドからの応答がある場合はそれを使用（該当するイベントにのみ投票済みフラグを設定）
        setEvents(events.map(event => 
          event.event_id === eventId ? updatedEvent : event
        ));
      }
      
      // 投票後もユーザーの投票権を維持する（減らさない）
      // 檀家グレードに応じた投票権は固定値として保持
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
      <div className={`user-info-container ${user && user.grade ? `user-info-container-${Object.keys(user.grade)[0] || ""}` : ""}`}>
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
              {user && user.temple_name ? 
                user.temple_name : 
                "所属寺院なし"}
            </span>
          </div>

          {/* 檀家グレード */}
          <div className="detail-item">
            <div className="icon-row">
              <img src={rankIcon} alt="檀家グレードアイコン" className="icon" />
              <span>檀家グレード</span>
            </div>
            <span className={`status ${user && user.grade ? `grade-status-${Object.keys(user.grade)[0] || ""}` : ""}`}>
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
        {user && user.temple_name ? 
          `${user.temple_name}の運営方針` : 
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
                  disabled={!user || user.vote_count <= 0 || event.your_vote !== undefined}
                >
                  {event.your_vote !== undefined 
                    ? "投票済み" 
                    : user 
                      ? (user.vote_count > 0 
                        ? `${user.vote_count}票 賛成に入れる` 
                        : "投票権がありません") 
                      : "ログイン後に投票できます"}
                </button>
                <button 
                  className="vote-button disagree-btn"
                  onClick={() => handleVote(event.event_id, { Disagree: null })}
                  disabled={!user || user.vote_count <= 0 || event.your_vote !== undefined}
                >
                  {event.your_vote !== undefined 
                    ? "投票済み" 
                    : user 
                      ? (user.vote_count > 0 
                        ? `${user.vote_count}票 反対に入れる` 
                        : "投票権がありません") 
                      : "ログイン後に投票できます"}
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
