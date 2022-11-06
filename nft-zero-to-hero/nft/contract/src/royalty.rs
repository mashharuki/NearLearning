pub trait NonFungibleTokenCore {
      /**
       * nft_payout
       */
      fn nft_payout(&self, token_id: TokenId, balance: U128, max_len_payout: u32) -> Payout;
      
      /**
       * transfers the token to the receiver ID and returns the payout object that should be payed given the passed in balance. 
       */
      fn nft_transfer_payout(
          &mut self,
          receiver_id: AccountId,
          token_id: TokenId,
          approval_id: u64,
          memo: Option<String>,
          balance: U128,
          max_len_payout: u32,
      ) -> Payout;
}