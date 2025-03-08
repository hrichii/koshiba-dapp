use candid::{CandidType, Decode, Deserialize, Encode};
use ic_stable_structures::{storable::Bound, Storable};
use serde::Serialize;

use std::borrow::Cow;

use crate::models::{grade::Grade, vote_status::VoteStatus};

#[derive(Clone, Serialize, Deserialize, CandidType)]
pub struct VoteEntity {
    pub id: u32,
    pub event_id: u32,
    pub user_id: String,
    pub vote_status: VoteStatus,
    pub grade: Grade,
}

impl Storable for VoteEntity {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded { max_size: 4096, is_fixed_size: false };
}
