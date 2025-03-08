use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;

use crate::entities::user_entity::UserEntity;
use crate::entities::vote_entity::VoteEntity;

use crate::models::vote_status::VoteStatus;

type Memory = VirtualMemory<DefaultMemoryImpl>;

pub trait VoteRepository {
    fn save(&self, event_id: u32, user_entity: UserEntity, vote_status: VoteStatus) -> VoteEntity;
    fn fetch_all(&self) -> Vec<VoteEntity>;
    fn delete(&self, event_id: u32, user_id: String);
    fn delete_by_user_id(&self, user_id: String);
    fn delete_by_event_id(&self, event_id: u32);
}

pub struct StableVoteRepository;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static VOTE: RefCell<StableBTreeMap<u32, VoteEntity, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(3))),
        )
    );
    static NEXT_ID: RefCell<u32> = RefCell::new(0);
}

impl VoteRepository for StableVoteRepository {
    fn save(&self, event_id: u32, user_entity: UserEntity, vote_status: VoteStatus) -> VoteEntity {
        VOTE.with(|votes| {
            NEXT_ID.with(|next_id| {
                let mut votes = votes.borrow_mut();
                let mut next_id = next_id.borrow_mut();

                if let Some(existing_vote) = votes
                    .values()
                    .find(|vote| vote.event_id == event_id && vote.user_id == user_entity.id)
                {
                    let updated_vote = VoteEntity {
                        id: existing_vote.id,
                        event_id,
                        user_id: user_entity.id,
                        vote_status,
                        grade: user_entity.grade,
                    };
                    votes.insert(existing_vote.id, updated_vote.clone());
                    return updated_vote;
                }

                let vote_id = *next_id;
                *next_id += 1;
                let new_vote = VoteEntity {
                    id: vote_id,
                    event_id,
                    user_id: user_entity.id,
                    vote_status,
                    grade: user_entity.grade,
                };
                votes.insert(vote_id, new_vote.clone());
                new_vote
            })
        })
    }

    fn fetch_all(&self) -> Vec<VoteEntity> {
        VOTE.with(|votes| votes.borrow().values().collect())
    }

    fn delete(&self, event_id: u32, user_id: String) {
        VOTE.with(|votes| {
            let mut votes = votes.borrow_mut();
            if let Some((id, _)) =
                votes.iter().find(|(_, vote)| vote.event_id == event_id && vote.user_id == user_id)
            {
                votes.remove(&id);
            }
        });
    }

    fn delete_by_user_id(&self, user_id: String) {
        VOTE.with(|votes| {
            let mut votes = votes.borrow_mut();
            let keys_to_remove: Vec<u32> = votes
                .iter()
                .filter(|(_, vote)| vote.user_id == user_id)
                .map(|(id, _)| id)
                .collect();
            for id in keys_to_remove {
                votes.remove(&id);
            }
        });
    }
    fn delete_by_event_id(&self, event_id: u32) {
        VOTE.with(|votes| {
            let mut votes = votes.borrow_mut();
            let keys_to_remove: Vec<u32> = votes
                .iter()
                .filter(|(_, vote)| vote.event_id == event_id)
                .map(|(id, _)| id)
                .collect();
            for id in keys_to_remove {
                votes.remove(&id);
            }
        });
    }
}
