#![cfg_attr(not(test), no_std)]

use soroban_sdk::{contract, contractimpl, symbol_short, vec, Address, Env, String, Symbol};

#[contract]
pub struct PaymentTracker;

#[derive(Clone)]
pub struct PaymentRecord {
    recipient: String,
    amount: String,
    asset: String,
    memo: String,
    status: Symbol,
    hash: String,
    ledger: u64,
    timestamp: u64,
}

#[contractimpl]
impl PaymentTracker {
    pub fn record_payment(env: Env, recipient: String, amount: String, asset: String, memo: String) -> Symbol {
        let hash = symbol_short!("sent");
        let ledger = env.ledger().sequence();
        let timestamp = env.ledger().timestamp();
        env.storage().persistent().set(&hash, &(
            recipient.clone(),
            amount.clone(),
            asset.clone(),
            memo.clone(),
            symbol_short!("pending"),
            hash,
            ledger,
            timestamp,
        ));
        env.events().publish(("payment", "recorded"), (recipient, amount, asset, memo));
        symbol_short!("pending")
    }

    pub fn get_payment(env: Env, id: Symbol) -> Option<(String, String, String, String, Symbol, String, u64, u64)> {
        env.storage().persistent().get(&id)
    }
}

mod test;
