use crate::{
    entities::vote_entity::VoteEntity,
    models::vote_status::VoteStatus,
    repositories::{
        event_repository::EventRepository, user_repository::UserRepository,
        vote_repository::VoteRepository,
    },
};

pub struct VoteService {
    vote_repository: Box<dyn VoteRepository>,
    event_repository: Box<dyn EventRepository>,
    user_repository: Box<dyn UserRepository>,
}

impl VoteService {
    pub fn new(
        vote_repository: Box<dyn VoteRepository>,
        event_repository: Box<dyn EventRepository>,
        user_repository: Box<dyn UserRepository>,
    ) -> Self {
        VoteService { vote_repository, event_repository, user_repository }
    }

    pub fn save(
        &self,
        event_id: u32,
        user_id: String,
        vote_status: VoteStatus,
    ) -> Option<VoteEntity> {
        self.event_repository.fetch(event_id)?;
        let user_entity = self.user_repository.fetch(user_id.clone())?;
        let vote_entity =
            self.vote_repository.save(event_id.clone(), user_entity.clone(), vote_status.clone());
        Some(vote_entity)
    }

    pub fn fetch_all(&self) -> Vec<VoteEntity> {
        self.vote_repository.fetch_all()
    }

    pub fn delete(&self, event_id: u32, user_id: String) {
        self.vote_repository.delete(event_id, user_id);
    }
}
