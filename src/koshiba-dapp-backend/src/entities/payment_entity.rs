use candid::{CandidType, Decode, Deserialize, Encode};
use ic_stable_structures::{storable::Bound, Storable};
use serde::Serialize;

use std::borrow::Cow;

use crate::models::payment_status::PaymentBalanceStatus;

#[derive(Clone, Serialize, Deserialize, CandidType)]
pub struct PaymentEntity {
    pub id: u32,
    pub temple_id: u32,
    pub amount: u32,
    pub title: String,
    pub content: String,
    pub status: PaymentBalanceStatus,
    pub created_at_millisec: i128,
}

impl Storable for PaymentEntity {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded { max_size: 4096, is_fixed_size: false };
}
