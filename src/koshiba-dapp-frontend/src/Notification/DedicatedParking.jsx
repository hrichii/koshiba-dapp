import React from "react";
import NotificationDetail from "./NotificationDetail";
import parkingImage from "../img/parking.png";

function DedicatedParking() {
  // お知らせの内容をJSXで定義
  const content = (
    <>
      <p>
        Rank A以上の檀家の皆様へ、当寺院では特別な特典として、寺院専用駐車場をご利用いただけるサービスをご提供しております。
        参拝時や法要の際に、駐車場の心配をすることなく、ゆっくりとご参拝いただけます。
      </p>
      
      
      <h2>専用駐車場のご案内</h2>
      <p>
        当寺院の敷地内に、Rank A以上の檀家様専用の駐車スペースをご用意しております。
        一般の駐車場よりも寺院入口に近い場所にあり、雨天時や荷物が多い場合にも便利にご利用いただけます。
      </p>
      
      <h3>駐車場詳細</h3>
      <table>
        <thead>
          <tr>
            <th>項目</th>
            <th>内容</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>場所</td>
            <td>寺院本堂東側（本堂入口より徒歩約30秒）</td>
          </tr>
          <tr>
            <td>収容台数</td>
            <td>10台（障がい者用スペース2台を含む）</td>
          </tr>
          <tr>
            <td>利用可能時間</td>
            <td>7:00〜19:00（特別法要の際は延長あり）</td>
          </tr>
          <tr>
            <td>利用料金</td>
            <td>無料</td>
          </tr>
        </tbody>
      </table>
      
      <h2>ご利用方法</h2>
      <ol>
        <li><strong>事前予約</strong>：法要や祭事など混雑が予想される日には、前日までにお電話またはウェブサイトにてご予約ください。</li>
        <li><strong>駐車場入口での認証</strong>：駐車場入口のインターホンでお名前と檀家番号をお伝えください。</li>
        <li><strong>専用タグの表示</strong>：車内から見える位置に、お渡しする専用タグを掲示してください。</li>
      </ol>
      
      <div className="note-box">
        <h3>専用タグについて</h3>
        <p>
          専用タグは、初回ご利用時に寺院事務所にてお渡しします。<br />
          紛失された場合は再発行いたしますので、寺院事務所までお申し出ください。
        </p>
      </div>
      
      <h2>予約方法</h2>
      <p>
        混雑が予想される法要や祭事の際には、以下のいずれかの方法で事前にご予約ください。
      </p>
      <ul>
        <li>寺院ウェブサイト内の「専用駐車場予約」ページから</li>
        <li>寺院事務所への電話：0X-XXXX-XXXX（受付時間：9:00〜17:00）</li>
        <li>寺院事務所に直接お越しいただき、予約フォームにご記入</li>
      </ul>
      
      <h2>特別イベント時の駐車場予約状況</h2>
      <p>
        以下の特別イベント時には、混雑が予想されるため、事前予約を強くお勧めいたします。
        現在の予約状況は以下の通りです。
      </p>
      <table>
        <thead>
          <tr>
            <th>イベント名</th>
            <th>日程</th>
            <th>予約状況</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>春季彼岸法要</td>
            <td>3月20日</td>
            <td><span className="status-busy">残り2台</span></td>
          </tr>
          <tr>
            <td>花祭り</td>
            <td>4月8日</td>
            <td><span className="status-available">空きあり</span></td>
          </tr>
          <tr>
            <td>開山忌法要</td>
            <td>5月15日</td>
            <td><span className="status-full">満車</span></td>
          </tr>
        </tbody>
      </table>
      <p className="last-updated">※予約状況は2023年3月1日現在のものです。最新情報はウェブサイトまたはお電話でご確認ください。</p>
      
      <h2>ご利用上の注意</h2>
      <ul>
        <li>駐車場の利用時間は最大3時間までとなります。それ以上のご利用をご希望の場合は、寺院事務所までご相談ください。</li>
        <li>駐車場内での事故や盗難等については、当寺院では責任を負いかねますので、貴重品の管理にはご注意ください。</li>
        <li>大型車（全長5m以上）のご利用をご希望の場合は、事前にお問い合わせください。</li>
        <li>駐車場満車の場合は、近隣の公共駐車場をご案内いたします。</li>
      </ul>
      
      <h2>アクセスマップ</h2>
      <div className="image-container">
        <img src={parkingImage} alt="駐車場アクセスマップ" />
        <p className="image-caption">専用駐車場の位置（赤枠内）</p>
      </div>
      
      <p>
        赤枠内が檀家様専用駐車場です。寺院本堂の東側入口からお入りください。<br />
        門の表示に従って、インターホンでお名前と檀家番号をお伝えいただくと、門が開きます。
      </p>
      
      <h2>お問い合わせ</h2>
      <p>
        専用駐車場についてのご質問や、予約状況の確認は、寺院事務所（0X-XXXX-XXXX）までお気軽にお問い合わせください。<br />
        受付時間：平日 9:00〜17:00
      </p>
    </>
  );

  return (
    <NotificationDetail
      title="専用駐車場のご利用案内"
      content={content}
      requiredGrade="全ての檀家様"
      headerImage={parkingImage}
      category="特典"
      date="2023/11/10"
      breadcrumbs={[
        { name: "ホーム", path: "/dashboard" },
        { name: "お知らせ", path: "/notifications" },
        { name: "専用駐車場のご利用案内", path: null }
      ]}
    />
  );
}

export default DedicatedParking; 