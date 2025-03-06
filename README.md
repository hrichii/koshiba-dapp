# Koshiba-DApp
## 起動コマンド
```sh
cd koshiba-dapp/
npm install
dfx start
dfx deploy --yes
```

## 初回コマンド
```sh
dfx canister call koshiba-dapp-backend create_temple '(1, "浅草寺")'
dfx canister call koshiba-dapp-backend create_event '(1, "本殿の改修", "当神社の本殿は築120年が経過し、老朽化が進んでおります。特に屋根の傷みや柱の劣化が目立ち、安全面の懸念が増しております。これに伴い、本殿の改修工事を検討しております。\n\n今回の改修では、伝統的な意匠を保ちつつ耐久性を向上させることを目的とし、工事費用は約5,000万円を見込んでおります。\n\nつきましては、本殿改修について皆さまのご意見をお聞かせいただきたく存じます。賛成・反対を含め、ご意見がございましたら、下記の方法でお寄せください。", "2025-04-01T12:00:00Z")'
dfx canister call koshiba-dapp-backend create_event '(2, "ひな祭りイベント開催", "今年もひな祭りの季節が近づいてまいりました。\n地域の皆さまとともに、子どもたちの健やかな成長を願う「ひな祭りイベント」を開催したいと考えております\n\n本年のイベントでは、ひな人形の展示、甘酒やお菓子のふるまい、子どもたちの舞の奉納などを予定しております。準備や運営には約100万円の費用が必要となり、皆さまのご支援をお願い申し上げます。", "2025-04-30T12:00:00Z")'
```

## 確認コマンド
```sh
dfx canister call koshiba-dapp-backend get_temples --output json
dfx canister call koshiba-dapp-backend get_user_events --output json
```