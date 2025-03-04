use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Serialize, Deserialize, CandidType)]
pub struct Temple {
    pub id: u32,
    pub name: String,
}
