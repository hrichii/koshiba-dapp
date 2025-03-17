use crate::models::{payment::Payment, payment_status::PaymentBalanceStatus};
use candid::{CandidType, Deserialize};
use serde::Serialize;
use time::format_description::well_known::Rfc3339;

#[derive(Serialize, Deserialize, CandidType)]
pub struct PaymentDto {
    pub payment_id: u32,
    pub title: String,
    pub content: String,
    pub temple_id: Option<u32>,
    pub temple_name: Option<String>,
    pub amount: u32,
    pub status: PaymentBalanceStatus,
    pub created_at: String,
}
impl PaymentDto {
    pub fn from_payment(payment: Payment) -> Self {
        PaymentDto {
            payment_id: payment.id,
            title: payment.title,
            content: payment.content,
            temple_id: payment.temple.clone().map(|temple| temple.id),
            temple_name: payment.temple.clone().map(|temple| temple.name),
            amount: payment.amount,
            status: payment.status,
            created_at: payment.created_at.format(&Rfc3339).unwrap(),
        }
    }
}
