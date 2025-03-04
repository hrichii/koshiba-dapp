mod entities;
mod models;
use crate::models::{
    event::Event, grade::Grade, temple::Temple, user::User, vote::Vote, vote_status::VoteStatus,
};
mod services;
use crate::services::user_service::UserService;
mod repositories;
use crate::repositories::user_repository::StableUserRepository;
mod dtos;
use crate::dtos::user_dto::UserDto;
use candid::Principal;
use ic_cdk::{caller, query};
use ic_cdk::{id, update};
use repositories::temple_repository::StableTempleRepository;
use services::temple_service::TempleService;

#[query]
fn get_user() -> Option<UserDto> {
    // TODO FrontがIIに対応したらコメントアウトを外す
    // let principal: Principal = caller();
    // if principal == Principal::anonymous() {
    //     return None;
    // }
    // let id = principal.to_text();
    let id = "1".to_string();
    let service: UserService = UserService::new(Box::new(StableUserRepository));
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
    let service: UserService = UserService::new(Box::new(StableUserRepository));

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
    let service: UserService = UserService::new(Box::new(StableUserRepository));

    service.delete(id);
}

#[query]
fn get_user_events() -> Vec<Event> {
    vec![
        Event {
            event_id: 1,
            title: "本殿の改修".to_string(),
            content: "hogehoge...".to_string(),
            vote: Vote { agree: 55, disagree: 23, total: 600 },
            your_vote: VoteStatus::Agree,
            deadline_at: "2025-03-27T23:59:59.999Z".to_string(),
            created_at: "2025-02-27T23:59:59.999Z".to_string(),
        },
        Event {
            event_id: 2,
            title: "ひな祭りイベントの開催".to_string(),
            content: "hogehoge...".to_string(),
            vote: Vote { agree: 55, disagree: 23, total: 600 },
            your_vote: VoteStatus::NotVoted,
            deadline_at: "2025-03-27T23:59:59.999Z".to_string(),
            created_at: "2025-02-28T23:59:59.999Z".to_string(),
        },
    ]
}

#[update]
fn update_vote(_event_id: u32, your_vote: VoteStatus) -> Event {
    Event {
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
