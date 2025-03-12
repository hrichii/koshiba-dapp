import React from "react";
import NotificationDetail from "./NotificationDetail";
import buddhistItemsImage from "../img/buddhist_items.jpg";

function BuddhistItemsDiscount() {
  // お知らせの内容をJSXで定義
  const content = (
    <>
      <p>
        Rank B以上の檀家の皆様へ、当寺院では高品質な仏具を特別価格でご提供する「仏具の割引購入プログラム」をご用意しております。
        仏壇や仏具は、大切なご先祖様を敬い、供養するための大切な道具です。
        当寺院がお勧めする良質な仏具を、檀家の皆様だけの特別価格でお求めいただけます。
      </p>
      
      <div className="image-container">
        <img src={buddhistItemsImage} alt="仏具のイメージ" />
        <p className="image-caption">当寺院推奨の高品質仏具</p>
      </div>
      
      <h2>割引購入プログラムの特長</h2>
      <ul>
        <li><strong>高品質な仏具</strong>：熟練の職人が丁寧に作り上げた、品質にこだわった仏具をご提供</li>
        <li><strong>特別割引価格</strong>：Rank Bの檀家様には通常価格から15%OFF、Rank A以上はさらにお得な割引率</li>
        <li><strong>住職による仏具選定サポート</strong>：ご自宅の仏壇に合わせた最適な仏具をご提案</li>
        <li><strong>送料無料</strong>：10,000円以上のご購入で送料無料（北海道・沖縄・離島を除く）</li>
        <li><strong>アフターサポート</strong>：購入後のお手入れ方法のアドバイスやメンテナンスサービス</li>
      </ul>
      
      <h2>対象商品一覧</h2>
      <p>※表示価格は定価です。割引後の価格はログイン後、専用ページでご確認ください。</p>
      
      <h3>仏像</h3>
      <table>
        <thead>
          <tr>
            <th>商品名</th>
            <th>材質</th>
            <th>サイズ</th>
            <th>定価（税込）</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>阿弥陀如来座像</td>
            <td>檜木（国産）</td>
            <td>高さ15cm</td>
            <td>50,000円</td>
          </tr>
          <tr>
            <td>阿弥陀如来座像</td>
            <td>檜木（国産）</td>
            <td>高さ20cm</td>
            <td>80,000円</td>
          </tr>
          <tr>
            <td>阿弥陀如来座像</td>
            <td>檜木（国産）</td>
            <td>高さ30cm</td>
            <td>120,000円</td>
          </tr>
          <tr>
            <td>観音菩薩立像</td>
            <td>檜木（国産）</td>
            <td>高さ20cm</td>
            <td>70,000円</td>
          </tr>
          <tr>
            <td>地蔵菩薩立像</td>
            <td>檜木（国産）</td>
            <td>高さ20cm</td>
            <td>65,000円</td>
          </tr>
        </tbody>
      </table>
      
      <h3>仏具セット</h3>
      <table>
        <thead>
          <tr>
            <th>商品名</th>
            <th>セット内容</th>
            <th>材質</th>
            <th>定価（税込）</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>基本仏具セット（小）</td>
            <td>りん・りん棒・花立・香炉・火立・仏飯器</td>
            <td>真鍮製</td>
            <td>30,000円</td>
          </tr>
          <tr>
            <td>基本仏具セット（中）</td>
            <td>りん・りん棒・花立・香炉・火立・仏飯器</td>
            <td>真鍮製 金メッキ</td>
            <td>50,000円</td>
          </tr>
          <tr>
            <td>高級仏具セット</td>
            <td>りん・りん棒・花立・香炉・火立・仏飯器・茶湯器</td>
            <td>真鍮製 金メッキ</td>
            <td>100,000円</td>
          </tr>
          <tr>
            <td>モダン仏具セット</td>
            <td>りん・りん棒・花立・香炉・火立・仏飯器</td>
            <td>アルミ製 陽極酸化処理</td>
            <td>45,000円</td>
          </tr>
        </tbody>
      </table>
      
      <h3>位牌</h3>
      <table>
        <thead>
          <tr>
            <th>商品名</th>
            <th>材質</th>
            <th>サイズ</th>
            <th>定価（税込）</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>繊細彫刻位牌</td>
            <td>黒檀</td>
            <td>4.0寸</td>
            <td>25,000円</td>
          </tr>
          <tr>
            <td>繊細彫刻位牌</td>
            <td>黒檀</td>
            <td>5.0寸</td>
            <td>35,000円</td>
          </tr>
          <tr>
            <td>唐木位牌</td>
            <td>紫檀</td>
            <td>4.0寸</td>
            <td>40,000円</td>
          </tr>
          <tr>
            <td>唐木位牌</td>
            <td>紫檀</td>
            <td>5.0寸</td>
            <td>55,000円</td>
          </tr>
        </tbody>
      </table>
      
      <h2>ご購入方法</h2>
      <ol>
        <li><strong>専用ページでの閲覧</strong>：当寺院ウェブサイト内の専用ページにログインして、割引価格と商品詳細をご確認ください</li>
        <li><strong>お問い合わせ</strong>：ご興味のある商品について、寺院事務所にお問い合わせください</li>
        <li><strong>仏具相談会</strong>：毎月第2日曜日に開催している仏具相談会にご参加いただくと、実物を見ながらご相談いただけます</li>
        <li><strong>ご注文</strong>：ウェブサイト、電話、または直接寺院事務所にてご注文ください</li>
        <li><strong>お支払い・お届け</strong>：銀行振込または寺院事務所での現金支払い。お届けは約2〜3週間後</li>
      </ol>
      
      <div className="special-offer">
        <h3>期間限定特別キャンペーン</h3>
        <p>
          2023年12月31日までのご注文で、通常の割引に加えて、さらに5%OFFになる特別キャンペーンを実施中！<br />
          この機会にぜひご検討ください。
        </p>
      </div>
      
      <h2>仏具のお手入れ講座</h2>
      <p>
        Rank B以上の檀家様を対象に、仏具の正しいお手入れ方法をお伝えする講座を開催しています。<br />
        大切な仏具を長く美しく保つコツを、当寺院の住職が直接ご指導いたします。
      </p>
      <table>
        <thead>
          <tr>
            <th>開催日</th>
            <th>時間</th>
            <th>定員</th>
            <th>参加費</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>毎月第4土曜日</td>
            <td>14:00〜15:30</td>
            <td>10名</td>
            <td>無料</td>
          </tr>
        </tbody>
      </table>
      <p>※お申し込みは寺院事務所またはウェブサイトにて受け付けております。</p>
      
      <h2>お問い合わせ</h2>
      <p>
        仏具についてのご質問や、商品の詳細については、寺院事務所（0X-XXXX-XXXX）までお気軽にお問い合わせください。<br />
        受付時間：平日 9:00〜17:00
      </p>
      
      <div className="note-box">
        <p><strong>ご注意事項</strong></p>
        <ul>
          <li>商品の在庫状況により、お届けまでにお時間をいただく場合がございます。</li>
          <li>表示価格は予告なく変更される場合がございます。</li>
          <li>写真と実際の商品では、色味や質感が若干異なる場合がございます。</li>
          <li>特別割引は檀家様本人のご購入に限ります。転売目的でのご購入はご遠慮ください。</li>
        </ul>
      </div>
    </>
  );

  return (
    <NotificationDetail
      title="仏具の割引購入プログラム"
      content={content}
      requiredGrade="全ての檀家様"
      headerImage={buddhistItemsImage}
      category="特典"
      date="2023/11/20"
      breadcrumbs={[
        { name: "ホーム", path: "/home" },
        { name: "お知らせ", path: "/notification" },
        { name: "仏具の割引購入プログラム", path: null }
      ]}
    />
  );
}

export default BuddhistItemsDiscount; 