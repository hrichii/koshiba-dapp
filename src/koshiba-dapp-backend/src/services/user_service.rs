use crate::{models::user::User, repositories::user_repository::UserRepository};

pub struct UserService {
    repository: Box<dyn UserRepository>,
}

impl UserService {
    pub fn new(repository: Box<dyn UserRepository>) -> Self {
        UserService { repository }
    }

    pub fn save(&self, user: User) -> User {
        self.repository.save(user)
    }

    pub fn fetch(&self, user_id: u32) -> Option<User> {
        self.repository.fetch(user_id)
    }
}
