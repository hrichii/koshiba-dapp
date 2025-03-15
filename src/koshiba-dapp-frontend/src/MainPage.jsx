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

/**
 * 締め切りまでの残り時間を計算して表示するコンポーネント
 * @param {string} deadlineAt - 締め切り日時（ISO 8601形式）
 */
function RemainingTime({ deadlineAt }) {
  const [remainingTime, setRemainingTime] = useState("");
  
  useEffect(() => {
    // 締め切り日時が存在しない場合
    if (!deadlineAt) {
      setRemainingTime("締め切り日時未設定");
      return;
    }
    
    // 残り時間を計算する関数
    const calculateRemainingTime = () => {
      try {
        // 日時文字列をDateオブジェクトに変換
        const deadline = new Date(deadlineAt);
        const now = new Date();
        
        // 日時が不正な場合
        if (isNaN(deadline.getTime())) {
          setRemainingTime("締め切り日時不正");
          return;
        }
        
        // 残り時間（ミリ秒）
        const diff = deadline.getTime() - now.getTime();
        
        // 締め切り済みの場合
        if (diff <= 0) {
          setRemainingTime("締め切り済み");
          return;
        }
        
        // 残り時間を計算
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        // 表示形式を整形
        setRemainingTime(`あと${days}日${hours}時間${minutes}分で締め切り`);
      } catch (error) {
        console.error("締め切り時間の計算エラー:", error);
        setRemainingTime("締め切り日時エラー");
      }
    };
    
    // 初回計算
    calculateRemainingTime();
    
    // 1分ごとに更新
    const intervalId = setInterval(calculateRemainingTime, 60000);
    
    // クリーンアップ
    return () => clearInterval(intervalId);
  }, [deadlineAt]);
  
  return (
    <div className="remaining-time">
      <span className="time-icon">⏱</span>
      <span className="time-text">{remainingTime}</span>
    </div>
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
      let userData = await koshiba_dapp_backend.getMe();
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
      const eventsData = await koshiba_dapp_backend.getMyEventList();
      console.log("Events data:", eventsData);
      
      // イベントデータを処理
      const processedEvents = eventsData 
        ? eventsData.map(event => {
            // 各イベントを処理
            const processedEvent = processEventData(event);
            
            // イベントの投票情報がある場合、your_voteプロパティを適切に設定
            // ※バックエンドから返されたデータにすでに含まれている場合はそのまま使用
            if (processedEvent.your_vote === undefined) {
              console.log(`Event ${processedEvent.event_id} has no your_vote information.`);
            } else {
              console.log(`Event ${processedEvent.event_id} has your_vote:`, processedEvent.your_vote);
            }
            
            return processedEvent;
          }) 
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
      const updatedEvent = await koshiba_dapp_backend.updateMyVote(
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
        // バックエンドからの応答がある場合はそれを使用
        // 返されたデータに必要なプロパティが含まれているか確認
        const processedEvent = processEventData(updatedEvent);
        
        // イベント一覧を更新（該当するイベントにのみ投票済みフラグを設定）
        setEvents(events.map(event => 
          event.event_id === eventId ? processedEvent : event
        ));
      }
      
      // 投票後もユーザーの投票権を維持する（減らさない）
      // 檀家グレードに応じた投票権は固定値として保持
    } catch (err) {
      console.error("Vote failed:", err);
      setError("投票処理中にエラーが発生しました");
    }
  };

  // イベントデータを処理し、必要なプロパティが存在することを確認する関数
  const processEventData = (event) => {
    // イベントがない場合は空のオブジェクトを返す
    if (!event) return {};
    
    // 配列の場合は最初の要素を取得
    const eventData = Array.isArray(event) ? event[0] : event;
    
    // voteプロパティが存在しない場合はデフォルト値を設定
    if (!eventData.vote) {
      eventData.vote = {
        agree: 0,
        disagree: 0,
        total: 0
      };
    }
    
    // voteプロパティのフィールドが存在しない場合はデフォルト値を設定
    if (eventData.vote && typeof eventData.vote === 'object') {
      if (eventData.vote.agree === undefined) eventData.vote.agree = 0;
      if (eventData.vote.disagree === undefined) eventData.vote.disagree = 0;
      if (eventData.vote.total === undefined) {
        // totalが未定義の場合、agree + disagreeを設定
        eventData.vote.total = eventData.vote.agree + eventData.vote.disagree;
      }
    }
    
    return eventData;
  };

  // 投票タイプを表示するための関数
  const getVoteTypeText = (yourVote) => {
    if (!yourVote) return null;
    
    if (yourVote.Agree !== undefined) {
      return "賛成しました";
    } else if (yourVote.Disagree !== undefined) {
      return "反対しました";
    }
    
    return null;
  };

  // 登録画面へ遷移
  const handleGoToRegister = () => {
    navigate("/register");
  };

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
            // voteプロパティが存在することを確認
            const vote = event.vote || { agree: 0, disagree: 0, total: 0 };
            const unvoted = vote.total - (vote.agree + vote.disagree);
            
            // ステータスバーの幅(%)を計算
            const agreeWidth =
              vote.total > 0 ? (vote.agree / vote.total) * 100 : 0;
            const disagreeWidth =
              vote.total > 0 ? (vote.disagree / vote.total) * 100 : 0;
            const noneWidth =
              vote.total > 0 ? (unvoted / vote.total) * 100 : 0;
            
            // 投票タイプのテキスト（賛成/反対）
            const voteTypeText = getVoteTypeText(event.your_vote);
            // 投票済みかどうか
            const hasVoted = event.your_vote !== undefined;

            return (
              <div className="policy-item" key={event.event_id}>
                <h3>{event.title}</h3>
                <p>{event.content}</p>
                
                {/* 締め切り時間 */}
                <RemainingTime deadlineAt={event.deadline_at} />

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
                      賛成: <AnimatedNumber value={vote.agree} suffix="票" />
                    </span>
                    <span className="separator">/</span>
                    <span className="ratio-disagree">
                      反対: <AnimatedNumber value={vote.disagree} suffix="票" />
                    </span>
                    <span className="separator">/</span>
                    <span className="ratio-none">
                      未投票: <AnimatedNumber value={unvoted} suffix="票" />
                    </span>
                  </div>
                </div>
                
                {/* 投票済みの場合、投票タイプ（賛成/反対）を表示 */}
                {hasVoted && voteTypeText && (
                  <div className={`vote-status ${event.your_vote.Agree !== undefined ? 'voted-agree' : 'voted-disagree'}`}>
                    <span className="vote-status-icon">
                      {event.your_vote.Agree !== undefined ? '👍' : '👎'}
                    </span>
                    <span className="vote-status-text">{voteTypeText}</span>
                  </div>
                )}

                {/* 投票ボタン */}
                <button 
                  className="vote-button agree-btn"
                  onClick={() => handleVote(event.event_id, { Agree: null })}
                  disabled={!user || user.vote_count <= 0 || hasVoted}
                >
                  {hasVoted 
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
                  disabled={!user || user.vote_count <= 0 || hasVoted}
                >
                  {hasVoted 
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
