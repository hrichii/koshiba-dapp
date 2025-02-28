use candid::Principal;
use ic_cdk::caller;

#[ic_cdk::query]
async fn whoami() -> Principal {
    caller()
}

ic_cdk_macros::export_candid!();