use crate::{Grade, Temple};
use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Serialize, Deserialize, CandidType)]
pub struct User {
    pub id: u32,
    pub last_name: String,
    pub first_name: String,
    pub grade: Grade,
    pub temple: Temple,
    pub vote_count: u32,
    pub payment: u64,
}
