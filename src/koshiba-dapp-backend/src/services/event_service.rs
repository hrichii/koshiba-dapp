use crate::{
    entities::event_entity::EventEntity, models::event::Event,
    repositories::event_repository::EventRepository,
};
use time::OffsetDateTime;

pub struct EventService {
    event_repository: Box<dyn EventRepository>,
}

impl EventService {
    pub fn new(event_repository: Box<dyn EventRepository>) -> Self {
        EventService { event_repository }
    }

    pub fn fetch(&self, id: u32) -> Option<Event> {
        let event_entity = self.event_repository.fetch(id)?;
        Some(Event::from_entity(event_entity))
    }

    pub fn fetch_all(&self) -> Vec<Event> {
        self.event_repository.fetch_all().into_iter().map(Event::from_entity).collect()
    }

    pub fn save(
        &self,
        id: u32,
        title: String,
        content: String,
        deadline_at: OffsetDateTime,
    ) -> Event {
        let event_entity: EventEntity = self.event_repository.save(id, title, content, deadline_at);
        Event::from_entity(event_entity)
    }

    pub fn delete(&self, id: u32) {
        self.event_repository.delete(id);
    }
}
