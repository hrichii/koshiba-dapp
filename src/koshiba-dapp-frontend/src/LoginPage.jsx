import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { Actor } from "@dfinity/agent";
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";

import "./LoginPage.css";
import bgVideo from "./img/LoginMovie.mp4";
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
            // エラーメッセージが表示されたらトップへスクロール
            window.scrollTo(0, 0);
        }
    }, [location]);

    // Identity Providerの取得関数
    const getIdentityProvider = () => {
        // デバッグ情報の表示
        console.log("環境変数情報:", {
            DFX_NETWORK: process.env.DFX_NETWORK,
            NODE_ENV: process.env.NODE_ENV,
            CANISTER_ID_INTERNET_IDENTITY: process.env.CANISTER_ID_INTERNET_IDENTITY
        });
        
        // 環境判定のロジック
        const isProduction = process.env.DFX_NETWORK === 'ic' || window.location.host.endsWith('.ic0.app') || window.location.host.endsWith('.icp0.io');
        console.log(`環境判定: ${isProduction ? '本番環境' : '開発環境'}`);
        
        // 本番環境ではmainnetのII canisterを使用
        if (isProduction) {
            console.log("本番環境のII認証を使用します: https://identity.ic0.app");
            return "https://identity.ic0.app/#authorize";
        }
        
        // ローカル開発環境ではローカルのII canisterを使用
        const defaultLocalCanisterId = 'rdmx6-jaaaa-aaaaa-aaadq-cai'; // デフォルトのローカルII canister ID
        const canisterId = process.env.CANISTER_ID_INTERNET_IDENTITY || defaultLocalCanisterId;
        const port = process.env.LOCAL_II_PORT || 4943; // ポート番号を環境変数から取得（デフォルト: 4943）
        
        const localIdentityUrl = `http://${canisterId}.localhost:${port}/#authorize`;
        console.log(`開発環境のII認証を使用します: ${localIdentityUrl}`);
        console.log(`- II canister ID: ${canisterId}`);
        console.log(`- ポート番号: ${port}`);
        
        return localIdentityUrl;
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
                // 初期化完了時にページトップにスクロール
                window.scrollTo(0, 0);
            }
        };
        
        initAuth();
    }, []);

    // Internet Identityでのログイン処理
    const handleLogin = async () => {
        if (!authClient) {
            setLoginError("認証クライアントが初期化されていません。");
            // エラー時にトップへスクロール
            window.scrollTo(0, 0);
            return;
        }
        
        try {
            console.log("認証プロバイダーを使用してログインを試みます:", identityProvider);
            setLoginError(""); // 以前のエラーメッセージをクリア
            
            await authClient.login({
                identityProvider: identityProvider,
                onSuccess: async () => {
                    console.log("Internet Identity認証成功");
                    setIsAuthenticated(true);
                    
                    // 重要: バックエンドアクターのアイデンティティを更新
                    Actor.agentOf(koshiba_dapp_backend).replaceIdentity(authClient.getIdentity());
                    
                    try {
                        console.log("ログイン成功、ユーザー情報を確認中...");
                        
                        // ユーザー情報を取得
                        const userData = await koshiba_dapp_backend.getMe();
                        console.log("ログイン後の生ユーザーデータ:", userData);
                        
                        // バックエンドからの応答が配列や期待しない形式の場合の処理
                        let processedUserData = userData;
                        if (Array.isArray(userData)) {
                            console.log("ユーザーデータが配列形式です - プロパティの抽出を試みます");
                            if (userData.length === 0) {
                                console.log("空の配列が返されました - ユーザーが見つかりません");
                                processedUserData = null;
                            } else {
                                // 配列内の最初の要素を使用するか、必要に応じてマッピング
                                processedUserData = userData[0];
                            }
                        } else if (typeof userData === 'object' && userData !== null && Object.keys(userData).length === 0) {
                            console.log("空のオブジェクトが返されました - ユーザーが見つかりません");
                            processedUserData = null;
                        }
                        
                        console.log("処理後のユーザーデータ:", {
                            value: processedUserData,
                            type: typeof processedUserData,
                            isNull: processedUserData === null,
                            details: processedUserData ? {
                                last_name: processedUserData.last_name,
                                first_name: processedUserData.first_name,
                                grade: processedUserData.grade,
                                temple: processedUserData.temple,
                                vote_count: processedUserData.vote_count
                            } : 'ユーザーデータなし'
                        });
                        
                        // ユーザー情報の検証をより堅牢に
                        if (processedUserData && 
                            processedUserData.last_name && 
                            processedUserData.first_name && 
                            processedUserData.grade) {
                            console.log("有効なユーザーデータが見つかりました - ホームページにリダイレクトします");
                            // ページ遷移前にスクロール位置をリセット
                            window.scrollTo(0, 0);
                            navigate("/home");
                        } else {
                            console.log("有効なユーザーデータが見つかりませんでした - 登録ページにリダイレクトします");
                            // ページ遷移前にスクロール位置をリセット
                            window.scrollTo(0, 0);
                            navigate("/register");
                        }
                    } catch (error) {
                        console.error("ログイン後のユーザー情報取得に失敗しました:", error);
                        const errorDetail = error.message || (typeof error === 'object' ? JSON.stringify(error) : '不明なエラー');
                        setLoginError(`ログイン後のユーザー情報取得に失敗しました: ${errorDetail}`);
                        // エラー時にトップへスクロール
                        window.scrollTo(0, 0);
                    }
                },
                onError: (error) => {
                    console.error("ログインエラー:", error);
                    let errorMessage = "ログインに失敗しました";
                    
                    // エラーの種類に基づいたメッセージ
                    if (error.message) {
                        if (error.message.includes("connection") || error.message.includes("network")) {
                            errorMessage = "ネットワーク接続エラーが発生しました。インターネット接続を確認してください。";
                        } else if (error.message.includes("timeout")) {
                            errorMessage = "認証サーバーの応答がタイムアウトしました。後でもう一度お試しください。";
                        } else if (error.message.includes("cancel")) {
                            errorMessage = "認証がキャンセルされました。もう一度お試しください。";
                        } else {
                            errorMessage = `ログインエラー: ${error.message}`;
                        }
                    }
                    
                    setLoginError(errorMessage);
                    // エラー時にトップへスクロール
                    window.scrollTo(0, 0);
                },
            });
        } catch (error) {
            console.error("ログイン処理中に例外が発生しました:", error);
            const errorDetail = error.message || (typeof error === 'object' ? JSON.stringify(error) : '不明なエラー');
            setLoginError(`ログイン処理中に予期せぬエラーが発生しました: ${errorDetail}`);
            // エラー時にトップへスクロール
            window.scrollTo(0, 0);
        }
    };

    // すでに認証済みの場合の処理
    const handleAlreadyAuthenticated = async () => {
        try {
            console.log("すでに認証済みです。ユーザー情報を確認しています...");
            
            // ユーザー情報を取得
            const userData = await koshiba_dapp_backend.getMe();
            console.log("生ユーザーデータ:", userData);
            
            // バックエンドからの応答が配列や期待しない形式の場合の処理
            let processedUserData = userData;
            if (Array.isArray(userData)) {
                console.log("ユーザーデータが配列形式です - プロパティの抽出を試みます");
                if (userData.length === 0) {
                    console.log("空の配列が返されました - ユーザーが見つかりません");
                    processedUserData = null;
                } else {
                    // 配列内の最初の要素を使用するか、必要に応じてマッピング
                    processedUserData = userData[0];
                }
            } else if (typeof userData === 'object' && userData !== null && Object.keys(userData).length === 0) {
                console.log("空のオブジェクトが返されました - ユーザーが見つかりません");
                processedUserData = null;
            }
            
            console.log("処理後のユーザーデータ:", {
                value: processedUserData,
                type: typeof processedUserData,
                isNull: processedUserData === null,
                details: processedUserData ? {
                    last_name: processedUserData.last_name,
                    first_name: processedUserData.first_name,
                    grade: processedUserData.grade,
                    temple: processedUserData.temple,
                    vote_count: processedUserData.vote_count
                } : 'ユーザーデータなし'
            });
            
            // ユーザー情報の検証をより堅牢に
            if (processedUserData && 
                processedUserData.last_name && 
                processedUserData.first_name && 
                processedUserData.grade) {
                console.log("有効なユーザーデータが見つかりました - ホームページにリダイレクトします");
                // ページ遷移前にスクロール位置をリセット
                window.scrollTo(0, 0);
                navigate("/home");
            } else {
                console.log("有効なユーザーデータが見つかりませんでした - 登録ページにリダイレクトします");
                // ページ遷移前にスクロール位置をリセット
                window.scrollTo(0, 0);
                navigate("/register");
            }
        } catch (error) {
            console.error("ユーザー情報の取得に失敗しました:", error);
            const errorDetail = error.message || (typeof error === 'object' ? JSON.stringify(error) : '不明なエラー');
            setLoginError(`ユーザー情報の取得に失敗しました: ${errorDetail}`);
            // エラー時にトップへスクロール
            window.scrollTo(0, 0);
        }
    };

    // ローディング中の表示
    if (isCheckingAuth) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>認証状態を確認中...</p>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="video-wrapper">
                <video className="background-video" autoPlay loop muted>
                    <source src={bgVideo} type="video/mp4" />
                    お使いのブラウザはビデオタグをサポートしていません。
                </video>
                <div className="video-overlay"></div>
            </div>

            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <img className="logo" src={Image_logo} alt="ロゴ" />
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
                                : "安全な分散型クラウド認証でログインします"
                            }
                        </p>
                    </div>

                    <div className="login-footer">
                        {identityProvider && (
                            <p className="small-text debug-info">
                                認証プロバイダー: {identityProvider}
                            </p>
                        )}
                        <p className="small-text">
                            {process.env.DFX_NETWORK === 'ic' ? '本番環境' : '開発環境'}で実行中
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
