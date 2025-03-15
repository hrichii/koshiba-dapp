use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Clone, Serialize, Deserialize, CandidType)]
pub enum PaymentBalanceStatus {
    Expenses,
    Income,
}
