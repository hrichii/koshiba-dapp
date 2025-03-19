import React from "react";
import NotificationDetail from "./NotificationDetail";
import eventImage from "../img/AnnualEvents.png";

function AnnualEvents() {
  // お知らせの内容をJSXで定義
  const content = (
    <>
      <p>
        檀家の皆様へ、当寺院の年中行事カレンダーをご案内申し上げます。
        Rank C以上の檀家の皆様は、こちらのカレンダーに記載されている行事に参加いただけます。
        一年を通じて様々な行事を行っておりますので、ぜひご参加ください。
      </p>
      
      <h2>年間行事カレンダー（2023年度）</h2>
      <p>
        以下の行事は、Rank C以上の檀家様がご参加いただける行事です。
        各行事の詳細は、開催の1ヶ月前に別途ご案内いたします。
      </p>
      
      <h3>【1月】新年・初詣</h3>
      <table>
        <thead>
          <tr>
            <th>行事名</th>
            <th>日程</th>
            <th>内容</th>
            <th>参加条件</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>除夜の鐘</td>
            <td>12/31 23:30〜</td>
            <td>年越しの鐘つき体験</td>
            <td>事前予約制</td>
          </tr>
          <tr>
            <td>修正会</td>
            <td>1/1 10:00〜</td>
            <td>新年初の法要</td>
            <td>自由参加</td>
          </tr>
          <tr>
            <td>新年祈願祭</td>
            <td>1/3 13:00〜</td>
            <td>新年の安全と繁栄を祈願</td>
            <td>事前予約制</td>
          </tr>
        </tbody>
      </table>
      
      <h3>【2月】節分</h3>
      <table>
        <thead>
          <tr>
            <th>行事名</th>
            <th>日程</th>
            <th>内容</th>
            <th>参加条件</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>節分会</td>
            <td>2/3 15:00〜</td>
            <td>豆まきと厄除け祈願</td>
            <td>自由参加</td>
          </tr>
          <tr>
            <td>涅槃会</td>
            <td>2/15 10:00〜</td>
            <td>お釈迦様の命日の法要</td>
            <td>自由参加</td>
          </tr>
        </tbody>
      </table>
      
      <h3>【3月】春分・彼岸</h3>
      <table>
        <thead>
          <tr>
            <th>行事名</th>
            <th>日程</th>
            <th>内容</th>
            <th>参加条件</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>春季彼岸法要</td>
            <td>3/20 10:00〜</td>
            <td>春のご先祖様供養</td>
            <td>自由参加</td>
          </tr>
          <tr>
            <td>お墓参り特別法要</td>
            <td>3/18〜24</td>
            <td>特別供養・読経</td>
            <td>事前予約制</td>
          </tr>
        </tbody>
      </table>
      
      <h3>【4月】花まつり</h3>
      <table>
        <thead>
          <tr>
            <th>行事名</th>
            <th>日程</th>
            <th>内容</th>
            <th>参加条件</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>花まつり</td>
            <td>4/8 13:00〜</td>
            <td>お釈迦様の誕生日を祝う</td>
            <td>自由参加</td>
          </tr>
          <tr>
            <td>春の座禅会</td>
            <td>4/15 6:00〜</td>
            <td>朝の座禅体験と法話</td>
            <td>事前予約制</td>
          </tr>
        </tbody>
      </table>
      
      <h3>【5月】開山忌</h3>
      <table>
        <thead>
          <tr>
            <th>行事名</th>
            <th>日程</th>
            <th>内容</th>
            <th>参加条件</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>開山忌法要</td>
            <td>5/15 10:00〜</td>
            <td>寺院開祖の命日法要</td>
            <td>自由参加</td>
          </tr>
          <tr>
            <td>写経体験</td>
            <td>5/28 14:00〜</td>
            <td>初心者向け写経体験</td>
            <td>事前予約制</td>
          </tr>
        </tbody>
      </table>
      
      <h3>【6〜8月】夏の行事</h3>
      <table>
        <thead>
          <tr>
            <th>行事名</th>
            <th>日程</th>
            <th>内容</th>
            <th>参加条件</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>夏の特別法話</td>
            <td>6/10 15:00〜</td>
            <td>住職による特別法話</td>
            <td>自由参加</td>
          </tr>
          <tr>
            <td>盂蘭盆会</td>
            <td>8/13〜15</td>
            <td>お盆の供養法要</td>
            <td>自由参加</td>
          </tr>
          <tr>
            <td>子ども禅体験</td>
            <td>8/20 10:00〜</td>
            <td>子ども向け座禅・法話</td>
            <td>事前予約制</td>
          </tr>
        </tbody>
      </table>
      
      <h3>【9月】秋分・彼岸</h3>
      <table>
        <thead>
          <tr>
            <th>行事名</th>
            <th>日程</th>
            <th>内容</th>
            <th>参加条件</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>秋季彼岸法要</td>
            <td>9/23 10:00〜</td>
            <td>秋のご先祖様供養</td>
            <td>自由参加</td>
          </tr>
          <tr>
            <td>お墓参り特別法要</td>
            <td>9/20〜26</td>
            <td>特別供養・読経</td>
            <td>事前予約制</td>
          </tr>
        </tbody>
      </table>
      
      <h3>【10〜11月】秋の行事</h3>
      <table>
        <thead>
          <tr>
            <th>行事名</th>
            <th>日程</th>
            <th>内容</th>
            <th>参加条件</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>秋の座禅会</td>
            <td>10/15 6:00〜</td>
            <td>朝の座禅体験と法話</td>
            <td>事前予約制</td>
          </tr>
          <tr>
            <td>七五三祝詞</td>
            <td>11/15 10:00〜</td>
            <td>子どもの健やかな成長を祈願</td>
            <td>事前予約制</td>
          </tr>
        </tbody>
      </table>
      
      <h3>【12月】年末行事</h3>
      <table>
        <thead>
          <tr>
            <th>行事名</th>
            <th>日程</th>
            <th>内容</th>
            <th>参加条件</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>成道会</td>
            <td>12/8 13:00〜</td>
            <td>お釈迦様の悟りを記念</td>
            <td>自由参加</td>
          </tr>
          <tr>
            <td>年末特別座禅会</td>
            <td>12/28 18:00〜</td>
            <td>一年の締めくくりの座禅</td>
            <td>事前予約制</td>
          </tr>
          <tr>
            <td>大晦日法要</td>
            <td>12/31 16:00〜</td>
            <td>一年の感謝の法要</td>
            <td>自由参加</td>
          </tr>
        </tbody>
      </table>
      
      <h2>行事への参加方法</h2>
      <p>
        自由参加の行事は、特に事前申し込みは不要です。当日、寺院に直接お越しください。<br />
        事前予約制の行事は、以下のいずれかの方法でお申し込みください。
      </p>
      <ul>
        <li>寺院ウェブサイトの「行事予約」ページから</li>
        <li>寺院事務所への電話：0X-XXXX-XXXX（受付時間：9:00〜17:00）</li>
        <li>寺院事務所に直接お越しいただき、予約フォームにご記入</li>
      </ul>
      
      <div className="note-box">
        <h3>ご参加の際のご注意</h3>
        <ul>
          <li>法要時は動きやすく、静かな服装でお越しください。</li>
          <li>座禅会などは、長時間座ることがありますので、ゆったりとした服装をお勧めします。</li>
          <li>行事の内容や日程は、諸事情により変更になる場合がございます。事前にウェブサイトや寺院事務所で最新情報をご確認ください。</li>
          <li>参加時には、受付にてお名前とRank Cの檀家である旨をお伝えください。</li>
        </ul>
      </div>
      
      <h2>お問い合わせ</h2>
      <p>
        行事についてのご質問や、詳細についてのお問い合わせは、寺院事務所（0X-XXXX-XXXX）までお気軽にご連絡ください。<br />
        受付時間：平日 9:00〜17:00
      </p>
    </>
  );

  return (
    <NotificationDetail
      title="年中行事カレンダー"
      content={content}
      requiredGrade="全ての檀家様"
      headerImage={eventImage}
      category="イベント"
      date="2023/11/28"
      breadcrumbs={[
        { name: "ホーム", path: "/dashboard" },
        { name: "お知らせ", path: "/notifications" },
        { name: "年中行事カレンダー", path: null }
      ]}
    />
  );
}

export default AnnualEvents; 