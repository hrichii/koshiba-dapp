use time::OffsetDateTime;

use crate::{
    models::{payment::Payment, payment_status::PaymentBalanceStatus, temple::Temple},
    repositories::{payment_repository::PaymentRepository, temple_repository::TempleRepository},
};

pub struct PaymentService {
    payment_repository: Box<dyn PaymentRepository>,
    temple_repository: Box<dyn TempleRepository>,
}

impl PaymentService {
    pub fn new(
        payment_repository: Box<dyn PaymentRepository>,
        temple_repository: Box<dyn TempleRepository>,
    ) -> Self {
        PaymentService { payment_repository, temple_repository }
    }

    pub fn fetch_all_by_temple_id(&self, temple_id: u32) -> Vec<Payment> {
        self.payment_repository
            .fetch_all_by_temple_id(temple_id)
            .into_iter()
            .map(|payment_entity| {
                let temple = self
                    .temple_repository
                    .fetch(payment_entity.temple_id)
                    .map(|temple_entity| Temple::from_entity(temple_entity));
                Payment::from_entity(payment_entity, temple)
            })
            .collect()
    }

    pub fn fetch_all(&self) -> Vec<Payment> {
        self.payment_repository
            .fetch_all()
            .into_iter()
            .map(|payment_entity| {
                let temple = self
                    .temple_repository
                    .fetch(payment_entity.temple_id)
                    .map(|temple_entity| Temple::from_entity(temple_entity));
                Payment::from_entity(payment_entity, temple)
            })
            .collect()
    }

    /// 支払い履歴を保存する。
    pub fn save(
        &self,
        id: u32,
        temple_id: u32,
        title: String,
        content: String,
        amount: u32,
        status: PaymentBalanceStatus,
        created_at: OffsetDateTime,
    ) -> Payment {
        let payment_entity =
            self.payment_repository.save(id, temple_id, title, content, amount, status, created_at);
        let temple = self
            .temple_repository
            .fetch(payment_entity.temple_id)
            .map(|temple_entity| Temple::from_entity(temple_entity));
        Payment::from_entity(payment_entity, temple)
    }

    /// 支払い履歴を削除する。
    pub fn delete(&self, id: u32) {
        self.payment_repository.delete(id);
    }
}
