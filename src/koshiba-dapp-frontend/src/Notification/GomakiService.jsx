import React from "react";
import NotificationDetail from "./NotificationDetail";
import gomakiImage from "../img/gomaki_service.jpg";

function GomakiService() {
  // コンテンツデータ
  const content = (
    <>
      <p>檀家の皆様へ</p>
      <p>当寺院では毎月のお焚き上げサービスを実施しております。古くなったお札、お守り、神棚や仏壇のお供え物など、感謝の気持ちを込めてお焚き上げいたします。</p>
      
      <h2>お焚き上げサービスの概要</h2>
      <table>
        <tbody>
          <tr>
            <th>実施日</th>
            <td>毎月1日、15日</td>
          </tr>
          <tr>
            <th>受付時間</th>
            <td>9:00～16:00</td>
          </tr>
          <tr>
            <th>場所</th>
            <td>当寺院境内 焚き上げ場</td>
          </tr>
          <tr>
            <th>料金</th>
            <td>檀家：無料（お気持ち）<br />一般：初穂料1,000円～</td>
          </tr>
        </tbody>
      </table>
      
      <h2>お焚き上げの対象物</h2>
      <h3>お焚き上げできるもの</h3>
      <ul>
        <li>神社のお札、おふだ</li>
        <li>お守り、厄除け札</li>
        <li>正月飾り、しめ縄</li>
        <li>古くなったご位牌（木製のもの）</li>
        <li>だるま</li>
        <li>神棚、仏壇のお供え物</li>
        <li>古くなった仏具（木製・紙製のもの）</li>
      </ul>
      
      <h3>お焚き上げできないもの</h3>
      <ul>
        <li>プラスチック製品</li>
        <li>金属製品</li>
        <li>ガラス製品</li>
        <li>合成繊維製品</li>
        <li>写真・アルバム</li>
        <li>燃焼時に有害ガスを発生するもの</li>
      </ul>
      <p>※お焚き上げできないものについては、別途ご相談ください。</p>
      
      <h2>お申し込み方法</h2>
      <p>お焚き上げをご希望の方は、以下の方法でお申し込みください。</p>
      <ol>
        <li>当寺院窓口：直接お持ちいただくか、お電話でご予約ください</li>
        <li>オンライン予約：当アプリのマイページからお申し込みいただけます</li>
        <li>郵送：お焚き上げ希望のものを寺院宛にお送りください（送料は自己負担）</li>
      </ol>
      
      <h2>お焚き上げの心得</h2>
      <p>お焚き上げは、単に不要になったものを処分するのではなく、感謝の気持ちを込めて炎に返す神聖な儀式です。以下の点にご留意ください。</p>
      <ul>
        <li>お焚き上げするものには「お焚き上げ」と明記し、袋やひもでまとめましょう</li>
        <li>神札やお守りは直接床に置かず、紙や布の上に置きましょう</li>
        <li>お焚き上げ前に、使用したことへの感謝の気持ちを込めて「ありがとう」と心で唱えましょう</li>
      </ul>
      
      <h2>お焚き上げの流れ</h2>
      <ol>
        <li>寺院窓口または専用受付でお焚き上げ物をお預けください</li>
        <li>受付にて芳名帳へのご記入をお願いします</li>
        <li>お気持ち（初穂料）を納めていただきます</li>
        <li>当日のお焚き上げをご希望の場合は、儀式の時間をお知らせします</li>
        <li>住職がお経を唱え、清めの儀式を行います</li>
        <li>お焚き上げ物を炎に返します</li>
      </ol>
      
      <p>今後もお焚き上げのスケジュールや特別祈祷についての情報を随時更新してまいります。ご不明な点がございましたら、お気軽に寺務所までお問い合わせください。</p>
      
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
      title="お焚き上げサービスのご案内"
      content={content}
      requiredGrade="全ての檀家様"
      headerImage={gomakiImage}
      category="サービス"
      date="2023/12/03"
      breadcrumbs={[
        { name: "ホーム", path: "/dashboard" },
        { name: "お知らせ", path: "/notifications" },
        { name: "お焚き上げサービスのご案内", path: null }
      ]}
    />
  );
}

export default GomakiService; 