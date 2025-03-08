use crate::{
    entities::{event_entity::EventEntity, temple_entity::TempleEntity},
    VoteStatistics,
};
use time::OffsetDateTime;

use super::vote_status_with_not_voted::VoteStatusWithNotVoted;

pub struct Event {
    pub event_id: u32,
    pub title: String,
    pub content: String,
    pub temple_id: Option<u32>,
    pub temple_name: Option<String>,
    pub vote: VoteStatistics,
    pub your_vote: VoteStatusWithNotVoted,
    pub deadline_at: OffsetDateTime,
    pub created_at: OffsetDateTime,
}

impl Event {
    pub fn from_entity(
        event_entity: EventEntity,
        temple_entity: Option<TempleEntity>,
        vote: VoteStatistics,
        your_vote: VoteStatusWithNotVoted,
    ) -> Self {
        Event {
            event_id: event_entity.id,
            title: event_entity.title,
            content: event_entity.content,
            temple_id: temple_entity.clone().map(|entity| entity.id),
            temple_name: temple_entity.clone().map(|entity| entity.name),
            vote: vote,
            your_vote: your_vote,
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
