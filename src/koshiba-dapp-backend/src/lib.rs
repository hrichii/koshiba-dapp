use std::{borrow::Cow, cell::RefCell};
use candid::{CandidType, Decode, Deserialize, Encode, Principal};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable};

type Memory = VirtualMemory<DefaultMemoryImpl>;

#[derive(CandidType, Deserialize, Debug)]
struct User {
  name: String,
}

const MAX_VALUE_SIZE: u32 = 100;

impl Storable for User {
  fn to_bytes(&self) -> std::borrow::Cow<[u8]> {
      Cow::Owned(Encode!(self).unwrap())
  }

  fn from_bytes(bytes: std::borrow::Cow<[u8]>) -> Self {
      Decode!(bytes.as_ref(), Self).unwrap()
  }

  const BOUND: Bound = Bound::Bounded {
      max_size: MAX_VALUE_SIZE,
      is_fixed_size: false,
  };
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static MAP: RefCell<StableBTreeMap<Principal, User, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );
}

#[ic_cdk::query(name="getName")]
fn get_name() -> Option<String> {
  let principal = ic_cdk::caller();

  MAP.with(|map|{
    match map.borrow().get(&principal) {
        Some(user) => Some(user.name.clone()),
        None => None
    }
  })
}

#[ic_cdk::update(name="setName")]
fn set_name(name: String) -> () {
  let principal = ic_cdk::caller();
  MAP.with(|map|{
    let mut map = map.borrow_mut();
    match map.get(&principal) {
      Some(mut user) => {
        user.name = name;
        map.insert(principal, user); // 明示的にinsert()を呼ばないと反映されない
      },
      None => {
        map.insert(principal, User{name});
      }
    }
  })
}

ic_cdk_macros::export_candid!();