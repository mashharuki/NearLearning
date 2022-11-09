use crate::*;

/**
 * Contract
 */
#[near_bindgen]
impl Contract {

      /**
       * nft_mint
       */
      #[payable]
      pub fn nft_mint(
          &mut self,
          token_id: Option<TokenId>,
          metadata: TokenMetadata,
          receiver_id: Option<AccountId>,
      ) {
            //measure the initial storage being used on the contract
            let initial_storage_usage = env::storage_usage();

            // create token
            let token = Token {
                  //set the owner ID equal to the receiver ID passed into the function
                  owner_id: receiver_id,
            };

            // check 
            assert!(
                  self.tokens_by_id.insert(&token_id, &token).is_none(),
                  "Token already exists"
            );

            //insert the token ID and metadata
            self.token_metadata_by_id.insert(&token_id, &metadata);

            //call the internal method for adding the token to the owner
            self.internal_add_token_to_owner(&token.owner_id, &token_id);

            //calculate the required storage which was the used - initial
            let required_storage_in_bytes = env::storage_usage() - initial_storage_usage;

            //refund any excess storage if the user attached too much. Panic if they didn't attach enough to cover the required.
            refund_deposit(required_storage_in_bytes);
      }
}