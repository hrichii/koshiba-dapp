import React from "react";
import NotificationDetail from "./NotificationDetail";
import purificationImage from "../img/gomaki_service.jpg";

function PurificationService() {
  // お知らせの内容をJSXで定義
  const content = (
    <>
      <p>
        檀家の皆様へ、当寺院のお祓いサービスについてご案内申し上げます。
        当寺院では、様々な場面でのお祓いを承っております。
        Bグレード以上の檀家の皆様には、特別なお祓いサービスをご用意しております。
      </p>
      
      <h2>お祓いサービスの概要</h2>
      <p>
        お祓いとは、穢れや災いを祓い清める神聖な儀式です。
        新しい門出や節目、また災いを取り除きたい時などに行われます。
        当寺院では、伝統的な作法に則り、丁寧にお祓いを執り行います。
      </p>
      
      <div className="image-container">
        <img src={purificationImage} alt="お祓いの様子" />
        <p className="image-caption">当寺院でのお祓いの様子</p>
      </div>
      
      <h2>お祓いの種類</h2>
      
      <h3>1. 個人向けお祓い</h3>
      <ul>
        <li><strong>厄除け祓い</strong>：厄年や災難からの保護を祈願します</li>
        <li><strong>交通安全祓い</strong>：車や自転車などの安全運転を祈願します</li>
        <li><strong>病気平癒祓い</strong>：病気の回復と健康を祈願します</li>
        <li><strong>旅行安全祓い</strong>：旅の安全と成功を祈願します</li>
        <li><strong>進学・就職祓い</strong>：新しい門出の成功を祈願します</li>
      </ul>
      
      <h3>2. 家族・家庭向けお祓い</h3>
      <ul>
        <li><strong>家内安全祓い</strong>：家族全員の健康と幸福を祈願します</li>
        <li><strong>新築・引越し祓い</strong>：新居での幸せな生活を祈願します</li>
        <li><strong>地鎮祭</strong>：建物の建築前に土地の神を鎮め、工事の安全を祈願します</li>
        <li><strong>結婚式場祓い</strong>：結婚式の成功と夫婦の幸せを祈願します</li>
      </ul>
      
      <h3>3. ビジネス向けお祓い</h3>
      <ul>
        <li><strong>開業・開店祓い</strong>：新しいビジネスの成功を祈願します</li>
        <li><strong>社屋祓い</strong>：会社や事務所の安全と繁栄を祈願します</li>
        <li><strong>商売繁盛祓い</strong>：ビジネスの発展と繁栄を祈願します</li>
        <li><strong>機械・設備祓い</strong>：新しい機械や設備の安全な稼働を祈願します</li>
      </ul>
      
      <h2>Bグレード以上の檀家様への特別サービス</h2>
      <ol>
        <li><strong>出張お祓いサービス</strong>：ご自宅や会社など、ご指定の場所でのお祓いを承ります</li>
        <li><strong>特別祈願</strong>：より強力な祈願を込めた特別なお祓いを執り行います</li>
        <li><strong>お祓い証明書の発行</strong>：ご希望の方には、お祓い完了証明書を発行いたします</li>
        <li><strong>お守りの特別祈願</strong>：お守りに特別な祈願を込めます</li>
      </ol>
      
      <h2>お申し込み方法</h2>
      <p>
        お祓いをご希望の方は、以下のいずれかの方法でお申し込みください。
      </p>
      <ol>
        <li>当寺院ウェブサイトの「お祓い予約フォーム」からお申し込み</li>
        <li>寺院事務所にお電話（0X-XXXX-XXXX）</li>
        <li>直接寺院事務所にてお申し込み</li>
      </ol>
      
      <h2>お祓いの流れ</h2>
      <ol>
        <li><strong>お申し込み</strong>：ウェブサイト、電話、または直接事務所にてお申し込みください</li>
        <li><strong>日程調整</strong>：お祓いの日時を調整いたします</li>
        <li><strong>お祓い内容の確認</strong>：どのようなお祓いをご希望か、詳細をお伺いします</li>
        <li><strong>お祓い当日</strong>：指定の日時に住職がお祓いの儀式を執り行います</li>
        <li><strong>お祓い後のアドバイス</strong>：必要に応じて、お祓い後の過ごし方などのアドバイスをいたします</li>
      </ol>
      
      <h2>お祓い料金</h2>
      <p>
        基本料金は以下の通りです。Bグレード以上の檀家様は20%割引となります。
      </p>
      <table>
        <thead>
          <tr>
            <th>お祓いの種類</th>
            <th>料金（税込）</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>個人向けお祓い</td>
            <td>5,000円〜</td>
          </tr>
          <tr>
            <td>家族・家庭向けお祓い</td>
            <td>10,000円〜</td>
          </tr>
          <tr>
            <td>ビジネス向けお祓い</td>
            <td>30,000円〜</td>
          </tr>
          <tr>
            <td>出張お祓い（10km圏内）</td>
            <td>+10,000円</td>
          </tr>
          <tr>
            <td>特別祈願</td>
            <td>+5,000円</td>
          </tr>
          <tr>
            <td>お祓い証明書発行</td>
            <td>1,000円</td>
          </tr>
        </tbody>
      </table>
      
      <h2>お問い合わせ</h2>
      <p>
        ご不明な点がございましたら、寺院事務所（0X-XXXX-XXXX）までお問い合わせください。<br />
        受付時間：平日 9:00〜17:00
      </p>
      
      <div className="note-box">
        <p><strong>ご注意事項</strong></p>
        <ul>
          <li>お祓いの内容によっては、準備に時間がかかる場合がございます。お早めにご予約ください。</li>
          <li>出張お祓いは、地域や日時によってはお受けできない場合がございます。</li>
          <li>特定の日（大安、友引など）をご希望の場合は、お早めにご相談ください。</li>
          <li>お祓いの際には、清潔な服装でお越しください。</li>
        </ul>
      </div>
    </>
  );

  return (
    <NotificationDetail
      title="浄化サービスのご案内"
      content={content}
      requiredGrade="全ての檀家様"
      headerImage={purificationImage}
      category="サービス"
      date="2023/11/12"
      breadcrumbs={[
        { name: "ホーム", path: "/home" },
        { name: "お知らせ", path: "/notification" },
        { name: "浄化サービスのご案内", path: null }
      ]}
    />
  );
}

export default PurificationService; 