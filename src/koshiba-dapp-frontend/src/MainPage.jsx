import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import "./MainPage.css";
// バックエンドのモジュールをインポート
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";

import templeIcon from "./img/templeIcon.jpg";
import rankIcon from "./img/rankIcon.jpg";
import voteIcon from "./img/voteIcon.jpg";
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

  // 表示用の値を計算（3桁区切りを適用）
  const displayValue = Math.floor(currentValue).toLocaleString();

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

// コンパクトな残り時間表示コンポーネント（運営方針カード用）
function RemainingTimeCompact({ deadline_at }) {
  const [remainingTime, setRemainingTime] = useState("");
  
  useEffect(() => {
    // 締め切り日時が存在しない場合
    if (!deadline_at) {
      setRemainingTime("");
      return;
    }
    
    // 残り時間を計算する関数
    const calculateRemainingTime = () => {
      try {
        // 日時文字列をDateオブジェクトに変換
        const deadline = new Date(deadline_at);
        const now = new Date();
        
        // 日時が不正な場合
        if (isNaN(deadline.getTime())) {
          setRemainingTime("");
          return;
        }
        
        // 残り時間（ミリ秒）
        const diff = deadline.getTime() - now.getTime();
        
        // 締め切り済みの場合
        if (diff <= 0) {
          setRemainingTime("（期限切れ）");
          return;
        }
        
        // 残り時間を計算
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        // 表示形式を整形（コンパクトに）
        if (days > 0) {
          setRemainingTime(`（残り${days}日）`);
        } else {
          setRemainingTime(`（残り${hours}時間）`);
        }
      } catch (error) {
        console.error("締め切り時間の計算エラー:", error);
        setRemainingTime("");
      }
    };
    
    // 初回計算
    calculateRemainingTime();
    
    // 1時間ごとに更新
    const intervalId = setInterval(calculateRemainingTime, 3600000);
    
    // クリーンアップ
    return () => clearInterval(intervalId);
  }, [deadline_at]);
  
  return <>{remainingTime}</>;
}

// 残り時間を計算・表示するコンポーネント - ダッシュボード用にシンプル化
function DeadlineDisplayCompact({ deadline_at }) {
  const calculateRemainingDays = () => {
    if (!deadline_at) return { days: 0, isUrgent: false };
    
    const deadlineDate = new Date(deadline_at);
    const currentDate = new Date();
    
    // 日付の差分を計算（ミリ秒）
    const diffMs = deadlineDate - currentDate;
    
    // 日数に変換
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    // 残り3日以内は緊急とみなす
    const isUrgent = diffDays <= 3 && diffDays >= 0;
    
    return { days: diffDays, isUrgent };
  };
  
  const { days, isUrgent } = calculateRemainingDays();
  
  // 期限切れの場合
  if (days < 0) {
    return (
      <div className="deadline-display">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
        <span>期限終了</span>
      </div>
    );
  }
  
  return (
    <div className={`deadline-display ${isUrgent ? 'deadline-urgent' : ''}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
      <span>残り{days}日</span>
    </div>
  );
}

// 運営収支グラフコンポーネント（アニメーション付き円グラフバージョン）
function FinanceChart({ payments = [] }) {
  // 今月のデータに焦点を当てる
  const calculateMonthlyData = () => {
    const currentDate = new Date();
    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = monthNames[month];
    
    let income = 0;
    let expenses = 0;
    
    // 今月のデータを集計
    payments.forEach(payment => {
      if (!payment.created_at) return;
      
      const paymentDate = new Date(payment.created_at);
      if (paymentDate.getFullYear() === year && paymentDate.getMonth() === month) {
        if (typeof payment.status === 'object') {
          if ('Income' in payment.status) {
            income += payment.amount || 0;
          } else if ('Expenses' in payment.status) {
            expenses += payment.amount || 0;
          }
        } else if (typeof payment.status === 'string') {
          if (payment.status === "Income") {
            income += payment.amount || 0;
          } else if (payment.status === "Expenses") {
            expenses += payment.amount || 0;
          }
        }
      }
    });
    
    return {
      month: monthName,
      income: income,
      expenses: expenses,
      total: income - expenses
    };
  };
  
  const monthData = calculateMonthlyData();
  const [animationStarted, setAnimationStarted] = useState(false);
  const [incomeAngle, setIncomeAngle] = useState(0);
  const [expensesAngle, setExpensesAngle] = useState(0);
  
  // アニメーション用のref
  const incomeRef = useRef(0);
  const expensesRef = useRef(0);
  
  // 収支合計額
  const total = monthData.income + monthData.expenses;
  
  // 最終的なアングル値を計算
  const finalIncomeAngle = total > 0 ? (monthData.income / total) * 360 : 0;
  const finalExpensesAngle = total > 0 ? (monthData.expenses / total) * 360 : 0;
  
  // アニメーション効果
  useEffect(() => {
    if (!animationStarted && total > 0) {
      setAnimationStarted(true);
      
      const startTime = Date.now();
      const duration = 1500; // 1.5秒間
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // イージング関数を適用したアニメーション（easeOutExpo）
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        incomeRef.current = easeProgress * finalIncomeAngle;
        expensesRef.current = easeProgress * finalExpensesAngle;
        
        setIncomeAngle(incomeRef.current);
        setExpensesAngle(expensesRef.current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [animationStarted, finalIncomeAngle, finalExpensesAngle, total]);
  
  // 金額をフォーマット
  const formatAmount = (amount) => {
    if (amount >= 10000) {
      return `${Math.floor(amount / 10000)}万円`;
    }
    return `${amount.toLocaleString()}円`;
  };
  
  return (
    <div className="finance-chart-container">
      <div className="enhanced-pie-chart-wrapper">
        <div className="month-label">{monthData.month}の収支状況</div>
        
        {total > 0 ? (
          <>
            <div className="pie-chart-container">
              <div className="pie-chart">
                <div 
                  className="income-slice" 
                  style={{
                    transform: `rotate(0deg)`,
                    background: `conic-gradient(#4CAF50 0deg, #4CAF50 ${incomeAngle}deg, transparent ${incomeAngle}deg)`
                  }}
                ></div>
                <div 
                  className="expenses-slice" 
                  style={{
                    transform: `rotate(${incomeAngle}deg)`,
                    background: `conic-gradient(#F44336 0deg, #F44336 ${expensesAngle}deg, transparent ${expensesAngle}deg)`
                  }}
                ></div>
                <div className="balance-display">
                  <span className={monthData.total >= 0 ? "positive-balance" : "negative-balance"}>
                    {monthData.total >= 0 ? "+" : ""}
                    <AnimatedNumber value={Math.abs(monthData.total)} duration={1500} suffix="円" />
                  </span>
                </div>
              </div>
            </div>
            <div className="chart-amounts">
              <div className="income-amount">
                <span className="amount-dot income-dot"></span>
                <span className="amount-label">収入:</span>
                <span className="amount-value">
                  {monthData.income >= 10000 ? (
                    <AnimatedNumber value={Math.floor(monthData.income / 10000)} duration={1500} suffix="万円" />
                  ) : (
                    <AnimatedNumber value={monthData.income} duration={1500} suffix="円" />
                  )}
                </span>
              </div>
              <div className="expenses-amount">
                <span className="amount-dot expenses-dot"></span>
                <span className="amount-label">支出:</span>
                <span className="amount-value">
                  {monthData.expenses >= 10000 ? (
                    <AnimatedNumber value={Math.floor(monthData.expenses / 10000)} duration={1500} suffix="万円" />
                  ) : (
                    <AnimatedNumber value={monthData.expenses} duration={1500} suffix="円" />
                  )}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="pie-chart-container">
              <div className="empty-chart">
                <span>データなし</span>
              </div>
            </div>
            <div className="chart-amounts">
              <span className="no-data-text">収支記録なし</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MainPage() {
  const navigate = useNavigate();
  
  // 状態変数
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [payments, setPayments] = useState([]); // 運営収支データ
  // 認証チェック中
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  // データ読み込み中
  const [isLoading, setIsLoading] = useState(true);
  // エラーメッセージ
  const [error, setError] = useState("");
  // ユーザー登録モーダルの表示状態
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  // アカウントモーダルの表示状態
  const [showAccountModal, setShowAccountModal] = useState(false);
  // アカウント削除確認モーダルの表示状態
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  // Principal ID
  const [principalId, setPrincipalId] = useState("");
  // お知らせデータ
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  // カテゴリフィルター用のステート
  const [selectedCategory, setSelectedCategory] = useState("all");
  
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
              vote_count = 10;
              break;
            case 'B':
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
      
      // 運営収支情報を取得
      try {
        const paymentsData = await koshiba_dapp_backend.getMyPaymentList();
        console.log("Payments data:", paymentsData);
        setPayments(paymentsData || []);
      } catch (paymentError) {
        console.error("運営収支情報の取得に失敗しました:", paymentError);
      }
      
      // お知らせデータを取得
      const notificationsData = getAllNotifications();
      setAllNotifications(notificationsData);
      setNotifications(notificationsData);
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
      // 削除確認モーダルを表示
      setShowDeleteConfirmModal(true);
    } catch (error) {
      console.error("ユーザー削除処理中にエラーが発生しました:", error);
    }
  };

  // 削除確認後の実際の削除処理
  const confirmDeleteUser = async () => {
    try {
      await koshiba_dapp_backend.deleteMe();
      // ユーザー削除後、ログイン画面へ遷移
      navigate("/");
    } catch (error) {
      console.error("ユーザー削除中にエラーが発生しました:", error);
    }
  };

  // 投票状態を表示するためのヘルパー関数
  const renderVoteStatus = (yourVote, deadline_at) => {
    if (!yourVote) {
      // 未投票の場合は「未投票」と残り時間を表示
      return (
        <span className="vote-status-badge deadline">
          <span className="not-voted-text">未投票</span>
          {deadline_at && <RemainingTimeCompact deadline_at={deadline_at} />}
        </span>
      );
    }
    
    if (yourVote.Agree !== undefined) {
      return <span className="vote-status-badge agree">賛成</span>;
    } else if (yourVote.Disagree !== undefined) {
      return <span className="vote-status-badge disagree">反対</span>;
    }
    
    return <span className="vote-status-badge not-voted">未投票</span>;
  };
  
  // 金額を3桁区切りでフォーマットする関数
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return "0";
    return amount.toLocaleString();
  };
  
  // 支出/収入のステータスに基づいたクラス名を返す
  const getPaymentStatusClass = (status) => {
    if (!status) return "";
    
    // statusがオブジェクトの場合（Enum変換後）
    if (typeof status === 'object') {
      if ('Expenses' in status) {
        return "payment-status-expenses";
      } else if ('Income' in status) {
        return "payment-status-income";
      }
    } 
    // 文字列の場合は従来通り
    else if (typeof status === 'string') {
      if (status === "Expenses") {
        return "payment-status-expenses";
      } else if (status === "Income") {
        return "payment-status-income";
      }
    }
    
    return "";
  };
  
  // 支出/収入のステータスに基づいたラベルを返す
  const getPaymentStatusLabel = (status) => {
    if (!status) return "不明";
    
    // statusがオブジェクトの場合（Enum変換後）
    if (typeof status === 'object') {
      if ('Expenses' in status) {
        return "支出";
      } else if ('Income' in status) {
        return "収入";
      }
    } 
    // 文字列の場合は従来通り
    else if (typeof status === 'string') {
      if (status === "Expenses") {
        return "支出";
      } else if (status === "Income") {
        return "収入";
      }
      return status;
    }
    
    return "不明";
  };

  // カテゴリキーから表示名を取得する関数
  const getCategoryNameFromKey = (key) => {
    switch(key) {
      case 'notice': return 'お知らせ';
      case 'event': return 'イベント';
      case 'service': return 'サービス';
      case 'benefit': return '特典';
      default: return '';
    }
  };

  // カテゴリフィルタリングの変更時に通知リストを更新
  useEffect(() => {
    if (selectedCategory === "all") {
      setNotifications(allNotifications);
    } else {
      const filtered = allNotifications.filter(
        notification => notification.category === getCategoryNameFromKey(selectedCategory)
      );
      setNotifications(filtered);
    }
  }, [selectedCategory, allNotifications]);

  // 全てのお知らせを取得する関数
  const getAllNotifications = () => {
    console.log("Getting all notifications regardless of grade");
    
    // 全てのお知らせを配列として定義
    const allNotifications = [
      // Dグレードのお知らせ
      {
        id: "temple-newsletter",
        title: "寺院だより最新号",
        summary: "今月の寺院だよりが発行されました。季節の行事や仏教の教えについて解説しています。",
        category: "お知らせ",
        date: "2023/12/10",
        grade: "D"
      },
      {
        id: "year-end-prayer",
        title: "年末の祈祷会参加募集",
        summary: "今年も年末の特別祈祷会を開催します。どなたでもご参加いただけます。",
        category: "イベント",
        date: "2023/12/05",
        grade: "D"
      },
      // Cグレードのお知らせ
      {
        id: "gomaki-service",
        title: "お焚き上げサービスのご案内",
        summary: "毎月のお焚き上げサービスの日程と申込方法についてご案内します。",
        category: "サービス",
        date: "2023/12/03",
        grade: "C"
      },
      {
        id: "annual-events",
        title: "年中行事カレンダー",
        summary: "今年の年中行事予定表です。ぜひご参加ください。",
        category: "イベント",
        date: "2023/11/28",
        grade: "C"
      },
      {
        id: "ossuary-usage",
        title: "納骨堂利用について",
        summary: "納骨堂の利用方法と空き状況についての最新情報です。",
        category: "お知らせ",
        date: "2023/11/25",
        grade: "C"
      },
      // Bグレードのお知らせ
      {
        id: "buddhist-items-discount",
        title: "仏具の割引購入プログラム",
        summary: "当寺院指定の仏具を特別価格でご購入いただけます。最新のカタログをご覧ください。",
        category: "特典",
        date: "2023/11/20",
        grade: "B"
      },
      {
        id: "special-ceremony",
        title: "特別法要へのご招待",
        summary: "来月の特別法要にご招待します。檀家の皆様だけの特別な機会です。",
        category: "イベント",
        date: "2023/11/18",
        grade: "B"
      },
      {
        id: "priority-participation",
        title: "寺院イベントの優先参加について",
        summary: "人気の高い寺院イベントに優先的にご参加いただけます。近日開催のイベント情報をご確認ください。",
        category: "特典",
        date: "2023/11/15",
        grade: "B"
      },
      // Aグレードのお知らせ
      {
        id: "prayer-service",
        title: "祈祷サービスのご案内",
        summary: "毎月のご祈祷サービスについて最新情報をお届けします。",
        category: "お知らせ",
        date: "2023/10/20",
        grade: "A"
      },
      {
        id: "dedicated-parking",
        title: "専用駐車場のご利用案内",
        summary: "寺院専用駐車場のご利用方法と注意事項についてご案内します。",
        category: "特典",
        date: "2023/11/10",
        grade: "A"
      },
      {
        id: "priority-invitation",
        title: "重要法要への優先招待",
        summary: "来月の重要法要に優先的にご招待します。特別席をご用意しております。",
        category: "イベント",
        date: "2023/11/08",
        grade: "A"
      },
      {
        id: "priest-meeting",
        title: "住職との個別面談（月1回）のご案内",
        summary: "毎月の住職との個別面談の予約を受け付けております。ご希望の日時をお知らせください。",
        category: "サービス",
        date: "2023/11/05",
        grade: "A"
      },
      // Sグレードのお知らせ
      {
        id: "priority-reservation",
        title: "寺院行事の優先予約について",
        summary: "すべての寺院行事に最優先でご予約いただけます。今後の行事予定をご確認ください。",
        category: "特典",
        date: "2023/11/01",
        grade: "S"
      },
      {
        id: "purification-service",
        title: "特別清祓サービスのご案内",
        summary: "邸宅や事業所などへの出張清祓サービスをご提供しています。詳細はお問い合わせください。",
        category: "サービス",
        date: "2023/10/15",
        grade: "S"
      }
    ];
    
    return allNotifications;
  };

  // カテゴリの色を取得
  const getCategoryColor = (category) => {
    switch(category) {
      case 'お知らせ': return 'notice';
      case 'イベント': return 'event';
      case 'サービス': return 'service';
      case '特典': return 'benefit';
      default: return '';
    }
  };

  // カテゴリボタンクリックハンドラ
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // カテゴリごとの件数を取得
  const getCategoryCounts = () => {
    const counts = {
      all: allNotifications.length,
      notice: 0,
      event: 0,
      service: 0,
      benefit: 0
    };
    
    allNotifications.forEach(notification => {
      if (notification.category === 'お知らせ') counts.notice++;
      if (notification.category === 'イベント') counts.event++;
      if (notification.category === 'サービス') counts.service++;
      if (notification.category === '特典') counts.benefit++;
    });
    
    return counts;
  };

  // 投票データを正しく処理するヘルパー関数
  const processVoteData = (event) => {
    // ベースとなるイベントデータ
    const processedEvent = { ...event };
    
    // agree_countとdisagree_countがない場合は0を設定
    if (processedEvent.agree_count === undefined) processedEvent.agree_count = 0;
    if (processedEvent.disagree_count === undefined) processedEvent.disagree_count = 0;
    
    // voteプロパティが存在する場合はそこから値を取得
    if (processedEvent.vote) {
        // agree, disagreeが直接プロパティとして存在する場合
        if (processedEvent.vote.agree !== undefined) {
            processedEvent.agree_count = processedEvent.vote.agree;
        }
        if (processedEvent.vote.disagree !== undefined) {
            processedEvent.disagree_count = processedEvent.vote.disagree;
        }
        
        // totalが存在する場合はそれを使用
        if (processedEvent.vote.total !== undefined) {
            processedEvent.total_count = processedEvent.vote.total;
        } else {
            // 存在しない場合はagreeとdisagreeの合計を使用
            processedEvent.total_count = processedEvent.agree_count + processedEvent.disagree_count;
        }
    } else {
        // voteプロパティがない場合はagree_countとdisagree_countから計算
        processedEvent.total_count = processedEvent.agree_count + processedEvent.disagree_count;
    }
    
    return processedEvent;
  };

  // ローディング表示
  if (isLoading) {
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
                <h3 className="account-modal-title">
                  {user && user.last_name && user.first_name ? 
                    `${user.last_name} ${user.first_name}` : 
                    "ゲストユーザー"}
                </h3>
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

        <div className="content-loading-container">
          <div className="loading-spinner"></div>
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
              <h3 className="account-modal-title">
                {user && user.last_name && user.first_name ? 
                  `${user.last_name} ${user.first_name}` : 
                  "ゲストユーザー"}
              </h3>
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

      {/* アカウント削除確認モーダル */}
      {showDeleteConfirmModal && (
        <div className="delete-confirm-modal-overlay">
          <div className="delete-confirm-modal">
            <h2 style={{ color: "#ff4136", marginBottom: "20px" }}>アカウント削除の確認</h2>
            <p style={{ marginBottom: "10px" }}>本当にアカウントを削除しますか？</p>
            <p style={{ marginBottom: "30px" }}>この操作は元に戻すことができません。</p>
            
            <div className="delete-confirm-buttons">
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowDeleteConfirmModal(false)}
              >
                キャンセル
              </button>
              <button
                type="button"
                className="delete-button"
                onClick={confirmDeleteUser}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* ダッシュボード（横長）*/}
      <div className="dashboard-grid horizontal">
        {/* 運営方針カード */}
        <div className="dashboard-card">
          <h3 className="dashboard-card-title">
          {user && user.temple_name && user.temple_name !== "所属寺院なし" ? `${user.temple_name}の運営方針` : "運営方針"}
          </h3>
          <div className="policy-event-list">
            {events.length > 0 ? (
              events.slice(0, 3).map((event) => {
                // イベントデータ処理
                const processedEvent = processVoteData(event);
                
                // 賛成・反対の票数や割合を計算
                const totalVotes = processedEvent.total_count || 0;
                const agreePercent = totalVotes > 0 ? Math.round((processedEvent.agree_count || 0) / totalVotes * 100) : 0;
                const disagreePercent = totalVotes > 0 ? Math.round((processedEvent.disagree_count || 0) / totalVotes * 100) : 0;
                
                // CSSカスタムプロパティを使用して幅を設定
                const yesBarStyle = { "--final-width": `${agreePercent}%` };
                const noBarStyle = { "--final-width": `${disagreePercent}%` };
                
                return (
                  <div key={event.event_id} className="policy-event-item">
                    <div className="policy-event-header">
                      <h4 className="policy-event-title">{event.title}</h4>
                      
                      {renderVoteStatus(event.your_vote, event.deadline_at)}
                    </div>
                    
                    {/* 投票状況表示 */}
                    <div className="voting-stats">
                      <div className="voting-column yes-column">
                        <div className="vote-label">賛成</div>
                        <div className="vote-percentage">
                          <AnimatedNumber value={agreePercent} duration={1500} suffix="%" />
                        </div>
                      </div>
                      
                      <div className="voting-column no-column">
                        <div className="vote-label">反対</div>
                        <div className="vote-percentage">
                          <AnimatedNumber value={disagreePercent} duration={1500} suffix="%" />
                        </div>
                      </div>
                      
                      <div className="voting-progress-container">
                        <div className="progressbar">
                          <div className="yes-bar" style={yesBarStyle}></div>
                          <div className="no-bar" style={noBarStyle}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 期限表示 */}
                    <DeadlineDisplayCompact deadline_at={event.deadline_at} />
                  </div>
                );
              })
            ) : (
              <p className="no-data-message">現在投票できる議案はありません</p>
            )}
          </div>
          
          <Link to="/policy" className="see-more-link">
            ＞＞投票はこちら
          </Link>
        </div>
        
        {/* 運営収支カード */}
        <div className="dashboard-card payment-card">
          <h3 className="dashboard-card-title">
          {user && user.temple_name && user.temple_name !== "所属寺院なし" ? `${user.temple_name}の収支状況` : "収支状況"}
          </h3> 
          {/* 収支グラフ */}
          <FinanceChart payments={payments} />
          
          <div className="payment-list">
            {payments.length > 0 ? (
              payments.slice(0, 5).map((payment, index) => {
                const statusClass = getPaymentStatusClass(payment.status);
                const statusLabel = getPaymentStatusLabel(payment.status);
                
                // 日付のフォーマット
                const formattedDate = payment.created_at 
                  ? new Date(payment.created_at).toLocaleString('ja-JP', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : "日時不明";
                
                return (
                  <div key={index} className="payment-item">
                    <div className="payment-item-header">
                      <h4 className="payment-item-title">{payment.title}</h4>
                      <p className="payment-date">{formattedDate}</p>
                    </div>
                    <div className={`payment-amount ${statusClass}`}>
                      {statusClass === "payment-status-income" ? "+" : "-"}
                      <AnimatedNumber value={payment.amount || 0} duration={1500} suffix="円" />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="no-data-message">収支情報はありません</p>
            )}
          </div>
          
          <Link to="/payment" className="see-more-link">
            ＞＞もっと見る
          </Link>
        </div>
      </div>

      {/* 水平線 */}
      <hr className="section-divider" />

      {/* お知らせセクション */}
      <div className="notification-section">
        {/* カテゴリフィルター */}
        <div className="category-filter-container">
          <button 
            className={`category-filter-btn ${selectedCategory === 'all' ? 'active all' : ''}`}
            onClick={() => handleCategoryClick('all')}
          >
            全て ({getCategoryCounts().all})
          </button>
          <button 
            className={`category-filter-btn ${selectedCategory === 'notice' ? 'active notice' : ''}`}
            onClick={() => handleCategoryClick('notice')}
          >
            お知らせ ({getCategoryCounts().notice})
          </button>
          <button 
            className={`category-filter-btn ${selectedCategory === 'event' ? 'active event' : ''}`}
            onClick={() => handleCategoryClick('event')}
          >
            イベント ({getCategoryCounts().event})
          </button>
          <button 
            className={`category-filter-btn ${selectedCategory === 'service' ? 'active service' : ''}`}
            onClick={() => handleCategoryClick('service')}
          >
            サービス ({getCategoryCounts().service})
          </button>
          <button 
            className={`category-filter-btn ${selectedCategory === 'benefit' ? 'active benefit' : ''}`}
            onClick={() => handleCategoryClick('benefit')}
          >
            特典 ({getCategoryCounts().benefit})
          </button>
        </div>
        
        {/* お知らせ一覧 */}
        <div className="notification-list">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Link
                key={notification.id}
                to={`/notification/${notification.id}`}
                className={`notification-card ${getCategoryColor(notification.category)}`}
              >
                <div className="notification-content">
                  <div className="notification-header">
                    <span className={`category-badge ${getCategoryColor(notification.category)}`}>
                      {notification.category}
                    </span>
                    <span className="notification-date">{notification.date}</span>
                  </div>
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-summary">{notification.summary}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="no-data-message">お知らせはありません</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
