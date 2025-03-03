import React, { useState, useEffect } from "react";
import "./MainPage.css";
// バックエンドのモジュールをインポート
import { koshiba_dapp_backend } from "../../declarations/koshiba-dapp-backend";

import templeIcon from "./img/templeIcon.jpg";
import rankIcon from "./img/rankIcon.jpg";
import voteIcon from "./img/voteIcon.jpg";

/**
 * 数字を 0 から value までアニメーションしながら表示するコンポーネント
 * @param {number} value - 最終的な数値
 * @param {number} duration - アニメーション時間 (ms)
 * @param {string} suffix - 単位（例: "票"）
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
      const progress = Math.min(elapsed / duration, 1);
      const newValue = progress * value;
      setCurrentValue(newValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  const displayValue = Math.floor(currentValue);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}

function MainPage() {
  // canister から取得したユーザー情報
  const [user, setUser] = useState(null);
  // canister から取得したイベント一覧
  const [events, setEvents] = useState([]);

  // ユーザー情報を取得
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await koshiba_dapp_backend.get_user();
        setUser(fetchedUser);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  // イベント一覧を取得
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await koshiba_dapp_backend.get_user_events();
        setEvents(fetchedEvents);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="container">
      {/* ユーザー情報コンテナ */}
      <div className="user-info-container">
        {/* ユーザー名 */}
        <h2 className="user-name">
          {user
            ? `${user.last_name} ${user.first_name}`
            : "ユーザー名を読み込み中..."}
        </h2>

        <div className="user-details">
          {/* 所属寺院 */}
          <div className="detail-item">
            <div className="icon-row">
              <img src={templeIcon} alt="寺院アイコン" className="icon" />
              <span>所属寺院</span>
            </div>
            <span className="status">
              {user ? user.temple.name : "読み込み中..."}
            </span>
          </div>

          {/* 檀家グレード */}
          <div className="detail-item">
            <div className="icon-row">
              <img src={rankIcon} alt="檀家グレードアイコン" className="icon" />
              <span>檀家グレード</span>
            </div>
            <span className="status">
              {user ? `Rank ${Object.keys(user.grade)[0]}` : "読み込み中..."}
            </span>
          </div>

          {/* 所持投票数 */}
          <div className="detail-item">
            <div className="icon-row">
              <img src={voteIcon} alt="投票アイコン" className="icon" />
              <span>所持投票数</span>
            </div>
            <span className="status">
              {user ? `${user.vote_count}票` : "読み込み中..."}
            </span>
          </div>
        </div>
      </div>

      <hr />

      {/* 見出し */}
      <h3 className="policy-title">
        {user ? `${user.temple.name}の運営方針` : "読み込み中..."}
      </h3>

      {/* イベントをまとめるコンテナ */}
      <div className="policy-container">
        {events.map((event) => {
          const unvoted = event.vote.total - (event.vote.agree + event.vote.disagree);
          // ステータスバーの幅(%)を計算
          const agreeWidth =
            event.vote.total > 0 ? (event.vote.agree / event.vote.total) * 100 : 0;
          const disagreeWidth =
            event.vote.total > 0 ? (event.vote.disagree / event.vote.total) * 100 : 0;
          const noneWidth =
            event.vote.total > 0 ? (unvoted / event.vote.total) * 100 : 0;

          return (
            <div className="policy-item" key={event.event_id}>
              <h3>{event.title}</h3>
              <p>{event.content}</p>

              {/* ステータスバー */}
              <div className="status-bar-container">
                <div className="status-bar">
                  <div
                    className="agree bar" 
                    style={{ "--final-width": `${agreeWidth}%` }}
                  />
                  <div
                    className="disagree bar"
                    style={{ "--final-width": `${disagreeWidth}%` }}
                  />
                  <div
                    className="none bar"
                    style={{ "--final-width": `${noneWidth}%` }}
                  />
                </div>

                {/* 賛成・反対・未投票の「票数」を表示 */}
                <div className="ratio-text">
                  <span className="ratio-agree">
                    賛成: <AnimatedNumber value={event.vote.agree} suffix="票" />
                  </span>
                  {" / "}
                  <span className="ratio-disagree">
                    反対: <AnimatedNumber value={event.vote.disagree} suffix="票" />
                  </span>
                  {" / "}
                  <span className="ratio-none">
                    未投票: <AnimatedNumber value={unvoted} suffix="票" />
                  </span>
                </div>
              </div>

              {/* 投票ボタン */}
              <button className="vote-button agree-btn">
                {user ? `${user.vote_count}票 賛成に入れる` : "読み込み中..."}
              </button>
              <button className="vote-button disagree-btn">
                {user ? `${user.vote_count}票 反対に入れる` : "読み込み中..."}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MainPage;
