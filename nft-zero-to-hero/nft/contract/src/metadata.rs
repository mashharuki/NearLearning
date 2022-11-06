#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct NFTContractMetadata {
    /*
        FILL THIS IN
    */
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct TokenMetadata {
    /*
        FILL THIS IN
    */
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Token {
    /*
        FILL THIS IN
    */
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct JsonToken {
    /*
        FILL THIS IN
    */
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
        /*
            FILL THIS IN
        */
        todo!(); //remove once code is filled in.
    }
}