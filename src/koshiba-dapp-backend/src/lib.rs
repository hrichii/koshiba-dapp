mod dtos;
mod entities;
mod models;
mod repositories;
mod services;
mod utils;

use crate::dtos::user_dto::UserDto;
use crate::models::{
    grade::Grade, temple::Temple, user::User, vote::VoteStatistics, vote_status::VoteStatus,
};
use crate::repositories::user_repository::StableUserRepository;
use crate::services::user_service::UserService;

use candid::Principal;
use dtos::event_dto::EventDto;
use entities::vote_entity::VoteEntity;
use ic_cdk::{caller, query, update};
use repositories::event_repository::StableEventRepository;
use repositories::temple_repository::StableTempleRepository;
use repositories::vote_repository::StableVoteRepository;
use services::event_service::EventService;
use services::temple_service::TempleService;
use services::vote_service::VoteService;
use time::{format_description::well_known::Rfc3339, OffsetDateTime};
use utils::offset_date_time_ext::OffsetDateTimeExt;

// サービスのインスタンスを生成
fn user_service() -> UserService {
    UserService::new(
        Box::new(StableUserRepository),
        Box::new(StableTempleRepository),
        Box::new(StableVoteRepository),
    )
}

fn event_service() -> EventService {
    EventService::new(
        Box::new(StableEventRepository),
        Box::new(StableVoteRepository),
        Box::new(StableUserRepository),
        Box::new(StableTempleRepository),
    )
}

fn temple_service() -> TempleService {
    TempleService::new(Box::new(StableTempleRepository))
}

fn vote_service() -> VoteService {
    VoteService::new(
        Box::new(StableVoteRepository),
        Box::new(StableEventRepository),
        Box::new(StableUserRepository),
    )
}

fn user_id() -> String {
    let principal: Principal = caller();
    if principal == Principal::anonymous() {
        String::new()
    } else {
        principal.to_text()
    }
}

// TODO 後続タスクで削除予定
#[query(name = "get_user")]
fn get_me_tmp() -> Option<UserDto> {
    get_me()
}

#[query(name = "getMe")]
fn get_me() -> Option<UserDto> {
    let user_id = user_id();
    let nullable_user: Option<User> = user_service().fetch(user_id);
    if let Some(user) = nullable_user {
        Some(UserDto::from_user(user))
    } else {
        None
    }
}

// TODO 後続タスクで削除予定
#[update(name = "create_user")]
fn update_me_tmp(
    last_name: String,
    first_name: String,
    grade: Grade,
    temple_id: u32,
) -> Option<UserDto> {
    update_me(last_name, first_name, grade, temple_id)
}

#[update(name = "updateMe")]
fn update_me(
    last_name: String,
    first_name: String,
    grade: Grade,
    temple_id: u32,
) -> Option<UserDto> {
    let user_id = user_id();
    let user: User = user_service().save(user_id, last_name, first_name, grade, temple_id);
    Some(UserDto::from_user(user))
}

// TODO 後続タスクで削除予定
#[update(name = "delete_user")]
fn delete_me_tmp() {
    delete_me()
}

#[update(name = "deleteMe")]
fn delete_me() {
    let user_id = user_id();
    user_service().delete(user_id);
}

// TODO 後続タスクで削除予定
#[query(name = "get_user_events")]
fn get_my_event_list_tmp() -> Vec<EventDto> {
    get_my_event_list()
}

#[query(name = "getMyEventList")]
fn get_my_event_list() -> Vec<EventDto> {
    let user_id = user_id();
    event_service().fetch_all_by_user_id(user_id).into_iter().map(EventDto::from_event).collect()
}

// TODO 後続タスクで削除予定
#[query(name = "get_user_event")]
fn get_my_event_tmp(id: u32) -> Option<EventDto> {
    get_my_event(id)
}

#[query(name = "getMyEvent")]
fn get_my_event(id: u32) -> Option<EventDto> {
    let user_id = user_id();
    let event = event_service().fetch(id, user_id)?;
    Some(EventDto::from_event(event))
}
// TODO 後続タスクで削除予定
#[query(name = "update_vote")]
fn update_my_vote_tmp(event_id: u32, your_vote: VoteStatus) -> Option<EventDto> {
    update_my_vote(event_id, your_vote)
}

#[update(name = "updateMyVote")]
fn update_my_vote(event_id: u32, your_vote: VoteStatus) -> Option<EventDto> {
    let user_id = user_id();
    vote_service().save(event_id, user_id, your_vote);
    get_my_event(event_id)
}

// TODO 後続タスクで削除予定
#[query(name = "get_temples")]
fn get_temple_list_tmp() -> Vec<Temple> {
    get_temple_list()
}

#[query(name = "getTempleList")]
fn get_temple_list() -> Vec<Temple> {
    temple_service().fetch_all()
}

// [デバッグ]iiの結果を取得
#[query(name = "verifyPrincipalDebug")]
fn verify_principal() -> String {
    return caller().to_text();
}

// [デバッグ]イベントの取得作成削除
#[query(name = "getEventListDebug")]
fn get_event_list() -> Vec<EventDto> {
    event_service().fetch_all().into_iter().map(EventDto::from_event).collect()
}

#[update(name = "updateEventDebug")]
fn update_event(
    id: u32,
    temple_id: u32,
    title: String,
    content: String,
    deadline_at: String,
) -> EventDto {
    let user_id = user_id();
    let parsed_deadline =
        OffsetDateTime::parse(&deadline_at, &Rfc3339).unwrap_or_else(|_| OffsetDateTime::ic_now());
    let event = event_service().save(id, temple_id, user_id, title, content, parsed_deadline);
    EventDto::from_event(event)
}

#[update(name = "deleteEventDebug")]
fn delete_event(id: u32) {
    event_service().delete(id)
}

// [デバッグ]ユーザの取得更新削除
#[query(name = "getUserListDebug")]
fn get_user_list() -> Vec<UserDto> {
    user_service().fetch_all().into_iter().map(UserDto::from_user).collect()
}

#[update(name = "updateUserDebug")]
fn update_user(
    user_id: String,
    last_name: String,
    first_name: String,
    grade: Grade,
    temple_id: u32,
) -> Option<UserDto> {
    let user: User = user_service().save(user_id, last_name, first_name, grade, temple_id);
    Some(UserDto::from_user(user))
}

#[update(name = "deleteUserDebug")]
fn delete_user_debug(user_id: String) {
    user_service().delete(user_id);
}

// [デバッグ]票の取得更新削除
#[query(name = "getAllVoteDebug")]
fn get_vote_list_debug() -> Vec<VoteEntity> {
    vote_service().fetch_all()
}

#[update(name = "updateVoteDebug")]
fn update_vote_debug(event_id: u32, user_id: String, vote_status: VoteStatus) -> Option<EventDto> {
    vote_service().save(event_id, user_id, vote_status);
    get_my_event(event_id)
}

#[update(name = "deleteVoteDebug")]
fn delete_vote_debug(event_id: u32, user_id: String) -> Option<EventDto> {
    vote_service().delete(event_id, user_id);
    get_my_event(event_id)
}

// [デバッグ]寺の取得更新削除
#[query(name = "getAllTempleDebug")]
fn get_temple_list_debug() -> Vec<Temple> {
    get_temple_list()
}

#[update(name = "updateTempleDebug")]
fn update_temple_debug(id: u32, name: String) -> Temple {
    temple_service().save(id, name)
}

#[update(name = "deleteTempleDebug")]
fn delete_temple_debug(id: u32) {
    temple_service().delete(id)
}

ic_cdk_macros::export_candid!();
