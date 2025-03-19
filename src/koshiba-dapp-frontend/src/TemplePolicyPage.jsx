import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
 * @param {number} decimals - 小数点以下の桁数
 * @param {boolean} useComma - 3桁区切りのカンマを使用するかどうか
 */
function AnimatedNumber({ value, duration = 1500, suffix = "", decimals = 0, useComma = false }) {
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

  // 表示用の値を計算
  let displayValue;
  
  if (decimals > 0) {
    displayValue = currentValue.toFixed(decimals);
  } else {
    displayValue = Math.floor(currentValue);
  }
  
  // 3桁区切りのカンマを追加
  if (useComma) {
    displayValue = Number(displayValue).toLocaleString();
  }

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
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

function TemplePolicyPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // URLパラメータから寺院IDを取得
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const templeIdFromQuery = queryParams.get('templeId'); // クエリパラメータからも寺院IDを取得
  
  // 状態変数
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [temple, setTemple] = useState(null); // 寺院情報
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
  // ユーザーの所属寺院と表示寺院が一致するか
  const [isUserTemple, setIsUserTemple] = useState(false);
  
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
      // URLパラメータとクエリパラメータの両方をチェックして寺院IDを決定
      const templeId = id || templeIdFromQuery;
      
      if (!templeId) {
        throw new Error("寺院IDが指定されていません");
      }
      
      // 寺院情報を取得
      const templeData = await koshiba_dapp_backend.getTemple(Number(templeId));
      console.log("Temple data:", templeData);
      
      if (!templeData) {
        throw new Error("指定された寺院が見つかりません");
      }
      
      // 配列の場合は最初の要素を取得
      const processdTempleData = Array.isArray(templeData) ? templeData[0] : templeData;
      
      setTemple(processdTempleData);
      
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
          temple_name: processdTempleData.name,
          vote_count: vote_count
        });
        
        // ユーザーの所属寺院と表示寺院が一致するか確認
        setIsUserTemple(userData.templeId === processdTempleData.id);
      } else {
        setUser(null);
        setIsUserTemple(false);
      }
      
      // 寺院IDに紐づく運営方針情報を取得
      const eventsData = await koshiba_dapp_backend.getEventListByTempleId(Number(templeId));
      console.log("Events data:", eventsData);
      
      // イベントデータを処理
      const processedEvents = eventsData 
        ? eventsData.map(event => {
            // 各イベントを処理
            const processedEvent = processEventData(event);
            return processedEvent;
          }) 
        : [];
      
      setEvents(processedEvents);
      
    } catch (error) {
      console.error("Data fetch error:", error);
      setError(error.message || "データの取得に失敗しました");
      setTemple(null);
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

  // 戻るボタンのハンドラ
  const handleGoBack = () => {
    navigate(-1); // 前のページに戻る
  };

  // ローディング表示
  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-circle"></div>
          <p>読み込み中...</p>
        </div>
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
        {temple ? `${temple.name}の運営方針` : "お寺の運営方針"}
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
            
            // 標準多数決の閾値
            const standardMajorityPercent = 50;  // 標準決定の閾値

            return (
              <div className="policy-item" key={event.event_id}>
                <h3>{event.title}</h3>
                <p>{event.content}</p>

                {/* 投票結果表示 - 新デザイン */}
                <div className="voting-results">
                  <h2 className="voting-results-title">投票結果</h2>
                  
                  <div className="voting-stats" 
                       style={{
                         '--standard-majority': `${standardMajorityPercent}%`
                       }}>
                    {/* 賛成パーセンテージ */}
                    <div className="voting-column yes-column">
                      <span className="vote-label">賛成</span>
                      <span className="vote-percentage animated-percentage">
                        <AnimatedNumber 
                          value={yesProportion * 100} 
                          duration={1500} 
                          suffix="%" 
                          decimals={3} 
                        />
                      </span>
                    </div>
                    
                    {/* 反対パーセンテージ */}
                    <div className="voting-column no-column">
                      <span className="vote-label">反対</span>
                      <span className="vote-percentage animated-percentage">
                        <AnimatedNumber 
                          value={noProportion * 100} 
                          duration={1500} 
                          suffix="%" 
                          decimals={3} 
                        />
                      </span>
                    </div>
                    
                    {/* プログレスバーとマーカー */}
                    <div className="voting-progress-container">
                      {/* 標準マジョリティのマーカー */}
                      <div className="majority standard-majority">
                        <div className="majority-icon standard-majority"></div>
                      </div>
                      
                      {/* プログレスバー - 賛成は左から、反対は右から伸びる */}
                      <div className="progressbar" role="progressbar" aria-label="投票進捗">
                        {/* 賛成票のバー - 左から伸びる */}
                        <div 
                          className="voting-progress-bar yes-bar" 
                          style={{ '--final-width': `${yesProportion * 100}%` }}
                        ></div>
                        
                        {/* 反対票のバー - 右から伸びる */}
                        <div 
                          className="voting-progress-bar no-bar" 
                          style={{ '--final-width': `${noProportion * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* 賛成の投票力 */}
                    <div className="voting-power yes-power">
                      <span>
                        <span className="yes">
                          <AnimatedNumber 
                            value={vote.agree} 
                            duration={1800}
                            useComma={true}
                          />
                        </span>
                        <span className="label description">票</span>
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
                        <span className="no">
                          <AnimatedNumber 
                            value={vote.disagree} 
                            duration={1800}
                            useComma={true}
                          />
                        </span>
                        <span className="label description">票</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* マジョリティ説明セクション */}
                  <div className="votes-results-legends">
                    <ol>
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
                      disabled={!user || user.vote_count <= 0 || hasVoted || !isUserTemple}
                    >
                      賛成
                    </button>
                    <button
                      className="vote-button disagree-btn"
                      onClick={() => handleVote(event.event_id, { Disagree: null })}
                      disabled={!user || user.vote_count <= 0 || hasVoted || !isUserTemple}
                    >
                      反対
                    </button>
                  </div>
                )}
                
                {/* 所属寺院でない場合のメッセージ表示 */}
                {!hasVoted && !isUserTemple && (
                  <div className="not-your-temple-message">
                    <p>※ 所属寺院でないため投票できません</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="no-events">現在、投票できるイベントはありません</p>
        )}
      </div>
      
      {/* 戻るボタンをページ下部に配置 */}
      <div className="back-button-container">
        <button onClick={handleGoBack} className="back-button">
          ← 戻る
        </button>
      </div>
    </div>
  );
}

export default TemplePolicyPage; 