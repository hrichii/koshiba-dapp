use crate::entities::user_entity::UserEntity;
use crate::{Grade, Temple};
use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Serialize, Deserialize, CandidType)]
pub struct User {
    pub id: String,
    pub last_name: String,
    pub first_name: String,
    pub grade: Grade,
    pub temple: Option<Temple>,
}
impl User {
    pub fn from_entity(user_entity: UserEntity, temple: Option<Temple>) -> Self {
        User {
            id: user_entity.id,
            last_name: user_entity.last_name,
            first_name: user_entity.first_name,
            grade: user_entity.grade,
            temple,
        }
    }
}
