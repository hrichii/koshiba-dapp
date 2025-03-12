import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './MobileHeader.css';
import Image_logo from "./img/logo.jpg";

function MobileHeader() {
    const location = useLocation();
    const path = location.pathname;
    
    // パスに応じてbodyにクラスを追加/削除する
    useEffect(() => {
        const shouldShowHeader = path === '/home' ||
                               path === '/search' || 
                               path === '/participate' || 
                               path === '/notification' || 
                               path.startsWith('/notification/');
        
        if (shouldShowHeader) {
            document.body.classList.add('has-mobile-header');
        } else {
            document.body.classList.remove('has-mobile-header');
        }
        
        // クリーンアップ関数
        return () => {
            document.body.classList.remove('has-mobile-header');
        };
    }, [path]);

    // 現在のパスによってヘッダーの内容を変更
    const renderHeaderContent = () => {
        // アカウントページではヘッダーを表示しない
        if (path === '/account') {
            return null;
        }
        
        // ホームページ
        else if (path === '/home') {
            return (
                <div className="mobile-header home-header">
                    <div className="logo-container">
                        <img src={Image_logo} alt="ロゴ" className="header-logo" />
                    </div>
                </div>
            );
        }
        
        // お寺を探すページ（検索ページ）
        else if (path === '/search') {
            return (
                <div className="mobile-header">
                    <div className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input 
                            type="text" 
                            placeholder="寺院名・地域名で検索" 
                            className="search-input"
                        />
                    </div>
                </div>
            );
        }
        
        // 参加ページ
        else if (path === '/participate') {
            return (
                <div className="mobile-header">
                    <h1 className="header-title">参加</h1>
                </div>
            );
        }
        
        // お知らせページ
        else if (path === '/notification' || path.startsWith('/notification/')) {
            return (
                <div className="mobile-header">
                    <h1 className="header-title">お知らせ</h1>
                </div>
            );
        }
        
        // その他のページ（デフォルトではヘッダーを表示しない）
        return null;
    };

    return renderHeaderContent();
}

export default MobileHeader; 