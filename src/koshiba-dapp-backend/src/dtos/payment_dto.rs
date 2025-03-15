use crate::models::payment_status::PaymentBalanceStatus;
use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Serialize, Deserialize, CandidType)]
pub struct PaymentDto {
    pub payment_id: u32,
    pub title: String,
    pub content: String,
    pub temple_id: Option<u32>,
    pub temple_name: Option<String>,
    pub status: PaymentBalanceStatus,
    pub created_at: String,
}
