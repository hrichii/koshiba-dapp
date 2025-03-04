use crate::{models::user::User, Grade, Temple};
use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Serialize, Deserialize, CandidType)]
pub struct UserDto {
    pub id: String,
    pub last_name: String,
    pub first_name: String,
    pub grade: Grade,
    pub temple: Option<Temple>,
    pub vote_count: u32,
    pub payment: u64,
}

impl UserDto {
    pub fn from_user(user: User) -> Self {
        UserDto {
            id: user.id,
            last_name: user.last_name,
            first_name: user.first_name,
            grade: user.grade.clone(),
            temple: user.temple,
            vote_count: user.grade.vote_count(),
            payment: user.grade.payment(),
        }
    }
}
