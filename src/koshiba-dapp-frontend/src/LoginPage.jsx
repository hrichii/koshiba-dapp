import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { Actor } from "@dfinity/agent";
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";

import "./LoginPage.css";
import bgVideo from "./img/LoginPage _background.mp4";
import Image_logo from "./img/logo.jpg";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [authClient, setAuthClient] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [identityProvider, setIdentityProvider] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    
    // リダイレクト元からのエラーメッセージがあれば表示
    useEffect(() => {
        if (location.state && location.state.errorMessage) {
            setLoginError(location.state.errorMessage);
        }
    }, [location]);

    // Identity Providerの取得関数
    const getIdentityProvider = () => {
        // デバッグ情報の表示
        console.log("Environment variables:", {
            DFX_NETWORK: process.env.DFX_NETWORK,
            CANISTER_ID_INTERNET_IDENTITY: process.env.CANISTER_ID_INTERNET_IDENTITY
        });
        
        // 本番環境ではmainnetのII canisterを使用
        if (process.env.DFX_NETWORK === 'ic') {
            return "https://identity.ic0.app/#authorize";
        }
        
        // ローカル開発環境ではローカルのII canisterを使用
        // 正しいURLフォーマットに修正
        const canisterId = process.env.CANISTER_ID_INTERNET_IDENTITY || 'rdmx6-jaaaa-aaaaa-aaadq-cai';
        console.log("Using II canister ID:", canisterId);
        return `http://${canisterId}.localhost:4943/?#authorize`;
    };

    // AuthClientの初期化とIdentity Providerの設定
    useEffect(() => {
        const initAuth = async () => {
            try {
                const client = await AuthClient.create();
                setAuthClient(client);
                
                // 認証状態を確認
                const authenticated = await client.isAuthenticated();
                setIsAuthenticated(authenticated);
                
                // 認証済みの場合は、バックエンドのアクターのIDを更新
                if (authenticated) {
                    Actor.agentOf(koshiba_dapp_backend).replaceIdentity(client.getIdentity());
                }
                
                // Identity Providerを設定
                setIdentityProvider(getIdentityProvider());
                
                console.log("Identity Provider set to:", getIdentityProvider());
            } catch (error) {
                console.error("Auth initialization error:", error);
                setLoginError("認証の初期化に失敗しました。");
            } finally {
                setIsCheckingAuth(false);
            }
        };
        
        initAuth();
    }, []);

    // Internet Identityでのログイン処理
    const handleLogin = async () => {
        if (!authClient) {
            setLoginError("認証クライアントが初期化されていません。");
            return;
        }
        
        try {
            console.log("Attempting to login with provider:", identityProvider);
            setLoginError(""); // 以前のエラーメッセージをクリア
            
            await authClient.login({
                identityProvider: identityProvider,
                onSuccess: async () => {
                    console.log("II authentication successful");
                    setIsAuthenticated(true);
                    
                    // 重要: バックエンドアクターのアイデンティティを更新
                    Actor.agentOf(koshiba_dapp_backend).replaceIdentity(authClient.getIdentity());
                    
                    try {
                        console.log("Login successful, checking user data...");
                        
                        // ユーザー情報を取得
                        const userData = await koshiba_dapp_backend.getMe();
                        console.log("Raw user data after login:", userData);
                        
                        // バックエンドからの応答が配列や期待しない形式の場合の処理
                        let processedUserData = userData;
                        if (Array.isArray(userData)) {
                            console.log("User data is an array - attempting to extract properties");
                            if (userData.length === 0) {
                                console.log("Empty array returned - user not found");
                                processedUserData = null;
                            } else {
                                // 配列内の最初の要素を使用するか、必要に応じてマッピング
                                processedUserData = userData[0];
                            }
                        } else if (typeof userData === 'object' && userData !== null && Object.keys(userData).length === 0) {
                            console.log("Empty object returned - user not found");
                            processedUserData = null;
                        }
                        
                        console.log("Processed user data after login:", {
                            value: processedUserData,
                            type: typeof processedUserData,
                            isNull: processedUserData === null,
                            details: processedUserData ? {
                                last_name: processedUserData.last_name,
                                first_name: processedUserData.first_name,
                                grade: processedUserData.grade,
                                temple: processedUserData.temple,
                                vote_count: processedUserData.vote_count
                            } : 'No user data'
                        });
                        
                        // ユーザー情報の検証をより堅牢に
                        if (processedUserData && 
                            processedUserData.last_name && 
                            processedUserData.first_name && 
                            processedUserData.grade) {
                            console.log("Valid user data found after login - redirecting to home page");
                            navigate("/home");
                        } else {
                            console.log("No valid user data found after login - redirecting to registration page");
                            navigate("/register");
                        }
                    } catch (error) {
                        console.error("Failed to get user data after login:", error);
                        setLoginError("ログイン後のユーザー情報取得に失敗しました。");
                    }
                },
                onError: (error) => {
                    console.error("Login error:", error);
                    setLoginError("ログインに失敗しました: " + (error.message || "不明なエラー"));
                },
            });
        } catch (error) {
            console.error("Login attempt failed:", error);
            setLoginError("ログイン処理中にエラーが発生しました: " + (error.message || "不明なエラー"));
        }
    };

    // すでに認証済みの場合の処理
    const handleAlreadyAuthenticated = async () => {
        try {
            console.log("Already authenticated, checking user data...");
            
            // ユーザー情報を取得
            const userData = await koshiba_dapp_backend.getMe();
            console.log("Raw user data:", userData);
            
            // バックエンドからの応答が配列や期待しない形式の場合の処理
            let processedUserData = userData;
            if (Array.isArray(userData)) {
                console.log("User data is an array - attempting to extract properties");
                if (userData.length === 0) {
                    console.log("Empty array returned - user not found");
                    processedUserData = null;
                } else {
                    // 配列内の最初の要素を使用するか、必要に応じてマッピング
                    processedUserData = userData[0];
                }
            } else if (typeof userData === 'object' && userData !== null && Object.keys(userData).length === 0) {
                console.log("Empty object returned - user not found");
                processedUserData = null;
            }
            
            console.log("Processed user data:", {
                value: processedUserData,
                type: typeof processedUserData,
                isNull: processedUserData === null,
                details: processedUserData ? {
                    last_name: processedUserData.last_name,
                    first_name: processedUserData.first_name,
                    grade: processedUserData.grade,
                    temple: processedUserData.temple,
                    vote_count: processedUserData.vote_count
                } : 'No user data'
            });
            
            // ユーザー情報の検証をより堅牢に
            if (processedUserData && 
                processedUserData.last_name && 
                processedUserData.first_name && 
                processedUserData.grade) {
                console.log("Valid user data found - redirecting to home page");
                navigate("/home");
            } else {
                console.log("No valid user data found - redirecting to registration page");
                navigate("/register");
            }
        } catch (error) {
            console.error("Failed to get user data:", error);
            setLoginError("ユーザー情報の取得に失敗しました。");
        }
    };

    // ローディング中の表示
    if (isCheckingAuth) {
        return (
            <div className="loading-container">
                <p>認証状態を確認中...</p>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="video-wrapper">
                <video className="background-video" autoPlay loop muted>
                    <source src={bgVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="video-overlay"></div>
            </div>

            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <img className="logo" src={Image_logo} alt="Logo" />
                        <h1>ようこそ</h1>
                        <p className="login-subtitle">アプリケーションにログインしてください</p>
                    </div>

                    {loginError && <p className="error-message">{loginError}</p>}

                    <div className="login-options">
                        <button 
                            className="login-button" 
                            onClick={isAuthenticated ? handleAlreadyAuthenticated : handleLogin}
                            disabled={!identityProvider}
                        >
                            <div className="button-content">
                                <span className="button-icon">🔑</span>
                                <span className="button-text">
                                    {isAuthenticated 
                                        ? "続ける" 
                                        : "Internet Identityでログイン"
                                    }
                                </span>
                            </div>
                        </button>
                        <p className="login-status">
                            {isAuthenticated 
                                ? "認証済み - アプリへ進むには「続ける」をクリックしてください" 
                                : "安全なブロックチェーン認証でログインします"
                            }
                        </p>
                    </div>

                    <div className="login-footer">
                        {identityProvider && (
                            <p className="small-text debug-info">
                                Provider: {identityProvider}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
