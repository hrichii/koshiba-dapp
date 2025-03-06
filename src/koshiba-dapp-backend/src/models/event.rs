use crate::{entities::event_entity::EventEntity, Vote, VoteStatus};
use time::OffsetDateTime;

pub struct Event {
    pub event_id: u32,
    pub title: String,
    pub content: String,
    pub vote: Vote,
    pub your_vote: VoteStatus,
    pub deadline_at: OffsetDateTime,
    pub created_at: OffsetDateTime,
}

impl Event {
    pub fn from_entity(event_entity: EventEntity) -> Self {
        Event {
            event_id: event_entity.id,
            title: event_entity.title,
            content: event_entity.content,
            // TODO vote
            vote: Vote { agree: 55, disagree: 23, total: 600 },
            // TODO YourVote
            your_vote: VoteStatus::Agree,
            deadline_at: OffsetDateTime::from_unix_timestamp_nanos(
                event_entity.deadline_at_millisec as i128 * 1_000_000,
            )
            .unwrap(),
            created_at: OffsetDateTime::from_unix_timestamp_nanos(
                event_entity.created_at_millisec as i128 * 1_000_000,
            )
            .unwrap(),
        }
    }
}
