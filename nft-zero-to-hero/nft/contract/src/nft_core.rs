use crate::*;
use near_sdk::{ext_contract, Gas, log, PromiseResult};

/**
 * NonFungibleTokenCore trait
 */
pub trait NonFungibleTokenCore {
      
      fn nft_transfer(
          &mut self,
          receiver_id: AccountId,
          token_id: TokenId,
          memo: Option<String>,
      );
  
      fn nft_transfer_call(
          &mut self,
          receiver_id: AccountId,
          token_id: TokenId,
          memo: Option<String>,
          msg: String,
      ) -> PromiseOrValue<bool>;
  
      fn nft_token(&self, token_id: TokenId) -> Option<JsonToken>;
}

/**
 * NonFungibleTokenReceiver trait
 */
#[ext_contract(ext_non_fungible_token_receiver)]
trait NonFungibleTokenReceiver {
      
      fn nft_on_transfer(
          &mut self,
          sender_id: AccountId,
          previous_owner_id: AccountId,
          token_id: TokenId,
          msg: String,
      ) -> Promise;
}

/**
 * NonFungibleTokenResolver trait
 */
#[ext_contract(ext_self)] 
trait NonFungibleTokenResolver {
      
      fn nft_resolve_transfer(
          &mut self,
          owner_id: AccountId,
          receiver_id: AccountId,
          token_id: TokenId,
      ) -> bool;
  
}

#[near_bindgen]
impl NonFungibleTokenCore for Contract {

      /**
       * nft_token function
       */
      fn nft_token(&self, token_id: TokenId) -> Option<JsonToken> {
            // check token id
            if let Some(token) = self.tokens_by_id.get(&token_id) {
            // get metadata
            let metadata = self.token_metadata_by_id.get(&token_id).unwrap();
            // return 
            Some(JsonToken {
                  token_id,
                  owner_id: token.owner_id,
                  metadata,
            })
            } else { 
            None
            }
      }

      fn nft_transfer(
            &mut self,
            receiver_id: AccountId,
            token_id: TokenId,
            memo: Option<String>,
      ) {}

      fn nft_transfer_call(
            &mut self,
            receiver_id: AccountId,
            token_id: TokenId,
            memo: Option<String>,
            msg: String,
        ) -> PromiseOrValue<bool> {
              None
        }
}