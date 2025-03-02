use ic_cdk::query;
use ic_cdk::update;
use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(Serialize, Deserialize, CandidType)]
struct User {
    id: u32,
    last_name: String,
    first_name: String,
    grade: Grade,
    temple: Temple,
    vote_count: u32,
    payment: u64,
}

#[derive(Serialize, Deserialize, CandidType)]
struct Temple {
    id: u32,
    name: String,
}

#[derive(Serialize, Deserialize, CandidType)]
struct Event {
    event_id: u32,
    title: String,
    content: String,
    vote: Vote,
    your_vote: VoteStatus,
    deadline_at: String,
    created_at: String,
}

#[derive(Serialize, Deserialize, CandidType)]
struct Vote {
    agree: u32,
    disagree: u32,
    total: u32,
}

#[derive(Serialize, Deserialize, CandidType)]
pub enum VoteStatus {
    NotVoted,
    Agree,
    Disagree,
}

#[derive(Serialize, Deserialize, CandidType)]
pub enum Grade {
    S,
    A,
    B,
    C,
    D,
}

impl Grade {
    pub fn payment(&self) -> u64 {
        match self {
            Grade::S => 5_000_000,
            Grade::A => 3_000_000,
            Grade::B => 1_000_000,
            Grade::C => 500_000,
            Grade::D => 300_000,
        }
    }

    pub fn vote_count(&self) -> u32 {
        match self {
            Grade::S => 25,
            Grade::A => 15,
            Grade::B => 10,
            Grade::C => 5,
            Grade::D => 3,
        }
    }
}

#[query]
fn get_user() -> User {
    User {
        id: 1,
        last_name: "山田".to_string(),
        first_name: "太郎".to_string(),
        grade: Grade::A,
        temple: Temple {
            id: 1,
            name: "浅草寺".to_string(),
        },
        vote_count: Grade::A.vote_count(),
        payment: Grade::A.payment(),
    }
}

#[update]
fn create_user(last_name: String, first_name: String, grade: Grade, temple_id: u32) -> User {
    User {
        id: 1,
        last_name: last_name,
        first_name: first_name,
        grade: Grade::A,
        temple: Temple {
            id: temple_id,
            name: "寺名".to_string(),
        },
        vote_count: Grade::A.vote_count(),
        payment: Grade::A.payment(),
    }
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
            vote: Vote {
                agree: 55,
                disagree: 23,
                total: 600,
            },
            your_vote: VoteStatus::Agree,
            deadline_at: "2025-03-27T23:59:59.999Z".to_string(),
            created_at: "2025-02-27T23:59:59.999Z".to_string(),
        },
        Event {
            event_id: 2,
            title: "ひな祭りイベントの開催".to_string(),
            content: "hogehoge...".to_string(),
            vote: Vote {
                agree: 55,
                disagree: 23,
                total: 600,
            },
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
        vote: Vote {
            agree: 65,
            disagree: 23,
            total: 600,
        },
        your_vote,
        deadline_at: "2025-03-27T23:59:59.999Z".to_string(),
        created_at: "2025-02-27T23:59:59.999Z".to_string(),
    }
}

#[query]
fn get_temples() -> Vec<Temple> {
    vec![
        Temple {
            id: 1,
            name: "浅草寺".to_string(),
        },
        Temple {
            id: 2,
            name: "京都寺院".to_string(),
        },
        Temple {
            id: 3,
            name: "奈良寺院".to_string(),
        },
    ]
}

ic_cdk_macros::export_candid!();
