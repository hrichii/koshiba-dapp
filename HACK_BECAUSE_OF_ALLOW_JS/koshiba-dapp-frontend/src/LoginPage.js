import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const [temple, setTemple] = useState("");
    const [dankaGrade, setDankaGrade] = useState("");
    const [registerError, setRegisterError] = useState("");
    const handleLogin = () => {
        const regex = /^[0-9]{7}$/;
        if (regex.test(loginId)) {
            navigate("/home");
        }
        else {
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
    const handleRegister = () => {
        if (!registerLoginId || !firstName || !lastName) {
            setRegisterError("Internet Identity、First name、Last nameは必須入力です。");
            return;
        }
        const regex = /^[0-9]{7}$/;
        if (!regex.test(registerLoginId)) {
            setRegisterError("Internet Identityは7桁の数字で入力してください。");
            return;
        }
        navigate("/home");
    };
    const selectDankaGrade = (grade) => {
        setDankaGrade(grade);
    };
    const templeOptions = [
        { value: "増上寺", label: "増上寺（東京都港区）" },
        { value: "傳通院", label: "傳通院（東京都文京区）" },
        { value: "靈巖寺", label: "靈巖寺（東京都江東区）" },
        { value: "靈山寺", label: "靈山寺（東京都墨田区）" },
        { value: "幡隨院", label: "幡隨院（東京都小金井市）" },
        { value: "蓮馨寺", label: "蓮馨寺（埼玉県川越市）" },
        { value: "勝願寺", label: "勝願寺（埼玉県鴻巢市）" },
        { value: "大善寺", label: "大善寺（東京都八王子市）" },
        { value: "淨國寺", label: "淨國寺（埼玉県埼玉市岩槻区）" },
        { value: "光明寺", label: "光明寺（神奈川県鎌倉市）" },
    ];
    return (<div className="login-page">
        <div className="video-wrapper">
            <video className="background-video" autoPlay loop muted>
            <source src={bgVideo} type="video/mp4"/>
            Your browser does not support the video tag.
            </video>
            <div className="video-overlay"/>
        </div>

        <div className="login-form">
            <img className="logo" src={Image_logo} alt="Logo"/>

            <h1>
            Choose Identity <span role="img" aria-label="key">🔑</span>
            </h1>
            <p className="subheading">to continue</p>

            <input type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="Internet Identity" className="login-input"/>

            {loginError && <p className="error-message">{loginError}</p>}

            <button className="login-button" onClick={handleLogin}>
            ログイン
            </button>

            <div className="more-options" onClick={openRegisterModal}>
            新規登録はこちら
            </div>
        </div>

        {isRegisterModalOpen && (<div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <h2 className="modal-title">新規登録</h2>
                <div className="input-field">
                <input type="text" value={registerLoginId} onChange={(e) => setRegisterLoginId(e.target.value)} placeholder="Internet Identity (必須 / 7桁数字)"/>
                </div>
                <div className="input-field">
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="名（First name）"/>
                </div>
                <div className="input-field">
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="姓（Last name）"/>
                </div>
                <div className="input-field">
                <select value={temple} onChange={(e) => setTemple(e.target.value)}>
                    <option value="">所属寺院(選択してください)</option>
                    {templeOptions.map((option) => (<option key={option.value} value={option.value}>
                        {option.label}
                    </option>))}
                </select>
                </div>
                <div className="input-field">
                <label>檀家グレード</label>
                <div className="choice-chips">
                    <button type="button" className={dankaGrade === "S" ? "chip selected" : "chip"} onClick={() => selectDankaGrade("S")}>
                    S (投票数: 10)
                    </button>
                    <button type="button" className={dankaGrade === "A" ? "chip selected" : "chip"} onClick={() => selectDankaGrade("A")}>
                    A (投票数: 5)
                    </button>
                    <button type="button" className={dankaGrade === "B" ? "chip selected" : "chip"} onClick={() => selectDankaGrade("B")}>
                    B (投票数: 3)
                    </button>
                    <button type="button" className={dankaGrade === "C" ? "chip selected" : "chip"} onClick={() => selectDankaGrade("C")}>
                    C (投票数: 1)
                    </button>
                </div>
                </div>
                {registerError && <p className="error-message">{registerError}</p>}

                <div className="button-group">
                <button onClick={handleRegister}>新規登録</button>
                </div>
            </div>
            </div>)}
        </div>);
}
export default LoginPage;
