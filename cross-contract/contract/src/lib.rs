use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, log, near_bindgen, AccountId, Gas, Promise, PromiseError, PanicOnDefault};

pub mod external;
pub use crate::external::*;

/**
 * Contract struct
 */
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
  // hello contract address
  pub hello_account: AccountId
}

#[near_bindgen]
impl Contract {
  /**
   * init function
   */
  #[init]
  #[private] 
  pub fn init(hello_account: AccountId) -> Self {
    assert!(!env::state_exists(), "Already initialized");
    Self {
      hello_account,
    }
  }

  /**
   * query greeting function
   */
  pub fn query_greeting(&self) -> Promise {
    // Create a promise to call HelloNEAR.get_greeting()
    let promise = hello_near::ext(self.hello_account.clone())
      .with_static_gas(Gas(5*TGAS))
      .get_greeting();
    
    // Create a promise to callback query_greeting_callback
    return promise.then( 
      Self::ext(env::current_account_id())
      .with_static_gas(Gas(5*TGAS))
      .query_greeting_callback()
    )
  }

  /**
   * callback function
   */
  #[private]
  pub fn query_greeting_callback(&self, #[callback_result] call_result: Result<String, PromiseError>) -> String {
    // Check if the promise succeeded by calling the method outlined in external.rs
    if call_result.is_err() {
      log!("There was an error contacting Hello NEAR");
      return "".to_string();
    }

    // Return the greeting
    let greeting: String = call_result.unwrap();
    greeting
  }

  /**
   * change greeting function
   */
  pub fn change_greeting(&mut self, new_greeting: String) -> Promise {
    // Create a promise to call HelloNEAR.set_greeting(message:string)
    hello_near::ext(self.hello_account.clone())
      .with_static_gas(Gas(5*TGAS))
      .set_greeting(new_greeting)
    .then( // Create a callback change_greeting_callback
        Self::ext(env::current_account_id())
        .with_static_gas(Gas(5*TGAS))
        .change_greeting_callback()
      )
  }

  /**
   * callback function
   */
  #[private]
  pub fn change_greeting_callback(&mut self, #[callback_result] call_result: Result<(), PromiseError>) -> bool {
    // Return whether or not the promise succeeded using the method outlined in external.rs
    if call_result.is_err() {
      env::log_str("set_greeting failed...");
      return false;
    } else {
      env::log_str("set_greeting was successful!");
      return true;
    }
  }
}


#[cfg(test)]
mod tests {
    use super::*;

    const HELLO_NEAR: &str = "beneficiary";

    #[test]
    fn initializes() {
        let beneficiary: AccountId = HELLO_NEAR.parse().unwrap();
        let contract = Contract::init(beneficiary);
        assert_eq!(contract.hello_account, HELLO_NEAR.parse().unwrap())
    }
}