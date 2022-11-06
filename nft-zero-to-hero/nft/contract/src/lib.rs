
/**
 * Contract struct
 */
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    //contract owner
    pub owner_id: AccountId,
    //keeps track of all the token IDs for a given account
    pub tokens_per_owner: LookupMap<AccountId, UnorderedSet<TokenId>>,
    //keeps track of the token struct for a given token ID
    pub tokens_by_id: LookupMap<TokenId, Token>,
    //keeps track of the token metadata for a given token ID
    pub token_metadata_by_id: UnorderedMap<TokenId, TokenMetadata>,
    //keeps track of the metadata for the contract
    pub metadata: LazyOption<NFTContractMetadata>,
}

/**
 * Contract
 */
impl Contract {
    
    /**
     * new_default_meta
     */
    #[init]
    pub fn new_default_meta(owner_id: AccountId) -> Self {
        /*
            FILL THIS IN
        */
        todo!(); //remove once code is filled in.
    }

    /**
     * new
     */
    #[init]
    pub fn new(owner_id: AccountId, metadata: NFTContractMetadata) -> Self {
        /*
            FILL THIS IN
        */
        todo!(); //remove once code is filled in.
    }
}