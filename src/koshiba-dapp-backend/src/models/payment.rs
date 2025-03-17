use crate::entities::payment_entity::PaymentEntity;
use crate::Temple;
use time::OffsetDateTime;

use super::payment_status::PaymentBalanceStatus;

pub struct Payment {
    pub id: u32,
    pub title: String,
    pub content: String,
    pub amount: u32,
    pub status: PaymentBalanceStatus,
    pub temple: Option<Temple>,
    pub created_at: OffsetDateTime,
}
impl Payment {
    pub fn from_entity(payment_entity: PaymentEntity, temple: Option<Temple>) -> Self {
        Payment {
            id: payment_entity.id,
            title: payment_entity.title,
            content: payment_entity.content,
            amount: payment_entity.amount,
            status: payment_entity.status,
            temple,
            created_at: OffsetDateTime::from_unix_timestamp_nanos(
                payment_entity.created_at_millisec as i128 * 1_000_000,
            )
            .unwrap(),
        }
    }
}
