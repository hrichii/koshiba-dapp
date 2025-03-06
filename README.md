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
dfx canister call koshiba-dapp-backend get_temples
```