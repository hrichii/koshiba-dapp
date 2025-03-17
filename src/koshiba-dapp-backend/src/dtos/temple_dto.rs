use crate::models::{address::Address, temple::Temple};
use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Serialize, Deserialize, CandidType)]
pub struct TempleDto {
    pub id: u32,
    pub name: String,
    pub address: Address,
    pub image_url: String,
    pub description: String,
}

impl TempleDto {
    pub fn from_temple(temple: Temple) -> Self {
        TempleDto {
            id: temple.id,
            name: temple.name,
            address: temple.address,
            image_url: temple.image_url,
            description: temple.description,
        }
    }
}
