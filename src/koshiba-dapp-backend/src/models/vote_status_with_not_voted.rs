use candid::{CandidType, Deserialize};
use serde::Serialize;

use super::vote_status::VoteStatus;

#[derive(Clone, Serialize, Deserialize, CandidType)]
pub enum VoteStatusWithNotVoted {
    NotVoted,
    Agree,
    Disagree,
}

impl VoteStatusWithNotVoted {
    pub fn from_vote_status(status: VoteStatus) -> Self {
        match status {
            VoteStatus::Agree => VoteStatusWithNotVoted::Agree,
            VoteStatus::Disagree => VoteStatusWithNotVoted::Disagree,
        }
    }
}
