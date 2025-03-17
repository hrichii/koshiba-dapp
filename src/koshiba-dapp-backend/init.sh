echo "---------------お寺の更新---------------"
echo "\n"
dfx canister call koshiba-dapp-backend updateTempleDebug '(1, "浅草寺", "1110032", "東京都", "台東区", "浅草2-3-1", null, "https://upload.wikimedia.org/wikipedia/commons/8/8d/Asakusa_Senso-ji_2021-12_ac_%282%29.jpg", "浅草寺（せんそうじ）は、東京都台東区浅草二丁目にある都内最古の寺です。")' --output json
dfx canister call koshiba-dapp-backend updateTempleDebug '(2, "清水寺", "6050862", "京都府", "京都市東山区", "清水1丁目294", null, "https://upload.wikimedia.org/wikipedia/commons/a/ae/Kiyomizu-dera%2C_Kyoto%2C_November_2016_-02.jpg", "清水寺（きよみずでら）は、京都府京都市東山区にある寺院で、世界遺産に登録されています。")' --output json
echo "\n"
echo "---------------ユーザーの更新---------------"
echo "\n"
dfx canister call koshiba-dapp-backend updateUserDebug '("1", "山田", "一郎", variant { S }, 1)' --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("1", "山田", "二郎", variant { A }, 1)' --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("1", "山田", "三郎", variant { B }, 1)' --output json
echo "\n"
echo "---------------イベントの更新---------------"
echo "\n"
dfx canister call koshiba-dapp-backend updateEventDebug '(1, 1, "浅草寺本堂の改修", "浅草寺の本堂（観音堂）は、約1400年の歴史を持つ寺院で、現在の本堂は1958年に再建されたもので、約70年が経過しています。長年の風雨により、屋根や柱の劣化が進み、安全面での懸念が高まっています。今回、伝統的な意匠を保ちつつ耐久性を向上させることを目的に改修工事を行うことを決定しました。\n\n改修にかかる費用は約5,000万円を見込んでおり、地域の皆様からのご意見をお伺いしたいと考えています。賛成・反対を問わず、皆様のご意見をお寄せいただけますようお願い申し上げます。", "2025-04-01T12:00:00Z")'
dfx canister call koshiba-dapp-backend updateEventDebug '(2, 2, "清水寺本堂の改修", "清水寺の本堂は、約400年の歴史を有し、現在の本堂は寛永6年（1629年）の大火災後に再建されたものです。老朽化が進んでおり、特に屋根の檜皮葺きの劣化が顕著です。これに伴い、伝統的な美しさを保ちながら耐久性を高める改修工事を行うことを決定しました。\n\n改修にかかる費用は約5,000万円を見込んでおり、地域の皆様からのご意見をお伺いしたいと考えています。賛成・反対を問わず、ご意見をお寄せいただけますようお願い申し上げます。", "2025-04-01T12:00:00Z")'
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