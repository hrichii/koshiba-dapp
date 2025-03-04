use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Serialize, Deserialize, CandidType)]
pub struct Vote {
    pub agree: u32,
    pub disagree: u32,
    pub total: u32,
}
