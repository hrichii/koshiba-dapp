use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Clone, Serialize, Deserialize, CandidType)]
pub enum Grade {
    S,
    A,
    B,
    C,
    D,
}

impl Grade {
    pub fn payment(&self) -> u64 {
        match self {
            Grade::S => 5_000_000,
            Grade::A => 3_000_000,
            Grade::B => 1_000_000,
            Grade::C => 500_000,
            Grade::D => 300_000,
        }
    }

    pub fn vote_count(&self) -> u32 {
        match self {
            Grade::S => 25,
            Grade::A => 15,
            Grade::B => 10,
            Grade::C => 5,
            Grade::D => 3,
        }
    }
}
