use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;
use time::OffsetDateTime;

use crate::entities::payment_entity::PaymentEntity;
use crate::models::payment_status::PaymentBalanceStatus;

type Memory = VirtualMemory<DefaultMemoryImpl>;

pub trait PaymentRepository {
    fn save(
        &self,
        id: u32,
        temple_id: u32,
        title: String,
        content: String,
        amount: u32,
        status: PaymentBalanceStatus,
        created_at: OffsetDateTime,
    ) -> PaymentEntity;
    fn fetch(&self, id: u32) -> Option<PaymentEntity>;
    fn fetch_all(&self) -> Vec<PaymentEntity>;
    fn fetch_all_by_temple_id(&self, temple_id: u32) -> Vec<PaymentEntity>;
    fn delete(&self, id: u32);
}

pub struct StablePaymentRepository;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static PAYMENT: RefCell<StableBTreeMap<u32, PaymentEntity, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(4))),
        )
    );
}

impl PaymentRepository for StablePaymentRepository {
    fn save(
        &self,
        id: u32,
        temple_id: u32,
        title: String,
        content: String,
        amount: u32,
        status: PaymentBalanceStatus,
        created_at: OffsetDateTime,
    ) -> PaymentEntity {
        let nullable_old_entity = self.fetch(id);
        let mut created_at_millisec: i128 = created_at.unix_timestamp_nanos() / 1_000_000;
        if let Some(old_entity) = nullable_old_entity {
            created_at_millisec = old_entity.created_at_millisec;
        }
        let new_entity: PaymentEntity =
            PaymentEntity { id, temple_id, title, content, amount, status, created_at_millisec };
        PAYMENT.with(|payments| payments.borrow_mut().insert(new_entity.id, new_entity.clone()));
        new_entity
    }

    fn fetch(&self, id: u32) -> Option<PaymentEntity> {
        PAYMENT.with(|payments| payments.borrow().get(&id))
    }

    fn fetch_all_by_temple_id(&self, temple_id: u32) -> Vec<PaymentEntity> {
        PAYMENT.with(|payments| {
            payments.borrow().values().filter(|event| event.temple_id == temple_id).collect()
        })
    }

    fn fetch_all(&self) -> Vec<PaymentEntity> {
        PAYMENT.with(|payments| payments.borrow().values().collect())
    }

    fn delete(&self, id: u32) {
        PAYMENT.with(|payments| payments.borrow_mut().remove(&id));
    }
}
