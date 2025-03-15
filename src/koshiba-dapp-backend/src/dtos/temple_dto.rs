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
            address: Address {
                postal_code: "1110032".to_string(),
                province: "東京都".to_string(),
                city: "台東区".to_string(),
                street: "浅草2-3-1".to_string(),
                building: None,
            },
            image_url: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Asakusa_Senso-ji_2021-12_ac_%282%29.jpg".to_string(),
            description: "浅草寺（せんそうじ）は、東京都台東区浅草二丁目にある都内最古の寺で、正式には金龍山浅草寺（きんりゅうざんせんそうじ）と号する。聖観世音菩薩を本尊とすることから、浅草観音（あさくさかんのん）として知られている。".to_string(),
        }
    }
}
