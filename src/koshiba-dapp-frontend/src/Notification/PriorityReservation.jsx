import React from "react";
import NotificationDetail from "./NotificationDetail";
import eventImage from "../img/PriorityReservation.png";

function PriorityReservation() {
  // お知らせの内容をJSXで定義
  const content = (
    <>
      <p>
        Rank S檀家の皆様へ、特別な特典として、当寺院の全ての行事に最優先でご予約いただけるサービスについてご案内申し上げます。
        寺院の大切な法要や各種行事に、優先的かつ確実にご参加いただけます。
      </p>
      
      <div className="image-container">
        <img src={eventImage} alt="寺院行事のイメージ" />
        <p className="image-caption">当寺院の特別法要の様子</p>
      </div>
      
      <h2>寺院行事の優先予約の特典</h2>
      <ul>
        <li><strong>全ての寺院行事に最優先でご予約可能</strong>：定員のある行事でも、Rank S檀家様は最優先でお席を確保いたします</li>
        <li><strong>一般予約開始前の先行予約権</strong>：一般の檀家様への予約開始の2週間前から予約可能</li>
        <li><strong>VIP席の確保</strong>：主要な法要では、最前列または特別席をご用意</li>
        <li><strong>同伴者3名まで優先予約可能</strong>：ご家族やご友人も一緒にご参加いただけます</li>
        <li><strong>専用受付</strong>：混雑する行事でも、専用受付でスムーズにご案内</li>
      </ul>
      
      <h2>今後の主要行事予定</h2>
      <p>以下の行事は特に人気が高く、一般予約では満席になることが予想されます。Rank S檀家様は優先的にご予約いただけます。</p>
      
      <table>
        <thead>
          <tr>
            <th>行事名</th>
            <th>日程</th>
            <th>場所</th>
            <th>優先予約開始日</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>春季彼岸法要</td>
            <td>3月20日 10:00〜</td>
            <td>本堂</td>
            <td>2月20日〜</td>
          </tr>
          <tr>
            <td>花まつり</td>
            <td>4月8日 13:00〜</td>
            <td>本堂・境内</td>
            <td>3月8日〜</td>
          </tr>
          <tr>
            <td>座禅体験会</td>
            <td>4月15日 6:00〜</td>
            <td>禅堂</td>
            <td>3月15日〜</td>
          </tr>
          <tr>
            <td>開山忌法要</td>
            <td>5月15日 10:00〜</td>
            <td>本堂</td>
            <td>4月15日〜</td>
          </tr>
          <tr>
            <td>写経体験</td>
            <td>5月28日 14:00〜</td>
            <td>客殿</td>
            <td>4月28日〜</td>
          </tr>
          <tr>
            <td>夏の特別法話</td>
            <td>6月10日 15:00〜</td>
            <td>本堂</td>
            <td>5月10日〜</td>
          </tr>
        </tbody>
      </table>
      
      <h2>優先予約の方法</h2>
      <p>以下のいずれかの方法で、優先予約を承ります。</p>
      <ol>
        <li><strong>専用ウェブフォーム</strong>：寺院ウェブサイトのマイページから「S檀家様専用予約フォーム」にアクセス</li>
        <li><strong>専用電話窓口</strong>：S檀家様専用ダイヤル（0X-XXXX-XXXX）にお電話</li>
        <li><strong>担当職員へ直接連絡</strong>：皆様専任の担当職員へ直接ご連絡</li>
      </ol>
      
      <div className="special-box">
        <h3>Rank S檀家様の新サービスのご案内</h3>
        <p>
          2023年4月より、Rank S檀家様向けに「行事完全自動予約サービス」を開始いたします。<br />
          ご希望の行事カテゴリをあらかじめご登録いただくと、新しい行事が決まり次第、自動的に予約を確保いたします。<br />
          詳細は担当職員までお問い合わせください。
        </p>
      </div>
      
      <h2>優先席のご案内</h2>
      <p>
        主要な法要や行事では、Rank S檀家様とそのご家族のために、特別な優先席をご用意しております。
        優先席は以下の特徴があります。
      </p>
      <ul>
        <li>本堂最前列または中央の席</li>
        <li>クッション付きの特別座布団</li>
        <li>お茶やお水などのドリンクサービス</li>
        <li>専用の案内係がご案内</li>
      </ul>
      
      <h3>本堂の優先席配置図</h3>
      <div className="image-container">
        <img src={eventImage} alt="優先席配置図" />
        <p className="image-caption">本堂内の優先席配置（赤色部分）</p>
      </div>
      
      <h2>キャンセルポリシー</h2>
      <p>
        やむを得ない理由でご参加いただけなくなった場合は、できるだけ早めにご連絡ください。<br />
        Rank S檀家様は、行事の前日までキャンセル料は発生いたしません。
      </p>
      <p>
        ただし、以下のケースではキャンセル料が発生する場合がございますので、ご了承ください。
      </p>
      <ul>
        <li>特別な準備が必要な行事（写経・座禅体験など）の当日キャンセル</li>
        <li>食事や特別なお土産が含まれる行事の当日キャンセル</li>
      </ul>
      
      <h2>お問い合わせ</h2>
      <p>
        ご質問やご要望がございましたら、S檀家様専用ダイヤル（0X-XXXX-XXXX）までお気軽にお問い合わせください。<br />
        受付時間：9:00〜19:00（年中無休）
      </p>
      
      <div className="note-box">
        <p>
          ※Rank S檀家様の特典は、寺院の発展と維持にご貢献いただいている皆様への感謝の気持ちとして提供しております。<br />
          ※行事の内容や日程は、諸事情により変更になる場合がございます。その際は速やかにご連絡いたします。
        </p>
      </div>
    </>
  );

  return (
    <NotificationDetail
      title="寺院行事の優先予約について"
      content={content}
      requiredGrade="全ての檀家様"
      headerImage={eventImage}
      category="特典"
      date="2023/11/01"
      breadcrumbs={[
        { name: "ホーム", path: "/dashboard" },
        { name: "お知らせ", path: "/notifications" },
        { name: "寺院行事の優先予約について", path: null }
      ]}
    />
  );
}

export default PriorityReservation; 