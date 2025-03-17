use candid::{CandidType, Deserialize};
use serde::Serialize;

use crate::entities::temple_entity::TempleEntity;

use super::address::Address;

#[derive(Serialize, Deserialize, CandidType, Clone)]
pub struct Temple {
    pub id: u32,
    pub name: String,
    pub address: Address,
    pub image_url: String,
    pub description: String,
}
impl Temple {
    pub fn from_entity(temple_entity: TempleEntity) -> Self {
        Temple {
            id: temple_entity.id,
            name: temple_entity.name,
            address: temple_entity.address,
            image_url: temple_entity.image_url,
            description: temple_entity.description,
        }
    }
}
