use crate::{models::event::Event, Vote, VoteStatus};
use candid::{CandidType, Deserialize};
use serde::Serialize;
use time::format_description::well_known::Rfc3339;

#[derive(Serialize, Deserialize, CandidType)]
pub struct EventDto {
    pub event_id: u32,
    pub title: String,
    pub content: String,
    pub vote: Vote,
    pub your_vote: VoteStatus,
    pub deadline_at: String,
    pub created_at: String,
}

impl EventDto {
    pub fn from_event(event: Event) -> Self {
        EventDto {
            event_id: event.event_id,
            title: event.title,
            content: event.content,
            vote: event.vote,
            your_vote: event.your_vote,
            deadline_at: event.deadline_at.format(&Rfc3339).unwrap(),
            created_at: event.created_at.format(&Rfc3339).unwrap(),
        }
    }
}
