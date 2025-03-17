use crate::{
    entities::temple_entity::TempleEntity,
    models::{address::Address, temple::Temple},
    repositories::{
        event_repository::EventRepository, temple_repository::TempleRepository,
        vote_repository::VoteRepository,
    },
};

pub struct TempleService {
    temple_repository: Box<dyn TempleRepository>,
    vote_repository: Box<dyn VoteRepository>,
    event_repository: Box<dyn EventRepository>,
}

impl TempleService {
    pub fn new(
        temple_repository: Box<dyn TempleRepository>,
        vote_repository: Box<dyn VoteRepository>,
        event_repository: Box<dyn EventRepository>,
    ) -> Self {
        TempleService { temple_repository, vote_repository, event_repository }
    }

    pub fn fetch(&self, id: u32) -> Option<Temple> {
        self.temple_repository.fetch(id).map(Temple::from_entity)
    }

    pub fn fetch_all(&self) -> Vec<Temple> {
        self.temple_repository.fetch_all().into_iter().map(Temple::from_entity).collect()
    }

    pub fn save(
        &self,
        id: u32,
        name: String,
        address: Address,
        image_url: String,
        description: String,
    ) -> Temple {
        let temple_entity: TempleEntity = self.temple_repository.save(
            id.clone(),
            name.clone(),
            address,
            image_url.clone(),
            description.clone(),
        );
        Temple::from_entity(temple_entity)
    }

    pub fn delete(&self, id: u32) {
        self.event_repository.fetch_all_by_temple_id(id).iter().for_each(|event| {
            self.event_repository.delete(event.id);
            self.vote_repository.delete_by_event_id(event.id);
        });
        self.temple_repository.delete(id);
    }
}
