mod entities;
mod models;
use crate::models::{
    grade::Grade, temple::Temple, user::User, vote::Vote, vote_status::VoteStatus,
};
mod services;
use crate::services::user_service::UserService;
mod repositories;
use crate::repositories::user_repository::StableUserRepository;
mod dtos;
use crate::dtos::user_dto::UserDto;
use dtos::event_dto::EventDto;
mod utils;
use ic_cdk::query;
use ic_cdk::update;
use repositories::event_repository::StableEventRepository;
use repositories::temple_repository::StableTempleRepository;
use services::event_service::EventService;
use services::temple_service::TempleService;
use time::{format_description::well_known::Rfc3339, OffsetDateTime};
use utils::offset_date_time_ext::OffsetDateTimeExt;

#[query]
fn get_user() -> Option<UserDto> {
    // TODO FrontがIIに対応したらコメントアウトを外す
    // let principal: Principal = caller();
    // if principal == Principal::anonymous() {
    //     return None;
    // }
    // let id = principal.to_text();
    let id = "1".to_string();
    let service: UserService =
        UserService::new(Box::new(StableUserRepository), Box::new(StableTempleRepository));
    let nullable_user: Option<User> = service.fetch(id);
    if let Some(user) = nullable_user {
        Some(UserDto::from_user(user))
    } else {
        None
    }
}

#[update]
fn create_user(
    last_name: String,
    first_name: String,
    grade: Grade,
    temple_id: u32,
) -> Option<UserDto> {
    // TODO FrontがIIに対応したらコメントアウトを外す
    // let principal: Principal = caller();
    // if principal == Principal::anonymous() {
    //     return None;
    // }
    // let id = principal.to_text();
    let id = "1".to_string();
    let service: UserService =
        UserService::new(Box::new(StableUserRepository), Box::new(StableTempleRepository));

    let user: User = service.save(id, last_name, first_name, grade, temple_id);
    Some(UserDto::from_user(user))
}

#[update]
fn delete_user() {
    // let principal: Principal = caller();
    // if principal == Principal::anonymous() {
    //     return None;
    // }
    // let id = principal.to_text();
    let id = "1".to_string();
    let service: UserService =
        UserService::new(Box::new(StableUserRepository), Box::new(StableTempleRepository));

    service.delete(id);
}

#[query]
fn get_user_events() -> Vec<EventDto> {
    let service: EventService = EventService::new(Box::new(StableEventRepository));
    service.fetch_all().into_iter().map(EventDto::from_event).collect()
}

#[query]
fn get_user_event(id: u32) -> Option<EventDto> {
    let service: EventService = EventService::new(Box::new(StableEventRepository));
    let event = service.fetch(id)?;
    Some(EventDto::from_event(event))
}

#[update]
fn create_event(id: u32, title: String, content: String, deadline_at: String) -> EventDto {
    let service: EventService = EventService::new(Box::new(StableEventRepository));

    let parsed_deadline =
        OffsetDateTime::parse(&deadline_at, &Rfc3339).unwrap_or_else(|_| OffsetDateTime::ic_now());

    let event = service.save(id, title, content, parsed_deadline);

    EventDto::from_event(event)
}

#[update]
fn delete_event(id: u32) {
    let service: EventService = EventService::new(Box::new(StableEventRepository));
    service.delete(id)
}

#[update]
fn update_vote(_event_id: u32, your_vote: VoteStatus) -> EventDto {
    EventDto {
        event_id: 1,
        title: "本殿の改修".to_string(),
        content: "hogehoge...".to_string(),
        vote: Vote { agree: 65, disagree: 23, total: 600 },
        your_vote,
        deadline_at: "2025-03-27T23:59:59.999Z".to_string(),
        created_at: "2025-02-27T23:59:59.999Z".to_string(),
    }
}

#[query]
fn get_temples() -> Vec<Temple> {
    let service: TempleService = TempleService::new(Box::new(StableTempleRepository));
    service.fetch_all()
}

#[query]
fn get_temple(id: u32) -> Option<Temple> {
    let service: TempleService = TempleService::new(Box::new(StableTempleRepository));
    service.fetch(id)
}

#[update]
fn create_temple(id: u32, name: String) -> Temple {
    let service: TempleService = TempleService::new(Box::new(StableTempleRepository));
    service.save(id, name)
}

#[update]
fn delete_temple(id: u32) {
    let service: TempleService = TempleService::new(Box::new(StableTempleRepository));
    service.delete(id)
}

ic_cdk_macros::export_candid!();
