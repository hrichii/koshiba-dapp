import React, { useState, useEffect, useRef } from "react";
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
  const [postalCode1, setPostalCode1] = useState("");
  const [postalCode2, setPostalCode2] = useState("");
  const [address, setAddress] = useState("");
  const [templeId, setTempleId] = useState("");
  const [grade, setGrade] = useState(null);
  const [gradeList, setGradeList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [identityInfo, setIdentityInfo] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // 生年月日を年・月・日に分けて管理（プルダウン用）
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  
  // 入力フィールドへの参照
  const postalCode1Ref = useRef(null);
  const postalCode2Ref = useRef(null);
  const addressRef = useRef(null);

  // 年、月、日の選択肢を生成
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    // 120年前から現在までの年を生成
    for (let year = currentYear - 120; year <= currentYear; year++) {
      years.push(year);
    }
    return years.reverse(); // 新しい年が上にくるように
  };

  const generateMonths = () => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const generateDays = () => {
    // 選択された年と月に基づいて、適切な日数を計算
    if (!birthYear || !birthMonth) return Array.from({ length: 31 }, (_, i) => i + 1);
    
    const daysInMonth = new Date(birthYear, birthMonth, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  // 選択された年・月が変更されたときに日の選択肢を更新
  useEffect(() => {
    // 年と月が変更されたとき、選択可能な日を再計算
    if (birthYear && birthMonth) {
      const daysInMonth = new Date(birthYear, birthMonth, 0).getDate();
      // 選択されている日が新しい月の日数より大きい場合、日をリセット
      if (birthDay > daysInMonth) {
        setBirthDay("");
      }
    }
  }, [birthYear, birthMonth, birthDay]);

  // 年・月・日から生年月日文字列を生成する関数
  const getBirthDateString = () => {
    if (!birthYear || !birthMonth || !birthDay) return "";
    // YYYY/MM/DD 形式で返す
    const month = birthMonth.toString().padStart(2, '0');
    const day = birthDay.toString().padStart(2, '0');
    return `${birthYear}/${month}/${day}`;
  };

  // 認証チェックと寺院データの取得
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      setIsLoading(true); // 必ず最初にローディング状態に設定
      setError(""); // エラーメッセージをクリア
      
      try {
        console.log("Starting authentication check and data fetching...");
        
        // 認証状態の確認
        const authClient = await AuthClient.create();
        const authenticated = await authClient.isAuthenticated();
        console.log("Authentication status:", authenticated);
        
        if (!authenticated) {
          // 未認証の場合はログインページにリダイレクト
          console.log("User not authenticated, redirecting to login page");
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
        try {
          console.log("Fetching user data...");
          const userData = await koshiba_dapp_backend.getMe();
          console.log("User data from backend (raw):", JSON.stringify(userData));
          
          // ユーザーデータの検証
          if (userData) {
            // バックエンドからの応答が配列の場合の処理
            let processedUserData = userData;
            if (Array.isArray(userData)) {
              console.log("User data is an array - attempting to extract user data");
              if (userData.length > 0) {
                processedUserData = userData[0];
              } else {
                console.log("Empty array returned - user not found");
                processedUserData = null;
              }
            }
            
            console.log("Processed user data:", JSON.stringify(processedUserData));
            
            // ユーザー登録済みの詳細条件を確認
            const isLastNameSet = processedUserData && processedUserData.last_name && processedUserData.last_name.trim() !== '';
            const isFirstNameSet = processedUserData && processedUserData.first_name && processedUserData.first_name.trim() !== '';
            
            // grade情報の検証（オブジェクト形式またはプロパティ形式どちらでも対応）
            let isGradeSet = false;
            let gradeValue = null;
            
            if (processedUserData && processedUserData.grade) {
              if (typeof processedUserData.grade === 'object') {
                // オブジェクト形式 (例: { "S": null })
                const gradeKeys = Object.keys(processedUserData.grade);
                isGradeSet = gradeKeys.length > 0;
                if (isGradeSet) {
                  gradeValue = gradeKeys[0]; // 最初のキー（例: "S"）
                }
              } else if (typeof processedUserData.grade === 'string') {
                // 文字列形式 (例: "S")
                isGradeSet = processedUserData.grade.trim() !== '';
                gradeValue = processedUserData.grade;
              }
            }
            
            console.log("Registration check details:", {
              isLastNameSet,
              isFirstNameSet,
              isGradeSet,
              gradeValue,
              gradeType: processedUserData?.grade ? typeof processedUserData.grade : 'undefined'
            });
            
            // ユーザーが登録済みの場合（名前やグレードが設定されている場合）
            if (isLastNameSet && isFirstNameSet && isGradeSet) {
              console.log("User is already registered - redirecting to home page");
              // 遅延をさらに長くして確実にリダイレクトさせる
              setTimeout(() => {
                navigate("/home");
              }, 300); 
              return;
            } else {
              console.log("User exists but not fully registered:", {
                lastName: processedUserData?.last_name || '未設定',
                firstName: processedUserData?.first_name || '未設定',
                grade: gradeValue || '未設定'
              });
            }
          } else {
            console.log("No user data found - new user");
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          console.error("Error details:", error.message || error);
          // エラーが発生しても続行し、ユーザー登録フローに進む
        }
        
        // 寺院一覧を取得
        const templesData = await koshiba_dapp_backend.getTempleList();
        console.log("Temples data:", templesData);
        setTemples(templesData);
        
        // グレード一覧を取得（実際はバックエンドから取得する想定）
        // ここでは仮でバックエンドコードと同じグレードリストを作成
        const grades = ['S', 'A', 'B'];
        
        // グレード情報を生成
        const gradeInfo = grades.map(g => {
          let payment = 0;
          let voteCount = 0;
          
          // grade.rsの情報に基づいて値を設定
          switch(g) {
            case 'S':
              payment = 50000;
              voteCount = 25;
              break;
            case 'A':
              payment = 10000;
              voteCount = 10;
              break;
            case 'B':
              payment = 3000;
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
        
        setGradeList(gradeInfo);
        
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
        return "中堅ランクの檀家会員。寺院の重要な行事に参加でき、多くの特典が得られます。";
      case 'B':
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
          ...getGradeFeatures('A'),
          "寺院行事の優先予約",
          "特別な仏具の提供",
          "住職との個別面談（月2回）"
        ];
      case 'A':
        return [
          ...getGradeFeatures('B'),
          "仏具の割引購入",
          "特別法要への招待",
          "寺院イベントの優先参加"
        ];
      case 'B':
        return [
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
    
    // 生年月日の検証
    if (!birthYear || !birthMonth || !birthDay) {
      setError("生年月日を選択してください");
      return;
    }
    
    // 郵便番号の簡易検証
    if ((postalCode1 && !/^\d{3}$/.test(postalCode1)) || (postalCode2 && !/^\d{4}$/.test(postalCode2))) {
      setError("郵便番号は正しい形式で入力してください（例：123-4567）");
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
      // 郵便番号をハイフン付きで結合
      const postalCode = postalCode1 && postalCode2 ? `${postalCode1}-${postalCode2}` : "";
      
      console.log("Registering user:", { 
        lastName, 
        firstName, 
        birthDate: getBirthDateString(),
        postalCode,
        address,
        templeId: templeId || 0,
        grade
      });
      
      // 檀家グレードをEnum形式に変換
      const gradeEnum = { [grade]: null };
      console.log("Grade enum being sent:", gradeEnum);
      
      // templeIdを数値型として送信（選択されていない場合は0を送信）
      // 0は「所属寺院なし」を表す特別な値として扱う
      const templeIdNum = templeId ? Number(templeId) : 0;
      
      // 注意: 現在のAPIはこれらの新しいフィールドを受け付けないため、
      // 実際の送信ではこれらの値は使用せず、既存のAPIを使用します
      const newUser = await koshiba_dapp_backend.updateMe(
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

  /* 生年月日入力部分のみを差し替え */
  const renderBirthDateSelectors = () => {
    return (
      <div className="input-field">
        <label htmlFor="birthDate">生年月日</label>
        <div className="birth-date-container">
          <select
            id="birthYear"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            className="birth-selector"
            required
          >
            <option value="">年</option>
            {generateYears().map(year => (
              <option key={year} value={year}>{year}年</option>
            ))}
          </select>
          
          <select
            id="birthMonth"
            value={birthMonth}
            onChange={(e) => setBirthMonth(e.target.value)}
            className="birth-selector"
            required
          >
            <option value="">月</option>
            {generateMonths().map(month => (
              <option key={month} value={month}>{month}月</option>
            ))}
          </select>
          
          <select
            id="birthDay"
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
            className="birth-selector"
            required
          >
            <option value="">日</option>
            {generateDays().map(day => (
              <option key={day} value={day}>{day}日</option>
            ))}
          </select>
        </div>
      </div>
    );
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
                  <label htmlFor="identityInfo">Principal ID</label>
                  <input
                    type="text"
                    id="identityInfo"
                    value={identityInfo}
                    readOnly
                    className="readonly-field"
                  />
                  <p className="field-note">※Principal ID</p>
                </div>
                
                <div className="name-fields">
                  <div className="input-field half-width">
                    <label htmlFor="lastName">名字</label>
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
                    <label htmlFor="firstName">名前</label>
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
                
                {/* 生年月日のプルダウンを表示 */}
                {renderBirthDateSelectors()}
                
                <div className="input-field">
                  <label htmlFor="postalCode">郵便番号</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      id="postalCode1"
                      value={postalCode1}
                      onChange={(e) => setPostalCode1(e.target.value)}
                      placeholder="123"
                      maxLength="3"
                      style={{ width: '30%' }}
                      ref={postalCode1Ref}
                    />
                    <span style={{ margin: '0 10px' }}>-</span>
                    <input
                      type="text"
                      id="postalCode2"
                      value={postalCode2}
                      onChange={(e) => setPostalCode2(e.target.value)}
                      placeholder="4567"
                      maxLength="4"
                      style={{ width: '40%' }}
                      ref={postalCode2Ref}
                    />
                  </div>
                  <p className="field-note">※β版のため登録はされません</p>
                </div>
                <div className="input-field">
                  <label htmlFor="address">住所</label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="東京都○○区××町1-2-3"
                    ref={addressRef}
                  />
                  <p className="field-note">※β版のため登録はされません</p>
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
                    className={`grade-card grade-card-${gradeInfo.grade} ${grade === gradeInfo.grade ? 'selected' : ''}`}
                    onClick={() => handleGradeSelect(gradeInfo.grade)}
                  >
                    <div className="grade-header">
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
                        <span><strong>投票可能回数: {gradeInfo.voteCount}票</strong></span>
                      </div>
                      
                      {gradeInfo.features.map((feature, idx) => (
                        <div key={idx} className="feature">
                          {idx === 0 && <span>{feature}</span>}
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