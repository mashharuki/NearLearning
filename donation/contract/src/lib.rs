use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, AccountId};
use near_sdk::collections::{UnorderedMap};

mod donation;

/**
 * Contract struct
 */
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
  // account
  pub beneficiary: AccountId,
  // amount
  pub donations: UnorderedMap<AccountId, u128>,
}

impl Default for Contract {
  /**
   * init
   */
  fn default() -> Self {
    Self{
      beneficiary: "v1.faucet.nonofficial.testnet".parse().unwrap(),
      donations: UnorderedMap::new(b"d"),
    }
  }
}

#[near_bindgen]
impl Contract {
  /**
   * init function
   */
  #[init]
  #[private] 
  pub fn init(beneficiary: AccountId) -> Self {
    Self {
      beneficiary,
      donations: UnorderedMap::new(b"d"),
    }
  }

  /**
   * get beneficiary 
   */
  pub fn get_beneficiary(&self) -> AccountId {
    self.beneficiary.clone()
  }

  /**
   * change beneficiary
   */
  #[private]
  pub fn change_beneficiary(&mut self, beneficiary: AccountId) {
    self.beneficiary = beneficiary;
  }
}


#[cfg(test)]
mod tests {
  use super::*;
  use near_sdk::testing_env;
  use near_sdk::test_utils::VMContextBuilder;
  use near_sdk::Balance;

  const BENEFICIARY: &str = "beneficiary";
  const NEAR: u128 = 1000000000000000000000000;

  #[test]
  fn initializes() {
      // init
      let contract = Contract::init(BENEFICIARY.parse().unwrap());
      // check
      assert_eq!(contract.beneficiary, BENEFICIARY.parse().unwrap())
  }

  #[test]
  fn donate() {
      // init
      let mut contract = Contract::init(BENEFICIARY.parse().unwrap());

      // Make a donation
      set_context("donor_a", 1*NEAR);
      contract.donate();
      let first_donation = contract.get_donation_for_account("donor_a".parse().unwrap());

      // Check the donation was recorded correctly
      assert_eq!(first_donation.total_amount.0, 1*NEAR);

      // Make another donation
      set_context("donor_b", 2*NEAR);
      contract.donate();
      let second_donation = contract.get_donation_for_account("donor_b".parse().unwrap());

      // Check the donation was recorded correctly
      assert_eq!(second_donation.total_amount.0, 2*NEAR);

      // User A makes another donation on top of their original
      set_context("donor_a", 1*NEAR);
      contract.donate();
      let first_donation = contract.get_donation_for_account("donor_a".parse().unwrap());

      // Check the donation was recorded correctly
      assert_eq!(first_donation.total_amount.0, 1*NEAR * 2);

      assert_eq!(contract.number_of_donors(), 2);
  }

  // Auxiliar fn: create a mock context
  fn set_context(predecessor: &str, amount: Balance) {
    let mut builder = VMContextBuilder::new();
    builder.predecessor_account_id(predecessor.parse().unwrap());
    builder.attached_deposit(amount);

    testing_env!(builder.build());
  }
}
