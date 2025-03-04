use candid::{CandidType, Decode, Deserialize, Encode};
use ic_stable_structures::{storable::Bound, Storable};
use serde::Serialize;

use std::borrow::Cow;

#[derive(Clone, Serialize, Deserialize, CandidType)]
pub struct TempleEntity {
    pub id: u32,
    pub name: String,
}

impl Storable for TempleEntity {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded { max_size: 2048, is_fixed_size: false };
}
