import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";
import "./PaymentPage.css";

import IconAccount from "./img/account.png";

/**
 * 数字を 0 から value までアニメーションしながら表示するコンポーネント
 * @param {number} value - 最終的な数値
 * @param {number} duration - アニメーション時間 (ms)
 * @param {string} suffix - 単位（例: "円"）
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
 * 複数期間（今月、半年、1年）の収支状況を表示するダッシュボードコンポーネント
 * @param {Array} payments - 支払いデータの配列
 */
function FinanceDashboard({ payments = [] }) {
  // 期間タブの状態（month: 今月, halfYear: 半年, year: 1年）
  const [activeTab, setActiveTab] = useState("month");
  
  // 円グラフのアニメーション状態
  const [animationStarted, setAnimationStarted] = useState(false);
  const [incomeAngle, setIncomeAngle] = useState(0);
  const [expensesAngle, setExpensesAngle] = useState(0);
  
  // アニメーション用のref
  const incomeRef = useRef(0);
  const expensesRef = useRef(0);
  
  // 期間に基づいて収支データを計算
  const calculatePeriodData = (period) => {
    const currentDate = new Date();
    let startDate;
    let periodLabel;
    
    // 期間の開始日を設定
    if (period === "month") {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      periodLabel = `${currentDate.getMonth() + 1}月の収支`;
    } else if (period === "halfYear") {
      startDate = new Date(currentDate);
      startDate.setMonth(currentDate.getMonth() - 6);
      periodLabel = "過去6ヶ月の収支";
    } else if (period === "year") {
      startDate = new Date(currentDate);
      startDate.setFullYear(currentDate.getFullYear() - 1);
      periodLabel = "過去1年間の収支";
    }
    
    let income = 0;
    let expenses = 0;
    
    // 期間内のデータを集計
    payments.forEach(payment => {
      if (!payment.created_at) return;
      
      const paymentDate = new Date(payment.created_at);
      
      if (paymentDate >= startDate && paymentDate <= currentDate) {
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
      label: periodLabel,
      income: income,
      expenses: expenses,
      total: income - expenses
    };
  };
  
  // 現在のアクティブタブに基づいてデータを取得
  const periodData = calculatePeriodData(activeTab);
  const total = periodData.income + periodData.expenses;
  
  // 最終的なアングル値を計算
  const finalIncomeAngle = total > 0 ? (periodData.income / total) * 360 : 0;
  const finalExpensesAngle = total > 0 ? (periodData.expenses / total) * 360 : 0;
  
  // タブが変更されたときにアニメーションをリセット
  useEffect(() => {
    setAnimationStarted(false);
    setIncomeAngle(0);
    setExpensesAngle(0);
  }, [activeTab]);
  
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
  }, [animationStarted, finalIncomeAngle, finalExpensesAngle, total, activeTab]);
  
  // 金額をフォーマット
  const formatLargeAmount = (amount) => {
    if (amount >= 10000) {
      return `${Math.floor(amount / 10000)}万${amount % 10000 > 0 ? Math.floor((amount % 10000) / 1000) + '千' : ''}円`;
    }
    return `${amount.toLocaleString()}円`;
  };
  
  return (
    <div className="finance-dashboard">
      <h2 className="dashboard-title">収支ダッシュボード</h2>
      
      {/* 期間タブ */}
      <div className="period-tabs">
        <button 
          className={`period-tab ${activeTab === 'month' ? 'active' : ''}`}
          onClick={() => setActiveTab('month')}
        >
          今月
        </button>
        <button 
          className={`period-tab ${activeTab === 'halfYear' ? 'active' : ''}`}
          onClick={() => setActiveTab('halfYear')}
        >
          半年
        </button>
        <button 
          className={`period-tab ${activeTab === 'year' ? 'active' : ''}`}
          onClick={() => setActiveTab('year')}
        >
          1年
        </button>
      </div>
      
      {/* 収支サマリーカード */}
      <div className="summary-card">
        <h3 className="period-label">{periodData.label}</h3>
        
        <div className="finance-summary">
          {/* 円グラフ */}
          <div className="pie-chart-container">
            {total > 0 ? (
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
                  <span className={periodData.total >= 0 ? "positive-balance" : "negative-balance"}>
                    {periodData.total >= 0 ? "+" : ""}
                    <AnimatedNumber value={Math.abs(periodData.total)} duration={1500} suffix="円" />
                  </span>
                </div>
              </div>
            ) : (
              <div className="empty-chart">
                <span>データなし</span>
              </div>
            )}
          </div>
          
          {/* 収支詳細 */}
          <div className="summary-details">
            <div className="summary-item income-summary">
              <div className="summary-label">
                <span className="dot income-dot"></span>
                <span>収入</span>
              </div>
              <div className="summary-value">
                <AnimatedNumber 
                  value={periodData.income} 
                  duration={1500} 
                  suffix="円" 
                />
              </div>
            </div>
            
            <div className="summary-item expenses-summary">
              <div className="summary-label">
                <span className="dot expenses-dot"></span>
                <span>支出</span>
              </div>
              <div className="summary-value">
                <AnimatedNumber 
                  value={periodData.expenses} 
                  duration={1500} 
                  suffix="円" 
                />
              </div>
            </div>
            
            <div className="summary-item balance-summary">
              <div className="summary-label">
                <span>収支差額</span>
              </div>
              <div className={`summary-value ${periodData.total >= 0 ? 'positive' : 'negative'}`}>
                {periodData.total >= 0 ? "+" : ""}
                <AnimatedNumber 
                  value={Math.abs(periodData.total)} 
                  duration={1500} 
                  suffix="円" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplePaymentPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // URLパラメータから寺院IDを取得
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const templeIdFromQuery = queryParams.get('templeId'); // クエリパラメータからも寺院IDを取得
  
  // 状態変数
  const [user, setUser] = useState(null);
  const [temple, setTemple] = useState(null); // 寺院情報
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [principalId, setPrincipalId] = useState("");
  
  // カテゴリフィルター状態（all, expense, income）
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
        console.error("認証チェック中にエラーが発生しました:", err);
        setError("認証状態の確認中にエラーが発生しました");
        setIsLoading(false);
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
      const processedTempleData = Array.isArray(templeData) ? templeData[0] : templeData;
      
      setTemple(processedTempleData);
      
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
        // ユーザー情報をセット
        setUser({
          ...userData,
          temple_name: processedTempleData.name
        });
      } else {
        setUser(null);
      }
      
      try {
        // 寺院IDに紐づく支払い履歴を取得
        const paymentData = await koshiba_dapp_backend.getPaymentListByTempleId(Number(templeId));
        console.log("Payment data:", paymentData);
        
        // 支払いデータを日付の新しい順にソート
        const sortedPayments = paymentData.sort((a, b) => {
          // 日付フィールドが存在しない場合にエラーを避けるための処理
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
          return dateB - dateA;
        });
        
        setPayments(sortedPayments);
      } catch (paymentError) {
        console.error("支払いデータの取得に失敗しました:", paymentError);
        setError("支払い履歴の取得に失敗しました");
        setPayments([]);
      }
    } catch (error) {
      console.error("データ取得中にエラーが発生しました:", error);
      setError(error.message || "データの取得に失敗しました");
      setTemple(null);
    } finally {
      setIsLoading(false);
    }
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
  
  // カテゴリでフィルタリングした支払いリストを取得
  const getFilteredPayments = () => {
    if (selectedCategory === "all") {
      return payments;
    } else if (selectedCategory === "expense") {
      return payments.filter(payment => {
        // オブジェクト型の場合
        if (typeof payment.status === 'object') {
          return 'Expenses' in payment.status;
        } 
        // 文字列型の場合
        else if (typeof payment.status === 'string') {
          return payment.status === "Expenses";
        }
        return false;
      });
    } else if (selectedCategory === "income") {
      return payments.filter(payment => {
        // オブジェクト型の場合
        if (typeof payment.status === 'object') {
          return 'Income' in payment.status;
        } 
        // 文字列型の場合
        else if (typeof payment.status === 'string') {
          return payment.status === "Income";
        }
        return false;
      });
    }
    return payments;
  };
  
  // カテゴリごとの件数を取得
  const getCategoryCounts = () => {
    const expenseCount = payments.filter(payment => {
      // オブジェクト型の場合
      if (typeof payment.status === 'object') {
        return 'Expenses' in payment.status;
      } 
      // 文字列型の場合
      else if (typeof payment.status === 'string') {
        return payment.status === "Expenses";
      }
      return false;
    }).length;
    
    const incomeCount = payments.filter(payment => {
      // オブジェクト型の場合
      if (typeof payment.status === 'object') {
        return 'Income' in payment.status;
      } 
      // 文字列型の場合
      else if (typeof payment.status === 'string') {
        return payment.status === "Income";
      }
      return false;
    }).length;
    
    return {
      all: payments.length,
      expense: expenseCount,
      income: incomeCount
    };
  };
  
  const categoryCounts = getCategoryCounts();
  const filteredPayments = getFilteredPayments();
  
  // 支払いステータスに応じたアイコンとスタイルを取得
  const getPaymentStatusInfo = (status) => {
    if (!status) return { icon: "-", class: "", label: "不明" };
    
    // statusがオブジェクトの場合（Enum変換後）
    if (typeof status === 'object') {
      if ('Expenses' in status) {
        return { icon: "↓", class: "expense", label: "支出" };
      } else if ('Income' in status) {
        return { icon: "↑", class: "income", label: "収入" };
      }
    } 
    // 文字列の場合は従来通り
    else if (typeof status === 'string') {
      if (status === "Expenses") {
        return { icon: "↓", class: "expense", label: "支出" };
      } else if (status === "Income") {
        return { icon: "↑", class: "income", label: "収入" };
      }
    }
    
    return { icon: "-", class: "", label: "不明" };
  };
  
  // 戻るボタンのハンドラ
  const handleGoBack = () => {
    navigate(-1); // 前のページに戻る
  };
  
  // ローディング表示
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>読み込み中...</p>
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
      <h3 className="payment-title">
        {temple ? `${temple.name}の運営収支` : "お寺の運営収支"}
      </h3>

      {/* 収支ダッシュボード（新規追加） */}
      <FinanceDashboard payments={payments} />

      {/* カテゴリフィルター */}
      <div className="category-filter-container">
        <button 
          className={`category-filter-btn ${selectedCategory === 'all' ? 'active all' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          全て ({categoryCounts.all})
        </button>
        <button 
          className={`category-filter-btn ${selectedCategory === 'expense' ? 'active expense' : ''}`}
          onClick={() => setSelectedCategory('expense')}
        >
          支出 ({categoryCounts.expense})
        </button>
        <button 
          className={`category-filter-btn ${selectedCategory === 'income' ? 'active income' : ''}`}
          onClick={() => setSelectedCategory('income')}
        >
          収入 ({categoryCounts.income})
        </button>
      </div>

      {/* 支払い履歴リスト */}
      <div className="payment-list">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment, index) => {
            const statusInfo = getPaymentStatusInfo(payment.status);
            
            // 日付と時刻情報を整形
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
              <div key={index} className={`payment-card ${statusInfo.class}`}>
                <div className="payment-item-content">
                  <h3 className="payment-title">{payment.title || "タイトルなし"}</h3>
                  <p className="payment-date">{formattedDate}</p>
                  <p className="payment-description">{payment.content || "詳細情報なし"}</p>
                  <div className={`payment-amount ${statusInfo.class}`}>
                    {statusInfo.class === "income" ? "+" : "-"}
                    <AnimatedNumber value={payment.amount || 0} duration={1500} suffix="円" />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-payments">
            <p>支払い履歴はありません</p>
          </div>
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

export default TemplePaymentPage; 