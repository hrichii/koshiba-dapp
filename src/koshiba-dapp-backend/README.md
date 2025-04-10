# Koshiba-DApp
## 起動コマンド
```sh
cd koshiba-dapp/
npm install
dfx start
dfx deploy --yes
```

## 初回コマンド
2つの寺、2名のユーザー、1つのイベントを追加する
```sh
sh src/koshiba-dapp-backend/init.sh
```

# コマンド一覧

**【重要!!!】まずは以下コマンドを実行してください。**
これで`dfx canister call koshiba-dapp-backend`を省略できるようになります。
```sh
source src/koshiba-dapp-backend/dfx_aliases
```

## ユーザー

### ログイン中のユーザー情報の取得
```sh
getMe
```
※`get_user`は`getMe`に置換される予定です。

### ログイン中のユーザー情報の作成または更新
```sh
updateMe '("横国", "太郎", variant { S }, 1)'
```

### ログイン中のユーザーの削除
```sh
deleteMe
```

### ログイン中のユーザーが所属するお寺を更新
```sh
updateMyTemple 1
```

## イベント

### 所属する寺のイベント一覧を取得
```sh
getMyEventList
```

### 指定した寺のイベント一覧を取得
```sh
getEventListByTempleId 1
```

### 所属する寺の指定したイベントの詳細を取得
```sh
getMyEvent 1
```

## 支払い履歴
### 所属する寺の支払い履歴一覧を取得
```sh
getMyPaymentList
```

### イベントへの投票を更新
```sh
updateMyVote '(1, variant { Agree })'
```

## 寺

### 指定した寺の詳細情報を取得
以下はtemple_id=1の場合の例
```sh
getTemple 1
```

### 寺の一覧を取得
```sh
getTempleList
```

## 支払い履歴
### 指定した寺の支払い履歴一覧を取得
temple_idが1のお寺の支払い履歴一覧を取得する場合は以下コマンド
```sh
getPaymentListByTempleId 1
```

# デバッグ用のコマンド一覧
## プリンシパル
### プリンシパルを取得
```sh
getPrincipal
```

## イベント
### イベントの一覧取得
```sh
getEventList
```

### イベントの更新
```sh
updateEvent '(1, 1, "浅草寺本堂の改修", "浅草寺の本堂（観音堂）は、約1400年の歴史を持つ寺院で、現在の本堂は1958年に再建されたもので、約70年が経過しています。長年の風雨により、屋根や柱の劣化が進み、安全面での懸念が高まっています。今回、伝統的な意匠を保ちつつ耐久性を向上させることを目的に改修工事を行うことを決定しました。\n\n改修にかかる費用は約5,000万円を見込んでおり、地域の皆様からのご意見をお伺いしたいと考えています。賛成・反対を問わず、皆様のご意見をお寄せいただけますようお願い申し上げます。", "2025-04-01T12:00:00Z")'
```
### イベントの削除
```sh
deleteEvent 1
```
# ユーザー
### ユーザー一覧を取得
```sh
getUserList
```
### ユーザーを更新
```sh
updateUser '("1", "山田", "太郎2", variant { S }, 1)'
```
### ユーザーを削除
```sh
deleteUser 1
```
# 投票
### 票の一覧を取得
```sh
getVoteList
```
### 票を更新
```sh
updateVote '(1, "1", variant { Agree })'
```

### 票を削除
```sh
deleteVote '(1, "1",)'
```

# 寺
### 寺一覧を取得
```sh
getTempleList
```

### 寺を更新
```sh
updateTemple '(1, "浅草寺", "1110032", "東京都", "台東区", "浅草2-3-1", null, "https://upload.wikimedia.org/wikipedia/commons/8/8d/Asakusa_Senso-ji_2021-12_ac_%282%29.jpg", "浅草寺（せんそうじ）は、東京都台東区浅草二丁目にある都内最古の寺です。")'
```
### 寺を削除
```sh
deleteTemple 1
```

# 支払い履歴
### 支払い履歴一覧を取得
```sh
getPaymentList
```

### 支払い履歴を更新
```sh
updatePayment '(1, 1, "本殿の改修", "当神社の本殿は築120年が経過し、老朽化が進んでおります。特に屋根の傷みや柱の劣化が目立ち、安全面の懸念が増しております。これに伴い、本殿の改修工事を行いました。", 1000000, variant { Expenses }, "2025-06-10T12:00:00Z" )'
```
### 支払い履歴を削除
```sh
deletePayment 1
```