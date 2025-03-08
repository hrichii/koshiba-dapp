use crate::{
    models::{event::Event, vote_status_with_not_voted::VoteStatusWithNotVoted},
    VoteStatistics,
};
use candid::{CandidType, Deserialize};
use serde::Serialize;
use time::format_description::well_known::Rfc3339;

#[derive(Serialize, Deserialize, CandidType)]
pub struct EventDto {
    pub event_id: u32,
    pub title: String,
    pub content: String,
    pub temple_id: Option<u32>,
    pub temple_name: Option<String>,
    pub vote: VoteStatistics,
    pub your_vote: VoteStatusWithNotVoted,
    pub deadline_at: String,
    pub created_at: String,
}

impl EventDto {
    pub fn from_event(event: Event) -> Self {
        EventDto {
            event_id: event.event_id,
            title: event.title,
            content: event.content,
            temple_id: event.temple_id,
            temple_name: event.temple_name,
            vote: event.vote,
            your_vote: event.your_vote,
            deadline_at: event.deadline_at.format(&Rfc3339).unwrap(),
            created_at: event.created_at.format(&Rfc3339).unwrap(),
        }
    }
}
