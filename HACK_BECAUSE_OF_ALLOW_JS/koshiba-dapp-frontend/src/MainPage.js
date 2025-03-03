import React, { useState, useEffect } from "react";
import "./MainPage.css";
import templeIcon from "./img/templeIcon.jpg";
import rankIcon from "./img/rankIcon.jpg";
import voteIcon from "./img/voteIcon.jpg";
/**
 * 数字を 0 から value までアニメーションしながら表示するコンポーネント
 * @param {number} value - 最終的な数値
 * @param {number} duration - アニメーション時間 (ms)
 * @param {string} suffix - 単位（例: "%"）
 */
function AnimatedNumber({ value, duration = 1500, suffix = "" }) {
    const [currentValue, setCurrentValue] = useState(0);
    useEffect(() => {
        let startTime;
        let animationFrameId;
        function animate(timestamp) {
            if (!startTime) {
                startTime = timestamp;
            }
            const elapsed = timestamp - startTime;
            // 進捗率（0～1）
            const progress = Math.min(elapsed / duration, 1);
            // 現在値 = 最終値 * 進捗率
            const newValue = progress * value;
            setCurrentValue(newValue);
            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            }
        }
        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [value, duration]);
    // 小数を四捨五入 or 切り捨て
    const displayValue = Math.floor(currentValue);
    return (<span>
      {displayValue}
      {suffix}
    </span>);
}
function MainPage() {
    // 例: 賛成, 反対 の割合 (未投票は自動計算)
    const policy1 = { agree: 40, disagree: 30 };
    const policy2 = { agree: 50, disagree: 20 };
    const none1 = 100 - (policy1.agree + policy1.disagree);
    const none2 = 100 - (policy2.agree + policy2.disagree);
    return (<div className="container">
      {/* ユーザー情報コンテナ */}
      <div className="user-info-container">
        <h2 className="user-name">小柴太郎</h2>

        <div className="user-details">
          {/* 所属寺院 */}
          <div className="detail-item">
            <div className="icon-row">
              <img src={templeIcon} alt="寺院アイコン" className="icon"/>
              <span>所属寺院</span>
            </div>
            <span className="status">浅草寺</span>
          </div>
          {/* 檀家グレード */}
          <div className="detail-item">
            <div className="icon-row">
              <img src={rankIcon} alt="檀家グレードアイコン" className="icon"/>
              <span>檀家グレード</span>
            </div>
            <span className="status">Rank S</span>
          </div>
          {/* 所持投票数 */}
          <div className="detail-item">
            <div className="icon-row">
              <img src={voteIcon} alt="投票アイコン" className="icon"/>
              <span>所持投票数</span>
            </div>
            <span className="status">10票</span>
          </div>
        </div>
      </div>

      <hr />

      {/* 見出し */}
      <h3 className="policy-title">浅草寺の運営方針</h3>

      {/* 薄いグレー背景にまとめる */}
      <div className="policy-container">
        {/* 方針1 */}
        <div className="policy-item">
          <h3>本殿の改修</h3>
          <p>
            本殿は歴史的価値を継承する重要文化財です。耐震補強をはじめ、
            外壁・屋根の補修、断熱改修、木材の防腐処理やバリアフリー化を実施し、
            伝統工法と最新技術を融合した保存修復を行います。工事は段階的に実施し、
            工事中も安全管理を徹底して参拝者の不便を最小限に抑えます。
          </p>

          {/* ステータスバー */}
          <div className="status-bar-container">
            <div className="status-bar">
              <div className="agree" style={{
            animation: "growBar 1.5s forwards",
            "--final-width": `${policy1.agree}%`,
        }}/>
              <div className="disagree" style={{
            animation: "growBar 1.5s forwards",
            "--final-width": `${policy1.disagree}%`,
        }}/>
              <div className="none" style={{
            animation: "growBar 1.5s forwards",
            "--final-width": `${none1}%`,
        }}/>
            </div>

            {/* 賛成・反対・未投票の数値をカウントアップ表示 */}
            <div className="ratio-text">
              <span style={{ color: "#003eb9" }}>
                賛成: <AnimatedNumber value={policy1.agree} suffix="%"/>
              </span>{" "}
              /{" "}
              <span style={{ color: "#f48fb1" }}>
                反対: <AnimatedNumber value={policy1.disagree} suffix="%"/>
              </span>{" "}
              /{" "}
              <span style={{ color: "#9e9e9e" }}>
                未投票: <AnimatedNumber value={none1} suffix="%"/>
              </span>
            </div>
          </div>

          <button className="vote-button agree-btn">10票 賛成に入れる</button>
          <button className="vote-button disagree-btn">10票 反対に入れる</button>
        </div>

        {/* 方針2 */}
        <div className="policy-item">
          <h3>ひな祭りイベントの開催</h3>
          <p>
            例年、2月下旬にひな祭りを開催し、ひな人形の展示、伝統衣装の体験、
            和菓子・茶の試食、子ども向け工作教室など多彩な催しを実施します。
            地域住民との交流を深め、伝統文化の魅力を次世代へ継承するため、
            地域内外の檀家と連携し、伝統と現代性を融合した催しで、
            皆様の心に残るひとときをお約束します。
          </p>

          <div className="status-bar-container">
            <div className="status-bar">
              <div className="agree" style={{
            animation: "growBar 1.5s forwards",
            "--final-width": `${policy2.agree}%`,
        }}/>
              <div className="disagree" style={{
            animation: "growBar 1.5s forwards",
            "--final-width": `${policy2.disagree}%`,
        }}/>
              <div className="none" style={{
            animation: "growBar 1.5s forwards",
            "--final-width": `${none2}%`,
        }}/>
            </div>

            {/* 賛成・反対・未投票の数値をカウントアップ表示 */}
            <div className="ratio-text">
              <span style={{ color: "#003eb9" }}>
                賛成: <AnimatedNumber value={policy2.agree} suffix="%"/>
              </span>{" "}
              /{" "}
              <span style={{ color: "#f48fb1" }}>
                反対: <AnimatedNumber value={policy2.disagree} suffix="%"/>
              </span>{" "}
              /{" "}
              <span style={{ color: "#9e9e9e" }}>
                未投票: <AnimatedNumber value={none2} suffix="%"/>
              </span>
            </div>
          </div>

          <button className="vote-button agree-btn">10票 賛成に入れる</button>
          <button className="vote-button disagree-btn">10票 反対に入れる</button>
        </div>
      </div>
    </div>);
}
export default MainPage;
