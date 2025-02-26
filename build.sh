#!/bin/bash
# build
if ! cargo build --release --target wasm32-unknown-unknown --package koshiba-dapp-backend; then
  echo "Build failed." >&2
  exit 1
fi

# candid-extractor
if ! candid-extractor target/wasm32-unknown-unknown/release/koshiba_dapp_backend.wasm > src/koshiba-dapp-backend/koshiba-dapp-backend.did; then
  echo "candid-extractor failed." >&2
  exit 1
fi