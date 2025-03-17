echo "---------------お寺の更新---------------"
echo "\n"
dfx canister call koshiba-dapp-backend updateTempleDebug '(1, "浅草寺")'  --output json
dfx canister call koshiba-dapp-backend updateTempleDebug '(2, "清水寺")'  --output json
echo "\n"
echo "---------------ユーザーの更新---------------"
echo "\n"
dfx canister call koshiba-dapp-backend updateUserDebug '("1", "山田", "一郎", variant { S }, 1)' --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("1", "山田", "二郎", variant { A }, 1)' --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("1", "山田", "三郎", variant { B }, 1)' --output json
echo "\n"
echo "---------------イベントの更新---------------"
echo "\n"
dfx canister call koshiba-dapp-backend updateEventDebug '(1, 1, "本殿の改修", "当神社の本殿は築120年が経過し、老朽化が進んでおります。特に屋根の傷みや柱の劣化が目立ち、安全面の懸念が増しております。これに伴い、本殿の改修工事を検討しております。\n\n今回の改修では、伝統的な意匠を保ちつつ耐久性を向上させることを目的とし、工事費用は約5,000万円を見込んでおります。\n\nつきましては、本殿改修について皆さまのご意見をお聞かせいただきたく存じます。賛成・反対を含め、ご意見がございましたら、下記の方法でお寄せください。", "2025-04-01T12:00:00Z")'
echo "\n"
echo "---------------投票情報の更新---------------"
echo "\n"
dfx canister call koshiba-dapp-backend updateVoteDebug '(1, "1", variant { Agree })' --output json
dfx canister call koshiba-dapp-backend updateVoteDebug '(1, "2", variant { Disagree })' --output json
echo "\n"
echo "---------------支払い履歴の更新---------------"
echo "\n"
dfx canister call koshiba-dapp-backend updatePaymentDebug '(1, 1, "本殿の改修", "当神社の本殿は築120年が経過し、老朽化が進んでおります。特に屋根の傷みや柱の劣化が目立ち、安全面の懸念が増しております。これに伴い、本殿の改修工事を行いました。", 1000000, variant { Expenses } )' --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(2, 1, "檀家料の奉納", "檀家料をいただきました。", 1000000, variant { Income } )' --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(3, 1, "寺運営費", "人件費やお寺の維持費として使用しました。", 1000000, variant { Expenses } )' --output json
echo "\n"
echo "------------------------------------------"