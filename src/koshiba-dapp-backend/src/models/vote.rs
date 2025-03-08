use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Clone, Serialize, Deserialize, CandidType)]
pub struct VoteStatistics {
    pub agree: u32,
    pub disagree: u32,
    pub total: u32,
}
