use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Serialize, Deserialize, CandidType)]
pub enum VoteStatus {
    NotVoted,
    Agree,
    Disagree,
}
