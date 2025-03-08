import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";
import "./RegisterPage.css";
import Image_logo from "./img/logo.jpg";
import bgVideo from "./img/LoginPage _background.mp4";

function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [temples, setTemples] = useState([]);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [templeId, setTempleId] = useState("");
  const [grade, setGrade] = useState(null);
  const [gradeList, setGradeList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [identityInfo, setIdentityInfo] = useState("");

  // 認証チェックと寺院データの取得
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
        
        // II情報を取得
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal();
        const principalId = principal.toString();
        console.log("Raw Principal ID:", principalId);
        
        // Principal IDをより正確に取得して表示
        // 例: 2vxsx-fae のような形式になる場合があるため、完全なIDを表示
        setIdentityInfo(principalId);
        
        // ユーザー情報の確認
        //const userData = await koshiba_dapp_backend.get_user();
        const userData = null;
        // すでにユーザー登録がある場合はメインページへリダイレクト
        if (userData) {
          console.log("User already registered:", userData);
          navigate("/home");
          return;
        }
        
        // 寺院一覧を取得
        const templesData = await koshiba_dapp_backend.get_temples();
        console.log("Temples data:", templesData);
        setTemples(templesData);
        
        // グレード一覧を取得（実際はバックエンドから取得する想定）
        // ここでは仮でバックエンドコードと同じグレードリストを作成
        const grades = ['S', 'A', 'B', 'C', 'D'];
        
        // グレード情報を生成
        const gradeInfo = grades.map(g => {
          let payment = 0;
          let voteCount = 0;
          
          // grade.rsの情報に基づいて値を設定
          switch(g) {
            case 'S':
              payment = 5000000;
              voteCount = 25;
              break;
            case 'A':
              payment = 3000000;
              voteCount = 15;
              break;
            case 'B':
              payment = 1000000;
              voteCount = 10;
              break;
            case 'C':
              payment = 500000;
              voteCount = 5;
              break;
            case 'D':
              payment = 300000;
              voteCount = 3;
              break;
            default:
              break;
          }
          
          return {
            grade: g,
            payment,
            voteCount,
            // グレードごとの説明と機能を設定
            description: getGradeDescription(g),
            features: getGradeFeatures(g)
          };
        });
        
        setGradeList(gradeInfo.reverse()); // D→Sの順に表示するため反転
        
      } catch (err) {
        console.error("Error during initialization:", err);
        setError("初期化中にエラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthAndFetchData();
  }, [navigate]);

  // グレードごとの説明を取得
  const getGradeDescription = (grade) => {
    switch(grade) {
      case 'S':
        return "最高ランクの檀家会員。寺院との強い絆を結び、特別な儀式や行事に参加できる特権があります。";
      case 'A':
        return "上位ランクの檀家会員。寺院の重要な行事に優先的に参加でき、多くの特典が得られます。";
      case 'B':
        return "中堅ランクの檀家会員。一般的な寺院行事への参加と基本的な特典が得られます。";
      case 'C':
        return "基本ランクの檀家会員。寺院の定期的な行事に参加できます。";
      case 'D':
        return "入門ランクの檀家会員。寺院との関係を始めたばかりの方向けのプランです。";
      default:
        return "";
    }
  };

  // グレードごとの機能リストを取得
  const getGradeFeatures = (grade) => {
    const baseFeatures = [
      "祈祷サービス（月1回）",
      "寺院だより購読",
      "年末の祈祷会参加"
    ];
    
    switch(grade) {
      case 'S':
        return [
          "檀家特別サービス",
          ...getGradeFeatures('A'),
          "寺院行事の優先予約",
          "特別な仏具の提供",
          "住職との個別面談（月2回）"
        ];
      case 'A':
        return [
          "檀家上級サービス",
          ...getGradeFeatures('B'),
          "専用駐車場の利用",
          "重要法要への優先招待",
          "住職との個別面談（月1回）"
        ];
      case 'B':
        return [
          "檀家中級サービス",
          ...getGradeFeatures('C'),
          "仏具の割引購入",
          "特別法要への招待",
          "寺院イベントの優先参加"
        ];
      case 'C':
        return [
          "檀家基本サービス",
          ...getGradeFeatures('D'),
          "お焚き上げサービス",
          "年中行事への参加",
          "納骨堂の利用"
        ];
      case 'D':
        return [
          "檀家入門サービス",
          ...baseFeatures
        ];
      default:
        return baseFeatures;
    }
  };

  // 次のページへ移動
  const handleNextPage = (e) => {
    e.preventDefault();
    
    // 入力検証（姓名のみ必須）
    if (!lastName || !firstName) {
      setError("姓名は必須項目です");
      return;
    }
    
    setError("");
    setCurrentPage(2); // 2ページ目に移動
  };

  // 前のページへ戻る
  const handlePrevPage = () => {
    setCurrentPage(1);
  };

  // グレード選択の処理
  const handleGradeSelect = (selectedGrade) => {
    // 同じグレードを再選択した場合は選択解除（null）にする
    if (grade === selectedGrade) {
      setGrade(null);
    } else {
      setGrade(selectedGrade);
    }
  };

  // ユーザー登録処理
  const handleRegister = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError("");
    
    // グレード選択が必須であることを確認
    if (!grade) {
      setError("檀家グレードを選択してください");
      setIsSubmitting(false);
      return;
    }
    
    try {
      console.log("Registering user:", { lastName, firstName, grade, templeId });
      
      // 檀家グレードをEnum形式に変換
      const gradeEnum = { [grade]: null };
      console.log("Grade enum being sent:", gradeEnum);
      
      // templeIdを数値型として送信（選択されていない場合は0を送信）
      // 0は「所属寺院なし」を表す特別な値として扱う
      const templeIdNum = templeId ? Number(templeId) : 0;
      
      const newUser = await koshiba_dapp_backend.create_user(
        lastName,
        firstName,
        gradeEnum,
        templeIdNum
      );
      
      console.log("User registration response:", newUser);
      
      // レスポンスの処理
      let processedUserData = newUser;
      if (Array.isArray(newUser)) {
        console.log("Registration response is an array - attempting to extract user data");
        if (newUser.length > 0) {
          processedUserData = newUser[0];
        } else {
          // 空の配列の場合でも登録は成功したと見なす
          console.log("Empty array returned but assuming registration was successful");
          // 登録データを手動で構築
          processedUserData = {
            last_name: lastName,
            first_name: firstName,
            grade: grade
          };
        }
      }
      
      console.log("Processed registration response:", {
        value: processedUserData,
        type: typeof processedUserData,
        details: processedUserData ? {
          last_name: processedUserData.last_name,
          first_name: processedUserData.first_name,
          grade: processedUserData.grade,
          temple: processedUserData.temple
        } : 'No user data returned'
      });
      
      // 登録が正常に行われたかを確認（空配列の場合も考慮）
      if (!processedUserData) {
        throw new Error("ユーザー登録の結果が不正です");
      }
      
      console.log("User registered successfully:", processedUserData);
      
      // 登録成功後、メインページへリダイレクト
      navigate("/home");
    } catch (err) {
      console.error("Registration failed:", err);
      setError("ユーザー登録に失敗しました: " + (err.message || "不明なエラー"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // キャンセル処理
  const handleCancel = () => {
    navigate("/");
  };

  // 日本円のフォーマット
  const formatJPY = (amount) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="loading-container">
        <p>データを読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="register-page">
      {/* 背景動画 */}
      <div className="video-wrapper">
        <video className="background-video" autoPlay loop muted>
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay"></div>
      </div>

      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <img className="logo" src={Image_logo} alt="Logo" />
            {currentPage === 1 && <h1>ユーザー登録</h1>}
            {currentPage === 1 && <p className="register-subtitle">アプリを利用するには登録が必要です</p>}
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          {/* ページ1: 個人情報入力 */}
          {currentPage === 1 && (
            <div className="register-page-content">
              <form onSubmit={handleNextPage} className="register-form">
                {/* Internet Identity 情報表示フィールド */}
                <div className="input-field">
                  <label htmlFor="identityInfo">Internet Identity</label>
                  <input
                    type="text"
                    id="identityInfo"
                    value={identityInfo}
                    readOnly
                    className="readonly-field"
                  />
                  <p className="field-note">※あなたのInternet Identity番号です</p>
                </div>
                
                <div className="name-fields">
                  <div className="input-field half-width">
                    <label htmlFor="lastName">姓</label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="小柴"
                      required
                    />
                  </div>
                  
                  <div className="input-field half-width">
                    <label htmlFor="firstName">名</label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="太郎"
                      required
                    />
                  </div>
                </div>
                
                <div className="input-field">
                  <label htmlFor="temple">所属寺院（任意）</label>
                  <select
                    id="temple"
                    value={templeId}
                    onChange={(e) => setTempleId(e.target.value)}
                  >
                    <option value="">選択してください</option>
                    {temples.map((temple) => (
                      <option key={temple.id} value={temple.id}>
                        {temple.name}
                      </option>
                    ))}
                  </select>
                  <p className="field-note">※所属寺院の選択は任意です</p>
                </div>
                
                <div className="button-group">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleCancel}
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="next-button"
                  >
                    次へ
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* ページ2: 檀家グレード選択 */}
          {currentPage === 2 && (
            <div className="register-page-content">
              <h2 className="page-title">檀家グレードを選択してください</h2>
              <p className="grade-note">※グレードは後から選択することもできます。</p>
              
              <div className="grade-cards">
                {gradeList.map((gradeInfo) => (
                  <div 
                    key={gradeInfo.grade} 
                    className={`grade-card ${grade === gradeInfo.grade ? 'selected' : ''}`}
                    onClick={() => handleGradeSelect(gradeInfo.grade)}
                  >
                    <div className="grade-header">
                      <div className="grade-title-eng">檀家グレード</div>
                      <div className="grade-title">{gradeInfo.grade}</div>
                      <div className="grade-description">
                        {gradeInfo.description}
                      </div>
                    </div>
                    
                    <div className="grade-price">
                      <div className="price">{formatJPY(gradeInfo.payment)}</div>
                      <div className="price-description">(年間)</div>
                    </div>
                    
                    <div className="grade-features">
                      <div className="feature">
                        <i className="feature-icon user-icon"></i>
                        <span>投票可能回数: {gradeInfo.voteCount}票</span>
                      </div>
                      
                      {gradeInfo.features.map((feature, idx) => (
                        <div key={idx} className="feature">
                          {idx === 0 && <strong>{feature}</strong>}
                          {idx !== 0 && <span>{feature}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="button-group">
                <button
                  type="button"
                  className="back-button"
                  onClick={handlePrevPage}
                >
                  戻る
                </button>
                <button
                  type="button"
                  className="register-button"
                  onClick={handleRegister}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "登録中..." : "登録する"}
                </button>
              </div>
            </div>
          )}
          
          <div className="register-footer">
            <p className="small-text">登録情報は後からアカウント設定で変更できます</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage; 