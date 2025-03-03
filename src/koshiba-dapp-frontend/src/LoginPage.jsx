import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 例: バックエンドCanisterを呼び出すためのimport
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";

import "./LoginPage.css";
import bgVideo from "./img/LoginPage _background.mp4";
import Image_logo from "./img/logo.jpg";

function LoginPage() {
    const navigate = useNavigate();

    const [loginId, setLoginId] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const [registerLoginId, setRegisterLoginId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    // temple は「選択された寺院のID」を保持する
    const [temple, setTemple] = useState("");
    const [temples, setTemples] = useState([]); // get_temples で取得した一覧を管理
    const [dankaGrade, setDankaGrade] = useState("");
    const [registerError, setRegisterError] = useState("");

    // 檀家グレードと対応する投票数（Rustの Grade::vote_count() に合わせる）
    const gradeVoteCounts = {
        S: 25,
        A: 15,
        B: 10,
        C: 5,
        D: 3,
    };

    // 最初にコンポーネントがマウントされたタイミングで寺院一覧を取得
    useEffect(() => {
        const fetchTemples = async () => {
        try {
            const templeList = await koshiba_dapp_backend.get_temples();
            setTemples(templeList);
        } catch (error) {
            console.error("get_temples error:", error);
        }
        };
        fetchTemples();
    }, []);

    const handleLogin = () => {
        const regex = /^[0-9]{7}$/;
        if (regex.test(loginId)) {
        navigate("/home");
        } else {
        setLoginError("Internet Identityは7桁の数字で入力してください。");
        }
    };

    const openRegisterModal = () => {
        setRegisterError("");
        setIsRegisterModalOpen(true);
    };

    const closeRegisterModal = () => {
        setIsRegisterModalOpen(false);
    };

    // モーダル外クリックで閉じる
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
        closeRegisterModal();
        }
    };

    // 新規登録ボタン押下時の処理
    const handleRegister = async () => {
        // 必須チェック
        if (!registerLoginId || !firstName || !lastName) {
            setRegisterError("Internet Identity、First name、Last nameは必須入力です。");
            return;
            }
            // 7桁の数字チェック
            const regex = /^[0-9]{7}$/;
            if (!regex.test(registerLoginId)) {
            setRegisterError("Internet Identityは7桁の数字で入力してください。");
            return;
            }
            // 檀家グレードの選択必須チェック
            if (!dankaGrade) {
            setRegisterError("檀家グレードを選択してください。");
            return;
            }
            // 寺院の選択必須チェック
            if (!temple) {
            setRegisterError("所属寺院を選択してください。");
            return;
        }

        try {
            // 文字列からenumオブジェクトへの変換
            const gradeMapping = {
                S: { S: null },
                A: { A: null },
                B: { B: null },
                C: { C: null },
                D: { D: null },
        };
        const gradeEnum = gradeMapping[dankaGrade];
        // 寺院IDの変換
        const templeId = parseInt(temple, 10);
        // 変換後の値をバックエンドのcreate_userに渡す
        await koshiba_dapp_backend.create_user(lastName, firstName, gradeEnum, templeId);
        
            // 登録が完了したらホーム画面へ遷移
        navigate("/home");
        } catch (error) {
            console.error("create_user error:", error);
            setRegisterError("新規登録に失敗しました。");
        }
    };
    // 檀家グレード選択ボタン
    const selectDankaGrade = (grade) => {
        setDankaGrade(grade);
    };

    return (
        <div className="login-page">
        <div className="video-wrapper">
            <video className="background-video" autoPlay loop muted>
            <source src={bgVideo} type="video/mp4" />
            Your browser does not support the video tag.
            </video>
            <div className="video-overlay" />
        </div>

        <div className="login-form">
            <img className="logo" src={Image_logo} alt="Logo" />

            <h1>
            Choose Identity <span role="img" aria-label="key">🔑</span>
            </h1>
            <p className="subheading">to continue</p>

            <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="Internet Identity"
            className="login-input"
            />

            {loginError && <p className="error-message">{loginError}</p>}

            <button className="login-button" onClick={handleLogin}>
            ログイン
            </button>

            <div className="more-options" onClick={openRegisterModal}>
            新規登録はこちら
            </div>
        </div>

        {isRegisterModalOpen && (
            <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <h2 className="modal-title">新規登録</h2>
                <div className="input-field">
                <input
                    type="text"
                    value={registerLoginId}
                    onChange={(e) => setRegisterLoginId(e.target.value)}
                    placeholder="Internet Identity (必須 / 7桁数字)"
                />
                </div>
                <div className="input-field">
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="名（First name）"
                />
                </div>
                <div className="input-field">
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="姓（Last name）"
                />
                </div>

                {/* 寺院一覧を取得して表示する */}
                <div className="input-field">
                <select value={temple} onChange={(e) => setTemple(e.target.value)}>
                    <option value="">所属寺院(選択してください)</option>
                    {temples.map((t) => (
                    <option key={t.id} value={t.id}>
                        {t.name}
                    </option>
                    ))}
                </select>
                </div>

                {/* 檀家グレード S,A,B,C,D の表示と選択 */}
                <div className="input-field">
                <label>檀家グレード</label>
                <div className="choice-chips">
                    {Object.entries(gradeVoteCounts).map(([grade, count]) => (
                    <button
                        key={grade}
                        type="button"
                        className={dankaGrade === grade ? "chip selected" : "chip"}
                        onClick={() => selectDankaGrade(grade)}
                    >
                        {grade} (投票数: {count})
                    </button>
                    ))}
                </div>
                </div>
                {registerError && <p className="error-message">{registerError}</p>}
                <div className="button-group">
                <button onClick={handleRegister}>新規登録</button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
}

export default LoginPage;
