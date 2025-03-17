use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Serialize, Deserialize, CandidType, Clone)]
pub struct Address {
    pub postal_code: String,      // 郵便番号
    pub province: String,         // 都道府県 (例: 東京都)
    pub city: String,             // 市区町村 (例: 葛飾区)
    pub street: String,           // 町名・番地 (例: 東四つ木)
    pub building: Option<String>, // 建物名・部屋番号 (任意)
}
