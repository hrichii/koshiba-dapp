use crate::models::{grade::Grade, temple::Temple, user::User};

pub trait UserRepository {
    fn save(&self, user: User) -> User;
    fn fetch(&self, user_id: u32) -> Option<User>;
}

pub struct StableUserRepository;

impl UserRepository for StableUserRepository {
    fn save(&self, user: User) -> User {
        user
    }
    fn fetch(&self, user_id: u32) -> Option<User> {
        Some(User {
            id: user_id,
            last_name: "山田".to_string(),
            first_name: "太郎".to_string(),
            grade: Grade::A,
            temple: Temple { id: 1, name: "浅草寺".to_string() },
            vote_count: 10,
            payment: 1_000_000,
        })
    }
}
