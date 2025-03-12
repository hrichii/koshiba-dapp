import React from 'react';
import NotificationDetail from "./NotificationDetail";
import eventIcon from "../img/PriorityParticipation.png";

function PriorityParticipation() {
  // お知らせの内容をJSXで定義
  const content = (
    <>
      <div className="notification-section">
        <h2>優先参加特典のご案内</h2>
        <p>
          当寺院では、B級以上の檀家の皆様に、人気の高い寺院イベントへの優先参加権を
          ご提供しております。毎回すぐに定員に達してしまう人気イベントにも、
          優先的にご参加いただくことが可能です。
        </p>
      </div>

      <div className="notification-section">
        <h2>優先参加が適用されるイベント</h2>
        <ul>
          <li>写経会（毎月第2日曜日開催）</li>
          <li>座禅会（毎月第3土曜日開催）</li>
          <li>仏教講座（隔月開催）</li>
          <li>寺院コンサート（年4回開催）</li>
          <li>特別拝観ツアー（不定期開催）</li>
          <li>お寺でヨガ（毎週水曜日開催）</li>
        </ul>
      </div>

      <div className="notification-section">
        <h2>優先参加の方法</h2>
        <p>
          優先参加をご希望の場合は、以下の方法でお申し込みください：
        </p>
        <ol>
          <li>各イベントの一般受付開始の1週間前から、檀家専用フォームまたは電話で予約を受け付けます</li>
          <li>お申し込みの際に「優先参加希望」とお伝えください</li>
          <li>檀家番号をお伝えいただくと、ご利用資格を確認いたします</li>
        </ol>
        <p>
          なお、優先参加枠には定員がございます。お早めにお申し込みください。
        </p>
      </div>

      <div className="notification-section">
        <h2>近日開催のイベント情報</h2>
        <table className="notification-table">
          <thead>
            <tr>
              <th>イベント名</th>
              <th>開催日</th>
              <th>定員</th>
              <th>優先枠</th>
              <th>優先受付開始日</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>新春写経会</td>
              <td>1月14日（日）</td>
              <td>30名</td>
              <td>10名</td>
              <td>12月24日〜</td>
            </tr>
            <tr>
              <td>初詣座禅会</td>
              <td>1月20日（土）</td>
              <td>20名</td>
              <td>8名</td>
              <td>12月30日〜</td>
            </tr>
            <tr>
              <td>新年仏教講座</td>
              <td>2月4日（日）</td>
              <td>50名</td>
              <td>15名</td>
              <td>1月14日〜</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <NotificationDetail
      title="寺院イベントの優先参加について"
      content={content}
      requiredGrade="全ての檀家様"
      headerImage={eventIcon}
      category="特典"
      date="2023/11/15"
      breadcrumbs={[
        { name: "ホーム", path: "/dashboard" },
        { name: "お知らせ", path: "/notifications" },
        { name: "寺院イベントの優先参加について", path: null }
      ]}
    />
  );
}

export default PriorityParticipation; 