# Soroban Payment Contract

This folder contains a starter Soroban smart contract for the Payment Tracker.

## Build

Use the Soroban CLI to compile the contract:

```bash
soroban contract build --package payment_contract
```

## Deploy

```bash
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/payment_contract.wasm --network testnet
```
