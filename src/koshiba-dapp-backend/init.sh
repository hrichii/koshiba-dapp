#!/bin/bash

# 引数でネットワークを指定（localまたはic）
# 引数が指定されていない場合は 'local' が使われます
NETWORK=${1:-local}
echo "使用するネットワーク: $NETWORK"

echo "---------------お寺の更新---------------"
echo "\n"
dfx canister call koshiba-dapp-backend updateTempleDebug '(1, "浅艶寺", "1110032", "東京都", "台東区", "浅草2-3-1", null, "https://hrichii.github.io/koshiba-image/temple1.jpg", "浅艶寺（せんえんじ）は、東京都台東区浅草にある歴史ある寺院で、多くの観光客が訪れます。")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateTempleDebug '(2, "清龍寺", "6050862", "京都府", "京都市東山区", "清水1丁目294", null, "https://hrichii.github.io/koshiba-image/temple2.jpg", "清龍寺（せいりゅうじ）は、京都市東山区に位置する名刹で、美しい景観とともに歴史を感じられる場所です。")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateTempleDebug '(3, "東泉寺", "6308211", "奈良県", "奈良市", "雑司町406-1", null, "https://hrichii.github.io/koshiba-image/temple3.jpg", "東泉寺（とうせんじ）は、奈良市にある由緒ある寺院で、巨大な仏像が特徴です。")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateTempleDebug '(4, "金光峯寺", "6480211", "和歌山県", "伊都郡高野町", "高野山132", null, "https://hrichii.github.io/koshiba-image/temple4.jpg", "金光峯寺（こんこうほうじ）は、和歌山県高野山に位置する修行の場として知られる寺院です。")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateTempleDebug '(5, "延輝寺", "5200113", "滋賀県", "大津市", "坂本本町4220", null, "https://hrichii.github.io/koshiba-image/temple5.jpg", "延輝寺（えんきじ）は、滋賀県大津市にある山岳信仰の中心地として栄えた寺院です。")' --network $NETWORK --output json
echo "\n"
echo "---------------ユーザーの更新---------------"
echo "\n"
dfx canister call koshiba-dapp-backend updateUserDebug '("1", "浅艶寺", "一郎", variant { S }, 1)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("2", "浅艶寺", "二郎", variant { S }, 1)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("3", "浅艶寺", "三郎", variant { S }, 1)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("4", "清龍寺", "一郎", variant { S }, 2)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("5", "清龍寺", "二郎", variant { S }, 2)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("6", "清龍寺", "三郎", variant { S }, 2)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("7", "東泉寺", "一郎", variant { S }, 3)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("8", "東泉寺", "二郎", variant { S }, 3)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("9", "東泉寺", "三郎", variant { S }, 3)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("10", "金光峯寺", "一郎", variant { S }, 4)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("11", "金光峯寺", "二郎", variant { S }, 4)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("12", "金光峯寺", "三郎", variant { S }, 4)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("13", "延輝寺", "一郎", variant { S }, 5)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("14", "延輝寺", "二郎", variant { S }, 5)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("15", "延輝寺", "三郎", variant { S }, 5)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("16", "浅艶寺", "四郎", variant { S }, 1)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("17", "浅艶寺", "五郎", variant { S }, 1)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("18", "浅艶寺", "六郎", variant { S }, 1)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("19", "清龍寺", "四郎", variant { S }, 2)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("20", "清龍寺", "五郎", variant { S }, 2)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("21", "清龍寺", "六郎", variant { S }, 2)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("22", "東泉寺", "四郎", variant { S }, 3)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("23", "東泉寺", "五郎", variant { S }, 3)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("24", "東泉寺", "六郎", variant { S }, 3)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("25", "金光峯寺", "四郎", variant { S }, 4)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("26", "金光峯寺", "五郎", variant { S }, 4)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("27", "金光峯寺", "六郎", variant { S }, 4)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("28", "延輝寺", "四郎", variant { S }, 5)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("29", "延輝寺", "五郎", variant { S }, 5)' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateUserDebug '("30", "延輝寺", "六郎", variant { S }, 5)' --network $NETWORK --output json

echo "\n"
echo "---------------イベントの更新---------------"
echo "\n"
dfx canister call koshiba-dapp-backend updateEventDebug '(1, 1, "浅艶寺本堂の改修", "浅艶寺の本堂（観音堂）は、約1400年の歴史を持つ寺院で、現在の本堂は1958年に再建されたもので、約70年が経過しています。長年の風雨により、屋根や柱の劣化が進み、安全面での懸念が高まっています。今回、伝統的な意匠を保ちつつ耐久性を向上させることを目的に改修工事を行うことを決定しました。\n\n改修にかかる費用は約5,000万円を見込んでおり、地域の皆様からのご意見をお伺いしたいと考えています。賛成・反対を問わず、皆様のご意見をお寄せいただけますようお願い申し上げます。", "2025-04-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateEventDebug '(2, 2, "清龍寺本堂の改修", "清龍寺の本堂は、約400年の歴史を有し、現在の本堂は寛永6年（1629年）の大火災後に再建されたものです。老朽化が進んでおり、特に屋根の檜皮葺きの劣化が顕著です。これに伴い、伝統的な美しさを保ちながら耐久性を高める改修工事を行うことを決定しました。\n\n改修にかかる費用は約5,000万円を見込んでおり、地域の皆様からのご意見をお伺いしたいと考えています。賛成・反対を問わず、ご意見をお寄せいただけますようお願い申し上げます。", "2025-04-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateEventDebug '(3, 3, "東泉寺大門の修復", "東泉寺の大門は、建立から約300年が経過し、風雨による損傷が進んでいます。特に木材の腐食や瓦の落下が確認され、安全確保のため修復工事を実施することを決定しました。\n\n修復にかかる費用は約3,500万円を見込んでおり、地域の皆様からのご意見をお伺いしたいと考えています。ぜひご意見をお寄せください。", "2025-05-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateEventDebug '(4, 4, "金光峯寺本堂の耐震補強", "金光峯寺の本堂は、江戸時代初期に建立されたもので、耐震性に不安があるため、耐震補強工事を行うことを決定しました。地震の多い地域であるため、伝統的な構造を維持しつつ強化を図ります。\n\n工事費用は約6,000万円を見込んでおり、地域の皆様のご意見を募集しております。", "2025-06-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateEventDebug '(5, 5, "延輝寺の庭園整備", "延輝寺の庭園は、四季折々の美しい風景が楽しめる名園ですが、近年は植栽の手入れが追いつかず、一部荒廃が進んでいます。今回、景観を維持するために庭園の整備を実施することを決定しました。\n\n整備費用は約2,500万円を見込んでおり、皆様からのご意見をお待ちしております。", "2025-07-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateEventDebug '(6, 1, "浅艶寺お神輿巡行", "浅艶寺では毎年行われるお神輿巡行が、地域の活気を呼び起こす大きなイベントです。今年も豪華なお神輿が街を練り歩き、信者や地域住民が一丸となって盛り上がります。巡行には1,000万円の予算が見込まれており、皆様からのご寄付をお願い申し上げます。賛同いただける方は、ぜひご支援をお願いします。", "2025-08-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateEventDebug '(7, 2, "清龍寺の夏祭り", "清龍寺では毎年夏に大規模な祭りが開催されます。祭りでは地元の屋台が並び、伝統的な踊りや音楽が披露されます。今年も楽しいひとときを皆様にお届けするため、祭りの開催に1,500万円の予算を確保しました。地域の皆様からの寄付をお願い申し上げます。皆様のご支援をお待ちしております。", "2025-08-05T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateEventDebug '(8, 3, "東泉寺花火大会", "東泉寺では毎年夏に美しい花火大会を開催しています。今年も幻想的な花火を打ち上げ、地域の人々とともに夏の夜を楽しみます。花火の打ち上げにかかる費用は約2,000万円を見込んでおり、皆様からのご寄付をお願い申し上げます。ご支援いただける方は、ぜひご協力をお願い致します。", "2025-08-10T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateEventDebug '(9, 4, "金光峯寺の秋祭り", "金光峯寺では毎年秋に開催される祭りが、地域の文化活動の一環として盛大に行われます。秋の味覚を楽しみながら、伝統的な儀式や音楽を堪能できるイベントです。今年の祭りには3,000万円の予算が見込まれており、皆様からの寄付をお願い申し上げます。ご協力いただける方は、ぜひご支援をお願い致します。", "2025-09-15T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateEventDebug '(10, 5, "延輝寺の大盆踊り", "延輝寺では毎年、夏の終わりに大盆踊りが行われます。地域の人々が集まり、伝統的な踊りを楽しむこのイベントは、地域との絆を深める大切な機会となっています。盆踊りの開催に1,000万円の予算を確保しており、皆様からのご寄付をお願い申し上げます。ご支援いただける方は、ぜひご協力をお願い致します。", "2025-08-20T12:00:00Z")' --network $NETWORK --output json


echo "\n"
echo "---------------投票情報の更新---------------"
echo "\n"
dfx canister call koshiba-dapp-backend updateVoteDebug '(1, "1", variant { Agree })' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateVoteDebug '(1, "2", variant { Disagree })' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateVoteDebug '(2, "4", variant { Agree })' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateVoteDebug '(2, "5", variant { Disagree })' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateVoteDebug '(3, "7", variant { Agree })' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateVoteDebug '(3, "8", variant { Disagree })' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateVoteDebug '(4, "10", variant { Agree })' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateVoteDebug '(4, "11", variant { Disagree })' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateVoteDebug '(5, "13", variant { Agree })' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updateVoteDebug '(5, "14", variant { Disagree })' --network $NETWORK --output json

echo "\n"
echo "---------------支払い履歴の更新---------------"
echo "\n"
## 浅艶寺の支払い履歴
dfx canister call koshiba-dapp-backend updatePaymentDebug '(1, 1, "本殿の改修", "当神社の本殿は築120年が経過し、老朽化が進んでおります。特に屋根の傷みや柱の劣化が目立ち、安全面の懸念が増しております。これに伴い、本殿の改修工事を行いました。", 1000000, variant { Expenses }, "2025-01-20T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(2, 1, "檀家料の奉納", "檀家料をいただきました。", 1000000, variant { Income }, "2025-02-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(3, 1, "寺運営費", "人件費やお寺の維持費として使用しました。", 1000000, variant { Expenses }, "2025-02-05T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(4, 1, "神輿の準備費用", "神輿の修復費用や飾り付けのための費用を支出しました。", 1500000, variant { Expenses }, "2025-06-15T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(5, 1, "神輿の収益", "神輿を担いで賽銭を集め、収益を得ました。", 2000000, variant { Income }, "2025-06-16T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(6, 1, "神楽の奉納費用", "神楽の舞を奉納するための費用として、舞台設営や衣装、楽器などを準備しました。", 1000000, variant { Expenses }, "2025-09-10T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(7, 1, "神楽の収益", "神楽の奉納後、観客からの寄付を集めました。", 1500000, variant { Income }, "2025-09-15T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(8, 1, "神輿巡行の運営費", "神輿巡行の際の警備費や道具の管理費を支払いました。", 1200000, variant { Expenses }, "2025-07-10T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(9, 1, "神輿巡行の収益", "神輿巡行後に賽銭として集めた収益です。", 2500000, variant { Income }, "2025-07-12T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(10, 1, "祭り準備費用", "お祭りの準備費としての支出、各種備品の購入費用です。", 500000, variant { Expenses }, "2025-06-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(11, 1, "祭り収益", "お祭りで得た収益です。特に飲食の売上が好調でした。", 3000000, variant { Income }, "2025-06-20T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(12, 1, "お守り販売収益", "お守りの販売で得た収益です。", 700000, variant { Income }, "2025-03-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(13, 1, "神社修繕費用", "神社内の修繕作業費、特に壁や床の修復に使用しました。", 800000, variant { Expenses }, "2025-04-10T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(14, 1, "寄付金収益", "寄付金として集めた収益です。", 1200000, variant { Income }, "2025-05-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(15, 1, "祭り装飾費用", "お祭りの飾りつけや花火費用に支払いました。", 1500000, variant { Expenses }, "2025-06-10T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(16, 1, "祭りボランティア手当", "祭りのボランティアスタッフに支払った手当です。", 500000, variant { Expenses }, "2025-06-12T12:00:00Z")' --network $NETWORK --output json
# 清龍寺
dfx canister call koshiba-dapp-backend updatePaymentDebug '(17, 2, "本殿の改修", "当神社の本殿は築120年が経過し、老朽化が進んでおります。特に屋根の傷みや柱の劣化が目立ち、安全面の懸念が増しております。これに伴い、本殿の改修工事を行いました。", 1000000, variant { Expenses }, "2025-01-20T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(18, 2, "檀家料の奉納", "檀家料をいただきました。", 1000000, variant { Income }, "2025-02-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(19, 2, "寺運営費", "人件費やお寺の維持費として使用しました。", 1000000, variant { Expenses }, "2025-02-05T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(20, 2, "神輿の準備費用", "神輿の修復費用や飾り付けのための費用を支出しました。", 1500000, variant { Expenses }, "2025-06-15T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(21, 2, "神輿の収益", "神輿を担いで賽銭を集め、収益を得ました。", 2000000, variant { Income }, "2025-06-16T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(22, 2, "神楽の奉納費用", "神楽の舞を奉納するための費用として、舞台設営や衣装、楽器などを準備しました。", 1000000, variant { Expenses }, "2025-09-10T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(23, 2, "神楽の収益", "神楽の奉納後、観客からの寄付を集めました。", 1500000, variant { Income }, "2025-09-15T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(24, 2, "神輿巡行の運営費", "神輿巡行の際の警備費や道具の管理費を支払いました。", 1200000, variant { Expenses }, "2025-07-10T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(25, 2, "神輿巡行の収益", "神輿巡行後に賽銭として集めた収益です。", 2500000, variant { Income }, "2025-07-12T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(26, 2, "祭り準備費用", "お祭りの準備費としての支出、各種備品の購入費用です。", 500000, variant { Expenses }, "2025-06-01T12:00:00Z")' --network $NETWORK --output json
# 東泉寺
dfx canister call koshiba-dapp-backend updatePaymentDebug '(27, 3, "本殿の改修", "当神社の本殿は築120年が経過し、老朽化が進んでおります。特に屋根の傷みや柱の劣化が目立ち、安全面の懸念が増しております。これに伴い、本殿の改修工事を行いました。", 1000000, variant { Expenses }, "2025-01-20T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(28, 3, "檀家料の奉納", "檀家料をいただきました。", 1000000, variant { Income }, "2025-02-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(29, 3, "寺運営費", "人件費やお寺の維持費として使用しました。", 1000000, variant { Expenses }, "2025-02-05T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(30, 3, "神輿の準備費用", "神輿の修復費用や飾り付けのための費用を支出しました。", 1500000, variant { Expenses }, "2025-06-15T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(31, 3, "神輿の収益", "神輿を担いで賽銭を集め、収益を得ました。", 2000000, variant { Income }, "2025-06-16T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(32, 3, "神楽の奉納費用", "神楽の舞を奉納するための費用として、舞台設営や衣装、楽器などを準備しました。", 1000000, variant { Expenses }, "2025-09-10T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(33, 3, "神楽の収益", "神楽の奉納後、観客からの寄付を集めました。", 1500000, variant { Income }, "2025-09-15T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(34, 3, "神輿巡行の運営費", "神輿巡行の際の警備費や道具の管理費を支払いました。", 1200000, variant { Expenses }, "2025-07-10T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(35, 3, "神輿巡行の収益", "神輿巡行後に賽銭として集めた収益です。", 2500000, variant { Income }, "2025-07-12T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(36, 3, "祭り準備費用", "お祭りの準備費としての支出、各種備品の購入費用です。", 500000, variant { Expenses }, "2025-06-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(37, 3, "祭り収益", "お祭りで得た収益です。特に飲食の売上が好調でした。", 3000000, variant { Income }, "2025-06-20T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(38, 3, "お守り販売収益", "お守りの販売で得た収益です。", 700000, variant { Income }, "2025-03-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(39, 3, "神社修繕費用", "神社内の修繕作業費、特に壁や床の修復に使用しました。", 800000, variant { Expenses }, "2025-04-10T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(40, 3, "寄付金収益", "寄付金として集めた収益です。", 1200000, variant { Income }, "2025-05-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(41, 3, "祭り装飾費用", "お祭りの飾りつけや花火費用に支払いました。", 1500000, variant { Expenses }, "2025-06-10T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(42, 3, "祭りボランティア手当", "祭りのボランティアスタッフに支払った手当です。", 500000, variant { Expenses }, "2025-06-12T12:00:00Z")' --network $NETWORK --output json
# 金光峯寺
dfx canister call koshiba-dapp-backend updatePaymentDebug '(43, 4, "本殿の改修", "当神社の本殿は築120年が経過し、老朽化が進んでおります。特に屋根の傷みや柱の劣化が目立ち、安全面の懸念が増しております。これに伴い、本殿の改修工事を行いました。", 1000000, variant { Expenses }, "2025-01-20T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(44, 4, "檀家料の奉納", "檀家料をいただきました。", 1000000, variant { Income }, "2025-02-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(45, 4, "寺運営費", "人件費やお寺の維持費として使用しました。", 1000000, variant { Expenses }, "2025-02-05T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(46, 4, "神輿の準備費用", "神輿の修復費用や飾り付けのための費用を支出しました。", 1500000, variant { Expenses }, "2025-06-15T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(47, 4, "神輿の収益", "神輿を担いで賽銭を集め、収益を得ました。", 2000000, variant { Income }, "2025-06-16T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(48, 4, "神楽の奉納費用", "神楽の舞を奉納するための費用として、舞台設営や衣装、楽器などを準備しました。", 1000000, variant { Expenses }, "2025-09-10T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(49, 4, "神楽の収益", "神楽の奉納後、観客からの寄付を集めました。", 1500000, variant { Income }, "2025-09-15T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(50, 4, "神輿巡行の運営費", "神輿巡行の際の警備費や道具の管理費を支払いました。", 1200000, variant { Expenses }, "2025-07-10T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(51, 4, "神輿巡行の収益", "神輿巡行後に賽銭として集めた収益です。", 2500000, variant { Income }, "2025-07-12T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(52, 4, "祭り準備費用", "お祭りの準備費としての支出、各種備品の購入費用です。", 500000, variant { Expenses }, "2025-06-01T12:00:00Z")' --network $NETWORK --output json
# 延輝寺
dfx canister call koshiba-dapp-backend updatePaymentDebug '(53, 5, "本殿の改修", "当神社の本殿は築120年が経過し、老朽化が進んでおります。特に屋根の傷みや柱の劣化が目立ち、安全面の懸念が増しております。これに伴い、本殿の改修工事を行いました。", 1000000, variant { Expenses }, "2025-01-20T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(54, 5, "檀家料の奉納", "檀家料をいただきました。", 1000000, variant { Income }, "2025-02-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(55, 5, "寺運営費", "人件費やお寺の維持費として使用しました。", 1000000, variant { Expenses }, "2025-02-05T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(56, 5, "神輿の準備費用", "神輿の修復費用や飾り付けのための費用を支出しました。", 1500000, variant { Expenses }, "2025-06-15T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(57, 5, "神輿の収益", "神輿を担いで賽銭を集め、収益を得ました。", 2000000, variant { Income }, "2025-06-16T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(58, 5, "神楽の奉納費用", "神楽の舞を奉納するための費用として、舞台設営や衣装、楽器などを準備しました。", 1000000, variant { Expenses }, "2025-09-10T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(59, 5, "神楽の収益", "神楽の奉納後、観客からの寄付を集めました。", 1500000, variant { Income }, "2025-09-15T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(60, 5, "神輿巡行の運営費", "神輿巡行の際の警備費や道具の管理費を支払いました。", 1200000, variant { Expenses }, "2025-07-10T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(61, 5, "神輿巡行の収益", "神輿巡行後に賽銭として集めた収益です。", 2500000, variant { Income }, "2025-07-12T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(62, 5, "祭り準備費用", "お祭りの準備費としての支出、各種備品の購入費用です。", 500000, variant { Expenses }, "2025-06-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(63, 5, "祭り収益", "お祭りで得た収益です。特に飲食の売上が好調でした。", 3000000, variant { Income }, "2025-06-20T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(64, 5, "お守り販売収益", "お守りの販売で得た収益です。", 700000, variant { Income }, "2025-03-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(65, 5, "神社修繕費用", "神社内の修繕作業費、特に壁や床の修復に使用しました。", 800000, variant { Expenses }, "2025-04-10T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(66, 5, "寄付金収益", "寄付金として集めた収益です。", 1200000, variant { Income }, "2025-05-01T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(67, 5, "祭り装飾費用", "お祭りの飾りつけや花火費用に支払いました。", 1500000, variant { Expenses }, "2025-06-10T12:00:00Z")' --network $NETWORK --output json
dfx canister call koshiba-dapp-backend updatePaymentDebug '(68, 5, "祭りボランティア手当", "祭りのボランティアスタッフに支払った手当です。", 500000, variant { Expenses }, "2025-06-12T12:00:00Z")' --network $NETWORK --output json
echo "\n"
echo "------------------------------------------"
