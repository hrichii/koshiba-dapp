use crate::entities::temple_entity::TempleEntity;

use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;

type Memory = VirtualMemory<DefaultMemoryImpl>;

pub trait TempleRepository {
    fn save(&self, id: u32, name: String) -> TempleEntity;

    fn fetch(&self, id: u32) -> Option<TempleEntity>;

    fn fetch_all(&self) -> Vec<TempleEntity>;

    fn delete(&self, id: u32);
}

pub struct StableTempleRepository;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static TEMPLES: RefCell<StableBTreeMap<u32, TempleEntity, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(1))),
        )
    );
}

impl TempleRepository for StableTempleRepository {
    fn save(&self, id: u32, name: String) -> TempleEntity {
        let temple_entity: TempleEntity = TempleEntity { id, name };

        TEMPLES.with(|users| users.borrow_mut().insert(id.clone(), temple_entity.clone()));
        temple_entity
    }

    fn fetch(&self, id: u32) -> Option<TempleEntity> {
        TEMPLES.with(|users| users.borrow().get(&id))
    }

    fn fetch_all(&self) -> Vec<TempleEntity> {
        TEMPLES.with(|temples| temples.borrow().values().collect())
    }

    fn delete(&self, id: u32) {
        TEMPLES.with(|temples| temples.borrow_mut().remove(&id));
    }
}
