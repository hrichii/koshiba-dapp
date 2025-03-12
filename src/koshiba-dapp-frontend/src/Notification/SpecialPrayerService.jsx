import React from "react";
import NotificationDetail from "./NotificationDetail";
import specialPrayerImage from "../img/prayer_service.jpg";

function SpecialPrayerService() {
  // コンテンツデータ
  const content = (
    <>
      <p>檀家の皆様へ</p>
      <p>当寺院では、檀家の皆様に個別面談サービスを提供しております。お悩みごとや仏教に関するご質問など、住職が直接お話を伺います。</p>
      
      <h2>住職との個別面談の概要</h2>
      <table>
        <tbody>
          <tr>
            <th>実施日</th>
            <td>毎月第2・第4土曜日</td>
          </tr>
          <tr>
            <th>時間</th>
            <td>10:00～16:00（1回30分）</td>
          </tr>
          <tr>
            <th>場所</th>
            <td>本堂隣接の面談室</td>
          </tr>
          <tr>
            <th>料金</th>
            <td>無料</td>
          </tr>
        </tbody>
      </table>
      
      <h2>個別面談でご相談いただける内容</h2>
      <ul>
        <li>仏教の教えに関する質問</li>
        <li>法事やお墓に関するご相談</li>
        <li>人生の悩みや心配事</li>
        <li>家族の問題</li>
        <li>終活に関するご相談</li>
        <li>仏壇や仏具に関するアドバイス</li>
      </ul>
      
      <h2>予約方法</h2>
      <p>面談をご希望の方は、以下の方法でご予約ください。</p>
      <ol>
        <li>電話予約：0120-XXX-XXX（平日9:00～17:00）</li>
        <li>窓口予約：寺務所にて直接お申し込み</li>
        <li>アプリ予約：アプリ内の予約フォームから</li>
      </ol>
      <p>※予約状況により、ご希望の日時に添えない場合がございます。お早めにご予約ください。</p>
      
      <h2>来月の予約可能日</h2>
      <p>下記の日程で予約を受け付けております。</p>
      <ul>
        <li>12月9日（土）：残り3枠</li>
        <li>12月23日（土）：残り5枠</li>
      </ul>
      
      <h2>面談当日の流れ</h2>
      <ol>
        <li>受付：面談室前の受付で予約確認を行います</li>
        <li>待合室：お呼びするまで待合室でお待ちください</li>
        <li>面談：住職とのプライベートな面談（30分）</li>
        <li>お茶：ご希望の方には面談後にお茶をご用意します</li>
      </ol>
      
      <h2>よくあるご質問</h2>
      <h3>Q. 予約なしでも相談できますか？</h3>
      <p>A. 住職のスケジュール調整のため、必ず事前予約をお願いしております。</p>
      
      <h3>Q. 家族と一緒に相談できますか？</h3>
      <p>A. はい、ご家族でのご相談も歓迎しております。ご予約時にお申し付けください。</p>
      
      <h3>Q. 相談内容は秘密厳守ですか？</h3>
      <p>A. はい、すべての相談内容は厳守いたします。安心してお話しください。</p>
      
      <p>住職との個別面談を通じて、心の平安や問題解決のお手伝いができれば幸いです。どうぞお気軽にご予約ください。</p>
      
      <hr />
      
      <p className="contact-info">
        <strong>■ お問い合わせ</strong><br />
        寺務所：0120-XXX-XXX（平日9時〜17時）<br />
        メール：info@koshiba-temple.com
      </p>
    </>
  );

  return (
    <NotificationDetail
      title="住職との個別面談のご案内"
      content={content}
      requiredGrade="全ての檀家様"
      headerImage={specialPrayerImage}
      category="サービス"
      date="2023/11/05"
      breadcrumbs={[
        { name: "ホーム", path: "/home" },
        { name: "お知らせ", path: "/notification" },
        { name: "住職との個別面談のご案内", path: null }
      ]}
    />
  );
}

export default SpecialPrayerService; 