import React from "react";

function MainPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>山田太郎</h2>
      <p>所属寺院: 浅草寺</p>
      <p>檀家グレード: Rank S</p>
      <p>所持投票数: 10票</p>

      <hr />

      <h3>浅草寺の運営方針</h3>

      {/* サンプル方針1 */}
      <div style={{ marginBottom: "20px" }}>
        <h4>本殿の改修</h4>
        <p>
          hogehgeohgeo...（ここに長いテキストを配置）
        </p>
        <button style={{ marginRight: "10px" }}>賛成</button>
        <button>反対</button>
      </div>

      {/* サンプル方針2 */}
      <div>
        <h4>ひな祭りイベントの開催</h4>
        <p>
          hogehgeohgeo...（ここに長いテキストを配置）
        </p>
        <button style={{ marginRight: "10px" }}>賛成</button>
        <button>反対</button>
      </div>
    </div>
  );
}

export default MainPage;
