use candid::Principal;

use crate::{
    entities::user_entity::UserEntity,
    models::{grade::Grade, temple::Temple, user::User},
    repositories::user_repository::UserRepository,
};

pub struct UserService {
    repository: Box<dyn UserRepository>,
}

impl UserService {
    pub fn new(repository: Box<dyn UserRepository>) -> Self {
        UserService { repository }
    }

    pub fn fetch(&self, id: String) -> Option<User> {
        let nullable_user_entity = self.repository.fetch(id);
        if let Some(user_entity) = nullable_user_entity {
            return Some(User::from_entity(
                user_entity.clone(),
                // TODO temple_id から Temple を取得する
                Temple { id: user_entity.temple_id.clone(), name: "浅草寺".to_string() },
            ));
        }
        None
    }

    pub fn save(
        &self,
        id: String,
        last_name: String,
        first_name: String,
        grade: Grade,
        temple_id: u32,
    ) -> User {
        let user_entity: UserEntity = self.repository.save(
            id.clone(),
            last_name.clone(),
            first_name.clone(),
            grade.clone(),
            temple_id.clone(),
        );
        // TODO temple_id から Temple を取得する
        User::from_entity(user_entity, Temple { id: temple_id, name: "浅草寺".to_string() })
    }

    pub fn delete(&self, id: String) {
        self.repository.delete(id);
    }
}
