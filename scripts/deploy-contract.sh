#!/usr/bin/env bash
set -euo pipefail

if ! command -v soroban >/dev/null 2>&1; then
  echo 'Soroban CLI is required.'
  exit 1
fi

soroban contract build --package payment_contract
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/payment_contract.wasm --network testnet
