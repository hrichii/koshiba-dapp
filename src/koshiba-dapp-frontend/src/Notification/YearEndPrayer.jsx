import React from "react";
import NotificationDetail from "./NotificationDetail";
import prayerImage from "../img/year_end_prayer.jpg";

function YearEndPrayer() {
    // コンテンツデータ
    const content = (
        <>
            <p>檀家の皆様へ</p>
            <p>今年も年末の特別祈祷会を開催いたします。どなたでもご参加いただけますので、ぜひお誘い合わせの上、ご参加ください。</p>
            
            <h2>年末特別祈祷会の詳細</h2>
            <table>
                <tbody>
                    <tr>
                        <th>日時</th>
                        <td>令和5年12月28日（木）午後2時〜4時</td>
                    </tr>
                    <tr>
                        <th>場所</th>
                        <td>本堂</td>
                    </tr>
                    <tr>
                        <th>内容</th>
                        <td>読経、焼香、法話「一年を振り返り、新年を迎える心構え」</td>
                    </tr>
                    <tr>
                        <th>参加費</th>
                        <td>無料（当日の賽銭は任意）</td>
                    </tr>
                </tbody>
            </table>
            
            <h2>特別祈祷会の意義</h2>
            <p>年末の祈祷会は、一年の穢れを払い、心も体も清らかな状態で新年を迎えるための大切な儀式です。</p>
            <p>今年一年の感謝を捧げ、来る年の平安と幸福を祈願する貴重な機会となります。</p>
            
            <h2>プログラム</h2>
            <ol>
                <li>開会の辞（14:00〜）</li>
                <li>読経（14:10〜）</li>
                <li>焼香（14:30〜）</li>
                <li>法話「一年を振り返り、新年を迎える心構え」（15:00〜）</li>
                <li>個別祈祷（希望者のみ）（15:30〜）</li>
                <li>閉会（16:00）</li>
            </ol>
            
            <h2>参加方法</h2>
            <p>当日直接お越しいただくか、以下の方法で事前にご連絡ください。</p>
            <ul>
                <li>寺務所窓口：平日9時〜17時</li>
                <li>電話：0120-XXX-XXX</li>
                <li>メール：info@koshiba-temple.com</li>
                <li>アプリ内予約：マイページ＞イベント予約から</li>
            </ul>
            
            <h2>注意事項</h2>
            <ul>
                <li>駐車場に限りがありますので、公共交通機関をご利用ください。</li>
                <li>体調の優れない方はご遠慮ください。</li>
                <li>マスク着用は任意ですが、咳エチケットにご配慮ください。</li>
                <li>当日は混雑が予想されますので、お時間に余裕をもってお越しください。</li>
            </ul>
            
            <p>皆様のご参加を心よりお待ちしております。</p>
            
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
            title="年末の祈祷会参加募集"
            content={content}
            requiredGrade="全ての檀家様"
            headerImage={prayerImage}
            category="イベント"
            date="2023/12/05"
            breadcrumbs={[
                { name: "ホーム", path: "/dashboard" },
                { name: "お知らせ", path: "/notifications" },
                { name: "年末の祈祷会参加募集", path: null }
            ]}
        />
    );
}

export default YearEndPrayer; 