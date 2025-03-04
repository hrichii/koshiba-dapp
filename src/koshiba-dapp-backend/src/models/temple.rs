use candid::{CandidType, Deserialize};
use serde::Serialize;

use crate::entities::temple_entity::TempleEntity;

#[derive(Serialize, Deserialize, CandidType)]
pub struct Temple {
    pub id: u32,
    pub name: String,
}
impl Temple {
    pub fn from_entity(temple_entity: TempleEntity) -> Self {
        Temple { id: temple_entity.id, name: temple_entity.name }
    }
}
