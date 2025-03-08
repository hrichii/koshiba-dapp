use crate::entities::user_entity::UserEntity;
use crate::models::grade::Grade;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;

type Memory = VirtualMemory<DefaultMemoryImpl>;

pub trait UserRepository {
    fn save(
        &self,
        id: String,
        last_name: String,
        first_name: String,
        grade: Grade,
        temple_id: u32,
    ) -> UserEntity;
    fn fetch(&self, id: String) -> Option<UserEntity>;
    fn fetch_all(&self) -> Vec<UserEntity>;
    fn delete(&self, id: String);
}

pub struct StableUserRepository;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static USERS: RefCell<StableBTreeMap<String, UserEntity, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );
}

impl UserRepository for StableUserRepository {
    fn save(
        &self,
        id: String,
        last_name: String,
        first_name: String,
        grade: Grade,
        temple_id: u32,
    ) -> UserEntity {
        let user_entity: UserEntity =
            UserEntity { id: id.clone(), last_name, first_name, grade, temple_id };

        USERS.with(|users| users.borrow_mut().insert(id.clone(), user_entity.clone()));
        user_entity
    }

    fn fetch(&self, id: String) -> Option<UserEntity> {
        USERS.with(|users| users.borrow().get(&id))
    }

    fn fetch_all(&self) -> Vec<UserEntity> {
        USERS.with(|users| users.borrow().values().collect())
    }

    fn delete(&self, id: String) {
        USERS.with(|users| users.borrow_mut().remove(&id));
    }
}
