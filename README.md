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

## ユーザー

### ログイン中のユーザー情報の取得
```sh
dfx canister call koshiba-dapp-backend getMe --output json
```
※`get_user`は`getMe`に置換される予定です。

### ログイン中のユーザー情報の作成または更新
```sh
dfx canister call koshiba-dapp-backend updateMe '("横国", "太郎", variant { S }, 1)' --output json
```
※`create_user`は`updateMe`に置換される予定です。

### ログイン中のユーザーの削除
```sh
dfx canister call koshiba-dapp-backend deleteMe
```
※`delete_user`は`deleteMe`に置換される予定です。

## イベント

### ログイン中のユーザーのイベント一覧を取得
```sh
dfx canister call koshiba-dapp-backend getMyEventList --output json
```
※`get_user_events`は`getMyEventList`に置換される予定です。

### 指定したイベントの詳細を取得
```sh
dfx canister call koshiba-dapp-backend getMyEvent '(1)' --output json
```
※`get_user_event`は`getMyEvent`に置換される予定です。

### イベントへの投票を更新
```sh
dfx canister call koshiba-dapp-backend updateMyVote '(1, variant { Agree })' --output json
```
※`update_vote`は`updateMyVote`に修正される予定です。

## 寺

### 寺の一覧を取得
```sh
dfx canister call koshiba-dapp-backend getTempleList --output json
```
※`get_temples`は`getTempleList`に置換される予定です。

# デバッグ用のコマンド一覧
## プリンシパル
### プリンシパルを取得
```sh
dfx canister call koshiba-dapp-backend verifyPrincipalDebug --output json
```

## イベント
###　イベントの一覧取得
```sh
dfx canister call koshiba-dapp-backend getEventListDebug --output json
```

### イベントの更新
```sh
dfx canister call koshiba-dapp-backend updateEventDebug '(1, 1, "本殿の改修", "当神社の本殿は築120年が経過し、老朽化が進んでおります。特に屋根の傷みや柱の劣化が目立ち、安全面の懸念が増しております。これに伴い、本殿の改修工事を検討しております。\n\n今回の改修では、伝統的な意匠を保ちつつ耐久性を向上させることを目的とし、工事費用は約5,000万円を見込んでおります。\n\nつきましては、本殿改修について皆さまのご意見をお聞かせいただきたく存じます。賛成・反対を含め、ご意見がございましたら、下記の方法でお寄せください。", "2025-04-01T12:00:00Z")'
```
### イベントの削除
```sh
dfx canister call koshiba-dapp-backend deleteEventDebug '1' --output json
```
# ユーザー
### ユーザー一覧を取得
```sh
dfx canister call koshiba-dapp-backend getUserListDebug --output json
```
### ユーザーを更新
```sh
dfx canister call koshiba-dapp-backend updateUserDebug '("1", "山田", "太郎2", variant { S }, 1)' --output json
```
### ユーザーを削除
```sh
dfx canister call koshiba-dapp-backend deleteUserDebug '("1")' --output json
```
# 投票
### 票の一覧を取得
```sh
dfx canister call koshiba-dapp-backend getVoteListDebug --output json
```
### 票を更新
```sh
dfx canister call koshiba-dapp-backend updateVoteDebug '(1, "1", variant { Agree })' --output json
```

### 票を削除
```sh
dfx canister call koshiba-dapp-backend deleteVoteDebug '(1, "1",)' --output json
```

# 寺
### 寺一覧を取得
```sh
dfx canister call koshiba-dapp-backend getAllTempleDebug --output json
```

### 寺を更新
```sh
dfx canister call koshiba-dapp-backend updateTempleDebug '(1, "浅草寺")' --output json
```
### 寺を削除
```sh
dfx canister call koshiba-dapp-backend deleteTempleDebug '(1)' --output json
```