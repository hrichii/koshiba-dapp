use crate::{
    entities::{event_entity::EventEntity, user_entity::UserEntity, vote_entity::VoteEntity},
    models::{
        event::Event, vote::VoteStatistics, vote_status::VoteStatus,
        vote_status_with_not_voted::VoteStatusWithNotVoted,
    },
    repositories::{
        event_repository::EventRepository, temple_repository::TempleRepository,
        user_repository::UserRepository, vote_repository::VoteRepository,
    },
};
use time::OffsetDateTime;

pub struct EventService {
    event_repository: Box<dyn EventRepository>,
    vote_repository: Box<dyn VoteRepository>,
    user_repository: Box<dyn UserRepository>,
    temple_repository: Box<dyn TempleRepository>,
}

impl EventService {
    pub fn new(
        event_repository: Box<dyn EventRepository>,
        vote_repository: Box<dyn VoteRepository>,
        user_repository: Box<dyn UserRepository>,
        temple_repository: Box<dyn TempleRepository>,
    ) -> Self {
        EventService { event_repository, vote_repository, user_repository, temple_repository }
    }

    /// 指定されたイベント ID に対する情報を取得する。
    /// ユーザー ID を利用して投票情報を結びつける。
    pub fn fetch(&self, event_id: u32, user_id: String) -> Option<Event> {
        let event_entity = self.event_repository.fetch(event_id)?;
        // 全ての投票情報・ユーザー情報を取得
        let vote_entity_all_list = self.vote_repository.fetch_all();
        let user_entity_all_list = self.user_repository.fetch_all();

        // イベントに関連する投票情報・ユーザー情報を元に Event を生成
        Some(self.fetch_from_entites(
            user_id,
            event_entity,
            vote_entity_all_list,
            user_entity_all_list,
        ))
    }

    /// `fetch` などで利用される内部メソッド。
    /// 投票情報を計算した`Event`を生成する。
    fn fetch_from_entites(
        &self,
        user_id: String,
        event_entity: EventEntity,
        vote_entity_all_list: Vec<VoteEntity>,
        user_entity_all_list: Vec<UserEntity>,
    ) -> Event {
        // 指定されたイベントに対する投票の集計
        let (agree_count, disagree_count) = vote_entity_all_list
            .iter()
            .filter(|vote_entity| vote_entity.event_id == event_entity.id)
            .fold((0, 0), |(agree, disagree), vote_entity| match vote_entity.vote_status {
                VoteStatus::Agree => (agree + vote_entity.grade.vote_count(), disagree),
                VoteStatus::Disagree => (agree, disagree + vote_entity.grade.vote_count()),
            });

        // 寺院に所属するユーザーの総投票数
        let total_count = user_entity_all_list
            .iter()
            .filter(|user_entity| user_entity.temple_id == event_entity.temple_id)
            .fold(0, |count, user_entity| user_entity.grade.vote_count() + count);

        // ユーザー自身の投票ステータスを取得 (未投票なら `NotVoted` に変換)
        let your_vote: VoteStatusWithNotVoted = vote_entity_all_list
            .iter()
            .find(|vote_entity| {
                vote_entity.user_id == user_id && vote_entity.event_id == event_entity.id
            })
            .map_or(VoteStatusWithNotVoted::NotVoted, |entity| {
                VoteStatusWithNotVoted::from_vote_status(entity.vote_status.clone())
            });

        let vote_statistics =
            VoteStatistics { agree: agree_count, disagree: disagree_count, total: total_count };

        // お寺の情報を取得
        let temple_entity = self.temple_repository.fetch(event_entity.temple_id);

        // `EventEntity` から `Event` を生成
        Event::from_entity(event_entity, temple_entity, vote_statistics, your_vote)
    }

    /// ユーザー ID に紐づくイベント一覧を取得する。
    /// ユーザーが所属する寺院のイベントを対象とする。
    pub fn fetch_all_by_user_id(&self, user_id: String) -> Vec<Event> {
        let nullable_user_entity = self.user_repository.fetch(user_id.clone());
        let my_temple_id = nullable_user_entity.unwrap().temple_id;
        let vote_entity_all_list = self.vote_repository.fetch_all();
        let user_entity_all_list = self.user_repository.fetch_all();

        // ユーザーが所属する寺院のイベントを取得し、`fetch_from_entites` を使って詳細情報を補完
        self.event_repository
            .fetch_all_by_temple_id(my_temple_id)
            .into_iter()
            .map(|event_entity| {
                self.fetch_from_entites(
                    user_id.clone(),
                    event_entity,
                    vote_entity_all_list.clone(),
                    user_entity_all_list.clone(),
                )
            })
            .collect()
    }

    /// 全てのイベントを取得する。
    /// ただし、`fetch_from_entites` に渡す `user_id` は空文字列となる。
    pub fn fetch_all(&self) -> Vec<Event> {
        let vote_entity_all_list = self.vote_repository.fetch_all();
        let user_entity_all_list = self.user_repository.fetch_all();

        // `fetch_from_entites` では `user_id` を "" にしているため、個別の投票情報は取得しない
        Box::new(self.event_repository.fetch_all())
            .into_iter()
            .map(|event_entity| {
                self.fetch_from_entites(
                    "".to_string(),
                    event_entity,
                    vote_entity_all_list.clone(),
                    user_entity_all_list.clone(),
                )
            })
            .collect()
    }

    /// イベントを保存する。
    /// 保存後に `fetch` を使って最新の情報を取得し直す。
    pub fn save(
        &self,
        id: u32,
        temple_id: u32,
        user_id: String,
        title: String,
        content: String,
        deadline_at: OffsetDateTime,
    ) -> Event {
        self.event_repository.save(id, temple_id, title, content, deadline_at);

        // `fetch` を使って保存後の最新情報を取得して返す
        self.fetch(id, user_id).unwrap()
    }

    /// 指定された ID のイベントを削除する。
    pub fn delete(&self, id: u32) {
        self.event_repository.delete(id);
    }
}
