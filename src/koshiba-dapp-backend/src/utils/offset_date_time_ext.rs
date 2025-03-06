use ic_cdk::api::time;
use time::OffsetDateTime;

pub trait OffsetDateTimeExt {
    fn ic_now() -> Self;
}

impl OffsetDateTimeExt for OffsetDateTime {
    fn ic_now() -> Self {
        let nanos = time() as i128;
        let seconds = nanos / 1_000_000_000;
        OffsetDateTime::from_unix_timestamp(seconds as i64).unwrap_or(OffsetDateTime::UNIX_EPOCH)
    }
}
