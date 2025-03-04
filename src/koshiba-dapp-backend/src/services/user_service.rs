use crate::{
    entities::user_entity::UserEntity,
    models::{grade::Grade, temple::Temple, user::User},
    repositories::{temple_repository::TempleRepository, user_repository::UserRepository},
};

pub struct UserService {
    user_repository: Box<dyn UserRepository>,
    temple_repository: Box<dyn TempleRepository>,
}

impl UserService {
    pub fn new(
        user_repository: Box<dyn UserRepository>,
        temple_repository: Box<dyn TempleRepository>,
    ) -> Self {
        UserService { user_repository, temple_repository }
    }

    pub fn fetch(&self, id: String) -> Option<User> {
        let user_entity = self.user_repository.fetch(id)?;
        let nullable_temple_entity = self.temple_repository.fetch(user_entity.temple_id.clone());

        Some(User::from_entity(user_entity, nullable_temple_entity.map(Temple::from_entity)))
    }

    pub fn save(
        &self,
        id: String,
        last_name: String,
        first_name: String,
        grade: Grade,
        temple_id: u32,
    ) -> User {
        let user_entity: UserEntity = self.user_repository.save(
            id.clone(),
            last_name.clone(),
            first_name.clone(),
            grade.clone(),
            temple_id.clone(),
        );
        let nullable_temple_entity = self.temple_repository.fetch(user_entity.temple_id.clone());
        User::from_entity(user_entity, nullable_temple_entity.map(Temple::from_entity))
    }

    pub fn delete(&self, id: String) {
        self.user_repository.delete(id);
    }
}
