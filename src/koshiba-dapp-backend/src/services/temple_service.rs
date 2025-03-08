use crate::{
    entities::temple_entity::TempleEntity, models::temple::Temple,
    repositories::temple_repository::TempleRepository,
};

pub struct TempleService {
    repository: Box<dyn TempleRepository>,
}

impl TempleService {
    pub fn new(repository: Box<dyn TempleRepository>) -> Self {
        TempleService { repository }
    }

    pub fn fetch_all(&self) -> Vec<Temple> {
        self.repository.fetch_all().into_iter().map(Temple::from_entity).collect()
    }

    pub fn save(&self, id: u32, name: String) -> Temple {
        let temple_entity: TempleEntity = self.repository.save(id.clone(), name.clone());
        Temple::from_entity(temple_entity)
    }

    pub fn delete(&self, id: u32) {
        self.repository.delete(id);
    }
}
