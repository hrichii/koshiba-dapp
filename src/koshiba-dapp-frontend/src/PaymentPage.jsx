import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";
import "./PaymentPage.css";

import IconAccount from "./img/account.png";

function PaymentPage() {
  const navigate = useNavigate();
  
  // 状態変数
  const [user, setUser] = useState(null);
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
        let templeId = 0;
        let templeName = "所属寺院なし";
        
        // templeプロパティが配列として存在する場合
        if (Array.isArray(userData.temple) && userData.temple.length > 0) {
          // temple_idが0の場合は「所属寺院なし」のままにする
          if (userData.temple[0].id !== 0) {
            templeId = userData.temple[0].id;
            templeName = userData.temple[0].name || "不明";
            console.log("Temple data from user object:", userData.temple[0]);
          }
        }
        // temple_idが存在する場合は、従来通り寺院情報を取得
        else if (userData.temple_id !== undefined && userData.temple_id !== 0) {
          templeId = userData.temple_id;
          try {
            const templeData = await koshiba_dapp_backend.getTemple(templeId);
            console.log("Temple data from API:", templeData);
            templeName = templeData ? templeData.name : "不明";
          } catch (templeError) {
            console.error("寺院データの取得に失敗しました:", templeError);
          }
        }
        
        // ユーザー情報をセット
        setUser({
          ...userData,
          temple_id: templeId,
          temple_name: templeName
        });
        
        // 寺院IDがある場合は支払い履歴を取得
        if (templeId !== 0) {
          try {
            const paymentData = await koshiba_dapp_backend.getPaymentListByTempleId(templeId);
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
          }
        } else {
          setPayments([]);
        }
      } else {
        setUser(null);
        setPayments([]);
      }
    } catch (error) {
      console.error("データ取得中にエラーが発生しました:", error);
      setError("データの取得に失敗しました");
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
      <h3 className="payment-title">
        {user && user.temple_name ? 
          `${user.temple_name}の運営収支` : 
          "お寺の運営収支"}
      </h3>

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
            
            // 金額を3桁区切りで表示
            const formattedAmount = payment.amount 
              ? payment.amount.toLocaleString()
              : "0";
            
            return (
              <div key={index} className={`payment-card ${statusInfo.class}`}>
                <div className="payment-item-content">
                  <h3 className="payment-title">{payment.title || "タイトルなし"}</h3>
                  <p className="payment-date">{formattedDate}</p>
                  <p className="payment-description">{payment.content || "詳細情報なし"}</p>
                  <div className={`payment-amount ${statusInfo.class}`}>
                    {statusInfo.class === "income" ? "+" : "-"}{formattedAmount}円
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
    </div>
  );
}

export default PaymentPage; 