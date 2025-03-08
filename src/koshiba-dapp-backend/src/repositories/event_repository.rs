use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;
use time::OffsetDateTime;

use crate::entities::event_entity::EventEntity;
use crate::utils::offset_date_time_ext::OffsetDateTimeExt;

type Memory = VirtualMemory<DefaultMemoryImpl>;

pub trait EventRepository {
    fn save(
        &self,
        id: u32,
        temple_id: u32,
        title: String,
        content: String,
        deadline_at: OffsetDateTime,
    ) -> EventEntity;

    fn fetch(&self, id: u32) -> Option<EventEntity>;

    fn fetch_all(&self) -> Vec<EventEntity>;
    fn fetch_all_by_temple_id(&self, temple_id: u32) -> Vec<EventEntity>;

    fn delete(&self, id: u32);
}

pub struct StableEventRepository;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static EVENT: RefCell<StableBTreeMap<u32, EventEntity, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(2))),
        )
    );
}

impl EventRepository for StableEventRepository {
    fn save(
        &self,
        id: u32,
        temple_id: u32,
        title: String,
        content: String,
        deadline_at: OffsetDateTime,
    ) -> EventEntity {
        let old_entity = self.fetch(id);
        let mut created_at_millisec: i128 =
            OffsetDateTime::ic_now().unix_timestamp_nanos() / 1_000_000;
        if let Some(old) = old_entity {
            created_at_millisec = old.created_at_millisec;
        }
        let new_entity: EventEntity = EventEntity {
            id,
            temple_id,
            title,
            content,
            deadline_at_millisec: deadline_at.unix_timestamp_nanos() / 1_000_000,
            created_at_millisec,
        };
        EVENT.with(|users| users.borrow_mut().insert(new_entity.id, new_entity.clone()));
        new_entity
    }

    fn fetch(&self, id: u32) -> Option<EventEntity> {
        EVENT.with(|events| events.borrow().get(&id))
    }

    fn fetch_all(&self) -> Vec<EventEntity> {
        EVENT.with(|events| events.borrow().values().collect())
    }

    fn fetch_all_by_temple_id(&self, temple_id: u32) -> Vec<EventEntity> {
        EVENT.with(|events| {
            events.borrow().values().filter(|event| event.temple_id == temple_id).collect()
        })
    }

    fn delete(&self, id: u32) {
        EVENT.with(|events| events.borrow_mut().remove(&id));
    }
}
