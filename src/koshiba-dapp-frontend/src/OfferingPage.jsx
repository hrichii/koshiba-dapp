import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";
import "./OfferingPage.css";

import templeBackground from "./img/offering_background.jpg"; // 背景用の寺院画像
import buddhaPeace from "./img/offering.png"; // 仏像アイコン用


function OfferingPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState(0);
  const [displayAmount, setDisplayAmount] = useState("0"); // 表示用の金額（カンマ区切り）
  const [templeName, setTempleName] = useState("所属寺院");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showThanks, setShowThanks] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // 確認モーダルの表示状態
  
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
        let userData = await koshiba_dapp_backend.getMe();
        
        // ユーザーデータの処理（配列の場合の処理）
        if (Array.isArray(userData) && userData.length > 0) {
          userData = userData[0];
        }
        
        if (userData) {
          setUser(userData);
          
          // 所属寺院の名前を設定
          if (userData.temple && Array.isArray(userData.temple) && userData.temple.length > 0) {
            setTempleName(userData.temple[0].name || "所属寺院");
          }
        } else {
          // ユーザー情報がない場合は登録ページへ
          navigate("/register");
          return;
        }
        
      } catch (err) {
        console.error("Error during initialization:", err);
        setError("初期化中にエラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthAndFetchData();
  }, [navigate]);

  // 金額を3桁ごとにカンマ区切りにする関数
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 金額に加算する関数
  const addAmount = (value) => {
    const newAmount = amount + value;
    setAmount(newAmount);
    setDisplayAmount(formatNumber(newAmount));
  };

  // 金額入力ハンドラー
  const handleAmountChange = (e) => {
    // 入力値からカンマを取り除く
    const value = e.target.value.replace(/,/g, '');
    // 数値のみを許可
    if (/^\d*$/.test(value)) {
      const numberValue = value === '' ? 0 : parseInt(value, 10);
      setAmount(numberValue);
      setDisplayAmount(value === '' ? '' : formatNumber(numberValue));
    }
  };

  // 送信ボタンのハンドラー - 確認モーダルを表示
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (amount <= 0) {
      setError("金額を入力してください");
      return;
    }
    
    // 入力内容に問題がなければ確認モーダルを表示
    setError("");
    setShowConfirmModal(true);
  };

  // お布施を確定して送信する処理
  const confirmOffering = () => {
    // 本来はここでバックエンドAPIを呼び出す
    console.log("御布施を送信:", {
      amount,
      message,
      temple: templeName,
      userId: user?.id
    });
    
    // モーダルを閉じる
    setShowConfirmModal(false);
    
    // 送信成功の演出
    setShowThanks(true);
    
    // 3秒後に感謝画面を非表示にする
    setTimeout(() => {
      setShowThanks(false);
      setAmount(0);
      setDisplayAmount("0");
      setMessage("");
    }, 3000);
  };

  // 確認モーダルを閉じる処理
  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="offering-page">
      {/* 背景要素 */}
      <div className="offering-background">
        <img src={templeBackground} alt="寺院背景" className="background-image" />
        <div className="background-overlay"></div>
      </div>
      
      <div className="offering-container">
        <div className="offering-header">
          <div className="buddha-icon">
            <img src={buddhaPeace} alt="仏像" className="buddha-image" />
            <div className="icon-circle"></div>
          </div>
          <h1>御布施</h1>
          <p className="subtitle">{templeName}への感謝の気持ち</p>
          <p className="subtitle">御布施は読経や戒名授与などの謝礼として、僧侶の生活を支えるための大切なものです。</p>
          <p className="subtitle">皆様の心のこもったご支援に深く感謝申し上げます。</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {/* 感謝画面 - 送信後に表示 */}
        {showThanks && (
          <div className="thanks-overlay">
            <div className="thanks-content">
              <h2>ありがとうございます</h2>
              <p>心よりの感謝を申し上げます</p>
            </div>
          </div>
        )}
        
        {/* 確認モーダル */}
        {showConfirmModal && (
          <div className="confirm-modal-overlay">
            <div className="confirm-modal">
              <div className="confirm-modal-header">
                <h2>御布施の最終確認</h2>
              </div>
              <div className="confirm-modal-content">
                <p className="temple-name">{templeName}への御布施</p>
                <div className="confirm-amount">
                  <span className="amount-label">金額:</span>
                  <span className="amount-value">¥{displayAmount}円</span>
                </div>
                {message && (
                  <div className="confirm-message">
                    <p className="message-label">メッセージ:</p>
                    <p className="message-content">{message}</p>
                  </div>
                )}
                <p className="confirm-instruction">上記の内容でよろしければ「確定する」ボタンを押してください。</p>
              </div>
              <div className="confirm-modal-buttons">
                <button 
                  className="cancel-button"
                  onClick={closeConfirmModal}
                >
                  キャンセル
                </button>
                <button 
                  className="confirm-button"
                  onClick={confirmOffering}
                >
                  確定する
                </button>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="offering-form">
          {/* 金額入力 */}
          <div className="amount-input-container">
            <div className="amount-input-wrapper">
              <span className="currency-symbol">¥</span>
              <input
                type="text"
                id="amount"
                value={displayAmount}
                onChange={handleAmountChange}
                placeholder="0"
              />
              <span className="amount-suffix">円</span>
            </div>
          </div>
          
          {/* 金額加算ボタン */}
          <div className="amount-buttons">
            <button type="button" onClick={() => addAmount(1000)} className="amount-button">
              +1,000円
            </button>
            <button type="button" onClick={() => addAmount(3000)} className="amount-button">
              +3,000円
            </button>
            <button type="button" onClick={() => addAmount(5000)} className="amount-button">
              +5,000円
            </button>
            <button type="button" onClick={() => addAmount(10000)} className="amount-button">
              +10,000円
            </button>
          </div>
          
          {/* メッセージ入力（任意） */}
          <div className="message-input">
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="メッセージがあればご記入ください"
              rows="3"
            ></textarea>
          </div>
          
          {/* 送信ボタン */}
          <button type="submit" className="submit-button">
            お布施を送る
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default OfferingPage; 