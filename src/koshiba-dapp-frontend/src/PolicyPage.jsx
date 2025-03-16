import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import "./PolicyPage.css";
// バックエンドのモジュールをインポート
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";

import IconAccount from "./img/account.png";

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

/**
 * カウントダウンコンポーネント
 * @param {string} deadlineAt - 締め切り日時（ISO 8601形式）
 */
function Countdown({ deadlineAt }) {
  const [timeRemaining, setTimeRemaining] = useState("");
  
  useEffect(() => {
    if (!deadlineAt) return;
    
    const calculateTimeRemaining = () => {
      const now = new Date();
      const deadline = new Date(deadlineAt);
      const diff = deadline.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining("締め切り済み");
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining(`締切まで${days}日${hours}時間${minutes}分${seconds}秒`);
    };
    
    calculateTimeRemaining();
    // 1秒ごとに更新
    const interval = setInterval(calculateTimeRemaining, 1000);
    
    return () => clearInterval(interval);
  }, [deadlineAt]);
  
  return <span>{timeRemaining}</span>;
}

function PolicyPage() {
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
  // アカウントモーダルの表示状態
  const [showAccountModal, setShowAccountModal] = useState(false);
  // Principal ID
  const [principalId, setPrincipalId] = useState("");
  
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
        
        // Principal IDを取得
        try {
          const principal = await koshiba_dapp_backend.getPrincipalDebug();
          setPrincipalId(principal);
        } catch (error) {
          console.error("Principal IDの取得に失敗しました:", error);
        }
        
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
    
    if (yourVote.Agree !== undefined && yourVote.Agree !== null) {
      return "賛成しました";
    } else if (yourVote.Disagree !== undefined && yourVote.Disagree !== null) {
      return "反対しました";
    }
    
    return null;
  };
  
  // ログアウト処理
  const handleLogout = async () => {
    try {
      // AuthClientのインスタンスを取得
      const authClient = await AuthClient.create();
      
      // Internet Identityからログアウト
      await authClient.logout();
      
      // ログアウト後にログイン画面に遷移
      navigate("/");
      
      console.log("ログアウトが完了しました");
      
      // モーダルを閉じる
      setShowAccountModal(false);
    } catch (error) {
      console.error("ログアウト中にエラーが発生しました:", error);
    }
  };
  
  // アカウント削除処理
  const handleDeleteUser = async () => {
    try {
      await koshiba_dapp_backend.deleteMe();
      // ユーザー削除後、ログイン画面へ遷移
      navigate("/");
    } catch (error) {
      console.error("ユーザー削除中にエラーが発生しました:", error);
    }
  };

  // ローディング表示
  if (isLoading) {
    return (
      <div className="loading-container">
        <p>データを読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="container">
      {error && <p className="error-message">{error}</p>}

      {/* アカウントアイコンボタン */}
      <button 
        className={`account-icon-button ${showAccountModal ? 'active' : ''}`}
        onClick={() => setShowAccountModal(!showAccountModal)}
      >
        <img src={IconAccount} alt="アカウント" />
      </button>
      
      {/* アカウントモーダル */}
      {showAccountModal && (
        <div className="account-modal-overlay" onClick={() => setShowAccountModal(false)}>
          <div className="account-modal" onClick={(e) => e.stopPropagation()}>
            <div className="account-modal-header">
              <h3 className="account-modal-title">アカウント情報</h3>
            </div>
            
            <div className="principal-id-container">
              <p className="principal-id-label">Principal ID</p>
              <p className="principal-id">{principalId || "読み込み中..."}</p>
            </div>
            
            <div className="account-modal-actions">
              <button 
                className="modal-action-button logout"
                onClick={handleLogout}
              >
                <span>ログアウト</span>
              </button>
              
              <button 
                className="modal-action-button delete"
                onClick={handleDeleteUser}
              >
                <span>アカウント削除</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
            const total = vote.total || (vote.agree + vote.disagree);
            
            // 投票タイプのテキスト（賛成/反対）
            const voteTypeText = getVoteTypeText(event.your_vote);
            // 投票済みかどうか
            const hasVoted = event.your_vote !== undefined && 
              (event.your_vote.Agree !== undefined || event.your_vote.Disagree !== undefined);
            
            // 比率計算
            const yesProportion = total > 0 ? vote.agree / total : 0;
            const noProportion = total > 0 ? vote.disagree / total : 0;
            
            // マジョリティの閾値（サンプル値）
            const immediateMajorityPercent = 66; // 即時決定の閾値
            const standardMajorityPercent = 50;  // 標準決定の閾値

            return (
              <div className="policy-item" key={event.event_id}>
                <h3>{event.title}</h3>
                <p>{event.content}</p>
                
                {/* 締め切り時間 */}
                <RemainingTime deadlineAt={event.deadline_at} />

                {/* 投票結果表示 - 新デザイン */}
                <div className="voting-results">
                  <h2 className="voting-results-title">投票結果</h2>
                  
                  <div className="voting-stats" 
                       style={{
                         '--immediate-majority': `${immediateMajorityPercent}%`,
                         '--standard-majority': `${standardMajorityPercent}%`
                       }}>
                    {/* 賛成パーセンテージ */}
                    <div className="voting-column yes-column">
                      <span className="vote-label">賛成</span>
                      <span className="vote-percentage">
                        {(yesProportion * 100).toFixed(3)}%
                      </span>
                    </div>
                    
                    {/* 反対パーセンテージ */}
                    <div className="voting-column no-column">
                      <span className="vote-label">反対</span>
                      <span className="vote-percentage">
                        {(noProportion * 100).toFixed(3)}%
                      </span>
                    </div>
                    
                    {/* プログレスバーとマジョリティマーカー */}
                    <div className="voting-progress-container">
                      {/* 即時マジョリティのマーカー */}
                      <div className="majority immediate-majority">
                        <div className="majority-icon immediate-majority"></div>
                      </div>
                      
                      {/* 標準マジョリティのマーカー */}
                      <div className="majority standard-majority">
                        <div className="majority-icon standard-majority"></div>
                      </div>
                      
                      {/* プログレスバー - 賛成は左から、反対は右から伸びる */}
                      <div className="progressbar" role="progressbar" aria-label="投票進捗">
                        {/* 賛成票のバー - 左から伸びる */}
                        <div 
                          className="voting-progress-bar yes-bar" 
                          style={{ width: `${yesProportion * 100}%` }}
                        ></div>
                        
                        {/* 反対票のバー - 右から伸びる */}
                        <div 
                          className="voting-progress-bar no-bar" 
                          style={{ width: `${noProportion * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* 賛成の投票力 */}
                    <div className="voting-power yes-power">
                      <span>
                        <span className="yes">{vote.agree.toLocaleString()}</span>
                        <span className="label description">投票力</span>
                      </span>
                    </div>
                    
                    {/* 期限表示 */}
                    <div className="voting-expiration">
                      <p>期限</p>
                      <div>
                        <Countdown deadlineAt={event.deadline_at} />
                      </div>
                    </div>
                    
                    {/* 反対の投票力 */}
                    <div className="voting-power no-power">
                      <span>
                        <span className="no">{vote.disagree.toLocaleString()}</span>
                        <span className="label description">投票力</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* マジョリティ説明セクション */}
                  <div className="votes-results-legends">
                    <h3>決定条件</h3>
                    <ol>
                      <li>
                        <h4>即時多数決</h4>
                        <p>投票の66%以上が賛成の場合、即時に決定されます。</p>
                      </li>
                      <li>
                        <h4>標準多数決</h4>
                        <p>期限までに賛成が50%を超えた場合に決定されます。</p>
                      </li>
                    </ol>
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
                
                {/* 未投票の場合のみ投票ボタンを表示 */}
                {!hasVoted && (
                  <div className="vote-buttons">
                    <button
                      className="vote-button agree-btn"
                      onClick={() => handleVote(event.event_id, { Agree: null })}
                      disabled={!user || user.vote_count <= 0 || hasVoted}
                    >
                      賛成
                    </button>
                    <button
                      className="vote-button disagree-btn"
                      onClick={() => handleVote(event.event_id, { Disagree: null })}
                      disabled={!user || user.vote_count <= 0 || hasVoted}
                    >
                      反対
                    </button>
                  </div>
                )}
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

export default PolicyPage;
