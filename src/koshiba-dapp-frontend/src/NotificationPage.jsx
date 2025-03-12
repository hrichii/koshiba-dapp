import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthClient } from "@dfinity/auth-client";
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";
import "./NotificationPage.css";

function NotificationPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [allNotifications, setAllNotifications] = useState([]);
    
    // ローカルストレージから保存されていたカテゴリを読み込む
    const [selectedCategory, setSelectedCategory] = useState(() => {
        // 詳細ページから戻ってきた場合はローカルストレージの値を使用
        if (location.state && location.state.preserveFilter) {
            const savedCategory = localStorage.getItem('selectedNotificationCategory');
            return savedCategory || "all";
        }
        // それ以外の場合（直接アクセスや他ページからの遷移）も
        // ローカルストレージの値を使用
        const savedCategory = localStorage.getItem('selectedNotificationCategory');
        return savedCategory || "all";
    });

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
                try {
                    console.log("Trying to fetch user data...");
                    const userData = await koshiba_dapp_backend.getMe();
                    console.log("Raw user data:", userData);
                    
                    // ユーザーデータの安全な処理
                    if (userData) {
                        setUser(userData);
                        // グレードに関係なく全てのお知らせを表示
                        const notificationsData = getAllNotifications();
                        setAllNotifications(notificationsData);
                        setNotifications(notificationsData);
                    } else {
                        console.log("No user data returned");
                        setUser(null);
                        const notificationsData = getAllNotifications();
                        setAllNotifications(notificationsData);
                        setNotifications(notificationsData);
                    }
                } catch (fetchErr) {
                    console.error("Error fetching user data:", fetchErr);
                    console.error("Error details:", fetchErr.message, fetchErr.stack);
                    setUser(null);
                    const notificationsData = getAllNotifications();
                    setAllNotifications(notificationsData);
                    setNotifications(notificationsData);
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

    // カテゴリフィルタリングの変更時に通知リストを更新
    useEffect(() => {
        if (selectedCategory === "all") {
            setNotifications(allNotifications);
        } else {
            const filtered = allNotifications.filter(
                notification => notification.category === getCategoryNameFromKey(selectedCategory)
            );
            setNotifications(filtered);
        }

        // カテゴリをローカルストレージに保存
        localStorage.setItem('selectedNotificationCategory', selectedCategory);
    }, [selectedCategory, allNotifications]);

    // カテゴリキーから表示名を取得する関数
    const getCategoryNameFromKey = (key) => {
        switch(key) {
            case 'notice': return 'お知らせ';
            case 'event': return 'イベント';
            case 'service': return 'サービス';
            case 'benefit': return '特典';
            default: return '';
        }
    };

    // カテゴリ表示名からキーを取得する関数
    const getCategoryKeyFromName = (name) => {
        switch(name) {
            case 'お知らせ': return 'notice';
            case 'イベント': return 'event';
            case 'サービス': return 'service';
            case '特典': return 'benefit';
            default: return 'default';
        }
    };

    // 全てのお知らせを取得する関数
    const getAllNotifications = () => {
        console.log("Getting all notifications regardless of grade");
        
        // 全てのお知らせを配列として定義
        const allNotifications = [
            // Dグレードのお知らせ
            {
                id: "temple-newsletter",
                title: "寺院だより最新号",
                summary: "今月の寺院だよりが発行されました。季節の行事や仏教の教えについて解説しています。",
                category: "お知らせ",
                date: "2023/12/10",
                grade: "D"
            },
            {
                id: "year-end-prayer",
                title: "年末の祈祷会参加募集",
                summary: "今年も年末の特別祈祷会を開催します。どなたでもご参加いただけます。",
                category: "イベント",
                date: "2023/12/05",
                grade: "D"
            },
            // Cグレードのお知らせ
            {
                id: "gomaki-service",
                title: "お焚き上げサービスのご案内",
                summary: "毎月のお焚き上げサービスの日程と申込方法についてご案内します。",
                category: "サービス",
                date: "2023/12/03",
                grade: "C"
            },
            {
                id: "annual-events",
                title: "年中行事カレンダー",
                summary: "今年の年中行事予定表です。ぜひご参加ください。",
                category: "イベント",
                date: "2023/11/28",
                grade: "C"
            },
            {
                id: "ossuary-usage",
                title: "納骨堂利用について",
                summary: "納骨堂の利用方法と空き状況についての最新情報です。",
                category: "お知らせ",
                date: "2023/11/25",
                grade: "C"
            },
            // Bグレードのお知らせ
            {
                id: "buddhist-items-discount",
                title: "仏具の割引購入プログラム",
                summary: "当寺院指定の仏具を特別価格でご購入いただけます。最新のカタログをご覧ください。",
                category: "特典",
                date: "2023/11/20",
                grade: "B"
            },
            {
                id: "special-ceremony",
                title: "特別法要へのご招待",
                summary: "来月の特別法要にご招待します。檀家の皆様だけの特別な機会です。",
                category: "イベント",
                date: "2023/11/18",
                grade: "B"
            },
            {
                id: "priority-participation",
                title: "寺院イベントの優先参加について",
                summary: "人気の高い寺院イベントに優先的にご参加いただけます。近日開催のイベント情報をご確認ください。",
                category: "特典",
                date: "2023/11/15",
                grade: "B"
            },
            // Aグレードのお知らせ
            {
                id: "prayer-service",
                title: "祈祷サービスのご案内",
                summary: "毎月のご祈祷サービスについて最新情報をお届けします。",
                category: "お知らせ",
                date: "2023/10/20",
                grade: "A"
            },
            {
                id: "dedicated-parking",
                title: "専用駐車場のご利用案内",
                summary: "寺院専用駐車場のご利用方法と注意事項についてご案内します。",
                category: "特典",
                date: "2023/11/10",
                grade: "A"
            },
            {
                id: "priority-invitation",
                title: "重要法要への優先招待",
                summary: "来月の重要法要に優先的にご招待します。特別席をご用意しております。",
                category: "イベント",
                date: "2023/11/08",
                grade: "A"
            },
            {
                id: "priest-meeting",
                title: "住職との個別面談（月1回）のご案内",
                summary: "毎月の住職との個別面談の予約を受け付けております。ご希望の日時をお知らせください。",
                category: "サービス",
                date: "2023/11/05",
                grade: "A"
            },
            // Sグレードのお知らせ
            {
                id: "priority-reservation",
                title: "寺院行事の優先予約について",
                summary: "すべての寺院行事に最優先でご予約いただけます。今後の行事予定をご確認ください。",
                category: "特典",
                date: "2023/11/01",
                grade: "S"
            },
            {
                id: "special-buddhist-items",
                title: "特別な仏具の提供プログラム",
                summary: "特別に選定された高級仏具を特別価格でご提供しています。最新カタログをご覧ください。",
                category: "特典",
                date: "2023/10/28",
                grade: "S"
            },
            {
                id: "priest-meeting-twice",
                title: "住職との個別面談（月2回）のご案内",
                summary: "月に2回の住職との個別面談の予約を受け付けております。ご希望の日時をお知らせください。",
                category: "サービス",
                date: "2023/10/25",
                grade: "S"
            }
        ];
        
        // 日付でソート（新しい順）
        allNotifications.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log(`Loaded ${allNotifications.length} notifications regardless of grade`, allNotifications);
        return allNotifications;
    };

    // カテゴリに対応する色を取得
    const getCategoryColor = (category) => {
        switch (category) {
            case 'お知らせ':
                return 'category-notice';
            case 'イベント':
                return 'category-event';
            case 'サービス':
                return 'category-service';
            case '特典':
                return 'category-benefit';
            default:
                return 'category-default';
        }
    };

    // カテゴリボタンのクリックハンドラー
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    // カテゴリの種類をカウント
    const getCategoryCounts = () => {
        const counts = {
            notice: 0, // お知らせ
            event: 0,  // イベント
            service: 0, // サービス
            benefit: 0  // 特典
        };
        
        allNotifications.forEach(notification => {
            const key = getCategoryKeyFromName(notification.category);
            if (counts[key] !== undefined) {
                counts[key]++;
            }
        });
        
        return counts;
    };

    // カテゴリカウントを取得
    const categoryCounts = getCategoryCounts();

    return (
        <div className="notification-page">
            {error && <p className="error-message">{error}</p>}
            
            {/* カテゴリフィルターボタン */}
            <div className="category-filter-container">
                <button 
                    className={`category-filter-btn ${selectedCategory === 'all' ? 'active all' : ''}`}
                    onClick={() => handleCategoryClick('all')}
                >
                    全て ({allNotifications.length})
                </button>
                <button 
                    className={`category-filter-btn ${selectedCategory === 'notice' ? 'active notice' : ''}`}
                    onClick={() => handleCategoryClick('notice')}
                >
                    お知らせ ({categoryCounts.notice})
                </button>
                <button 
                    className={`category-filter-btn ${selectedCategory === 'event' ? 'active event' : ''}`}
                    onClick={() => handleCategoryClick('event')}
                >
                    イベント ({categoryCounts.event})
                </button>
                <button 
                    className={`category-filter-btn ${selectedCategory === 'service' ? 'active service' : ''}`}
                    onClick={() => handleCategoryClick('service')}
                >
                    サービス ({categoryCounts.service})
                </button>
                <button 
                    className={`category-filter-btn ${selectedCategory === 'benefit' ? 'active benefit' : ''}`}
                    onClick={() => handleCategoryClick('benefit')}
                >
                    特典 ({categoryCounts.benefit})
                </button>
            </div>
            
            <div className="notification-list">
                {notifications.map((notification) => (
                    <Link 
                        key={notification.id} 
                        to={`/notification/${getCategoryKeyFromName(notification.category)}-${notification.id}`} 
                        className="notification-item"
                    >
                        <div className="notification-header">
                            <span className={`category-tag ${getCategoryColor(notification.category)}`}>
                                {notification.category}
                            </span>
                            <span className="notification-date">{notification.date}</span>
                        </div>
                        <h3 className="notification-title">{notification.title}</h3>
                        <p className="notification-summary">{notification.summary}</p>
                        <div className="notification-arrow">
                            <span>›</span>
                        </div>
                    </Link>
                ))}
                
                {notifications.length === 0 && (
                    <div className="no-notifications">
                        <p>該当するお知らせはありません</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NotificationPage;
