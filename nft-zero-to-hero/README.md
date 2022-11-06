# NFT zero-to-hero

### Overview

[https://docs.near.org/tutorials/nfts/introduction#overview](https://docs.near.org/tutorials/nfts/introduction#overview)

### Minting NFT

```zsh
export NEARID=dev-1667465532719-78367815258907
```

```zsh
near call nft.examples.testnet nft_mint '{"token_id": "00", "receiver_id": "'$NEARID'", "metadata": { "title": "GO TEAM", "description": "The Team Goes", "media": "ipfs://QmZCEKQsaKbMoekTPk2cELbUVhxo5SRFVGGx4Hp83n81Xn/0", "copies": 1}}' --accountId $NEARID --deposit 0.1
```

### view NFT

```zsh
near view nft.examples.testnet nft_tokens_for_owner '{"account_id": "'$NEARID'"}'
```

```zsh
[
  {
    token_id: '00',
    owner_id: 'dev-1667465532719-78367815258907',
    metadata: {
      title: 'GO TEAM',
      description: 'The Team Goes',
      media: 'ipfs://QmZCEKQsaKbMoekTPk2cELbUVhxo5SRFVGGx4Hp83n81Xn/0',
      media_hash: null,
      copies: 1,
      issued_at: null,
      expires_at: null,
      starts_at: null,
      updated_at: null,
      extra: null,
      reference: null,
      reference_hash: null
    },
    approved_account_ids: {},
    royalty: {}
  }
]
```

### Overveiw nft contact's function

[https://docs.near.org/tutorials/nfts/skeleton#source-files](https://docs.near.org/tutorials/nfts/skeleton#source-files)
