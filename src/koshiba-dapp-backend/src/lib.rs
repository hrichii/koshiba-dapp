mod models;
use crate::models::{
    event::Event, grade::Grade, temple::Temple, user::User, vote::Vote, vote_status::VoteStatus,
};
mod services;
use crate::services::user_service::UserService;
mod repositories;
use crate::repositories::user_repository::StableUserRepository;
use ic_cdk::query;
use ic_cdk::update;

#[query]
fn get_user() -> Option<User> {
    let service = UserService::new(Box::new(StableUserRepository));
    service.fetch(1)
}

#[update]
fn create_user(last_name: String, first_name: String, grade: Grade, temple_id: u32) -> User {
    let service = UserService::new(Box::new(StableUserRepository));

    // 新規ユーザーの保存
    let new_user = User {
        id: 1,
        last_name: "山田".to_string(),
        first_name: "太郎".to_string(),
        grade: Grade::A,
        vote_count: 10,
        temple: Temple { id: 1, name: "浅草寺".to_string() },
        payment: 1_000_000,
    };

    service.save(new_user)
}

#[update]
fn delete_user() {
    // ここでユーザーを削除する処理を実装
    // 現在、特に返すものはない
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
    vec![
        Temple { id: 1, name: "浅草寺".to_string() },
        Temple { id: 2, name: "京都寺院".to_string() },
        Temple { id: 3, name: "奈良寺院".to_string() },
    ]
}

ic_cdk_macros::export_candid!();
