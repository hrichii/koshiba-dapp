use crate::{Vote, VoteStatus};
use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Serialize, Deserialize, CandidType)]
pub struct Event {
    pub event_id: u32,
    pub title: String,
    pub content: String,
    pub vote: Vote,
    pub your_vote: VoteStatus,
    pub deadline_at: String,
    pub created_at: String,
}
