import React from 'react';
import NotificationDetail from "./NotificationDetail";
import eventIcon from "../img/year_end_prayer.jpg";

function SpecialCeremony() {
  // お知らせの内容をJSXで定義
  const content = (
    <>
      <div className="notification-section">
        <h2>特別法要のご案内</h2>
        <p>
          檀家の皆様にのみご案内している特別法要を開催いたします。
          日頃のご支援に感謝を込めて、厳かな法要と精進料理によるお斎をご用意しております。
        </p>
        <p>
          <strong>日程：</strong> 6月15日（土）<br />
          <strong>時間：</strong> 13:00〜15:30（受付開始12:30）<br />
          <strong>場所：</strong> 本堂および客殿<br />
          <strong>対象：</strong> 檀家の皆様（代表1名＋ご家族1名まで）
        </p>
      </div>

      <div className="notification-section">
        <h2>法要内容</h2>
        <ul>
          <li>13:00〜13:45 特別法要（本尊開帳あり）</li>
          <li>13:45〜14:00 住職法話</li>
          <li>14:00〜15:30 精進料理によるお斎</li>
        </ul>
      </div>

      <div className="notification-section">
        <h2>特別展示</h2>
        <p>
          今回の法要に合わせて、通常非公開の寺宝を特別展示いたします。
          当寺院に伝わる江戸時代の仏画や古文書、ご本尊の御開帳など、
          普段はなかなかご覧いただけない貴重な文化財をご覧いただける機会です。
        </p>
      </div>

      <div className="notification-section">
        <h2>参加申込について</h2>
        <p>
          参加ご希望の方は、以下の方法でお申し込みください。
        </p>
        <ul>
          <li>寺院事務所にて直接申込</li>
          <li>電話にてご予約（0XX-XXX-XXXX）</li>
          <li>当ウェブサイトの申込フォームから</li>
        </ul>
        <p>
          <strong>申込締切：</strong> 6月5日（水）<br />
          <strong>持ち物：</strong> 念珠、御朱印帳（希望者）
        </p>
      </div>
    </>
  );

  return (
    <NotificationDetail
      title="特別法要へのご招待"
      content={content}
      requiredGrade="全ての檀家様"
      headerImage={eventIcon}
      category="イベント"
      date="2023/11/18"
      breadcrumbs={[
        { name: "ホーム", path: "/home" },
        { name: "お知らせ", path: "/notification" },
        { name: "特別法要へのご招待", path: null }
      ]}
    />
  );
}

export default SpecialCeremony; 