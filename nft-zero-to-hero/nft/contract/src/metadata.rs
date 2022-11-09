use crate::*;

pub type TokenId = String;

/**
 * NFTContractMetadata struct
 */ 
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct NFTContractMetadata {
      pub spec: String,              
      pub name: String,              
      pub symbol: String,            
      pub icon: Option<String>,      
      pub base_uri: Option<String>, 
      pub reference: Option<String>, 
      pub reference_hash: Option<Base64VecU8>, 
}

/**
 * TokenMetadata struct
 */ 
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct TokenMetadata {
      pub title: Option<String>, 
      pub description: Option<String>, 
      pub media: Option<String>, 
      pub media_hash: Option<Base64VecU8>, 
      pub copies: Option<u64>, 
      pub issued_at: Option<u64>, 
      pub expires_at: Option<u64>, 
      pub starts_at: Option<u64>, 
      pub updated_at: Option<u64>, 
      pub extra: Option<String>, 
      pub reference: Option<String>,
      pub reference_hash: Option<Base64VecU8>, 
}

/**
 * Token struct
 */ 
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Token {
      pub owner_id: AccountId,
}

/**
 * JsonToken Struct
 */
#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct JsonToken {
      pub token_id: TokenId,
      pub owner_id: AccountId,
      pub metadata: TokenMetadata,
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Payout {
      pub payout: HashMap<AccountId, U128>,
}

/**
 * NonFungibleTokenMetadata trait
 */ 
pub trait NonFungibleTokenMetadata {
    //view call for returning the contract metadata
    fn nft_metadata(&self) -> NFTContractMetadata;
}

/**
 * NonFungibleTokenMetadata impl
 */
#[near_bindgen]
impl NonFungibleTokenMetadata for Contract {
      /**
       * NonFungibleTokenMetadata
       */
      fn nft_metadata(&self) -> NFTContractMetadata {
            // return
            self.metadata.get().unwrap()
      }
}