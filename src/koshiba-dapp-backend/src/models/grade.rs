use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Clone, Serialize, Deserialize, CandidType)]
pub enum Grade {
    S,
    A,
    B,
}

impl Grade {
    pub fn payment(&self) -> u64 {
        match self {
            Grade::S => 50_000,
            Grade::A => 10_000,
            Grade::B => 3_000,
        }
    }

    pub fn vote_count(&self) -> u32 {
        match self {
            Grade::S => 25,
            Grade::A => 10,
            Grade::B => 3,
        }
    }
}
