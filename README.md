# NearLearning
Near Protocolを学習するためのリポジトリです。

### ウォレットの生成コマンド

`near generate-key my-new-account`  
 上記コマンドを打つとローカルの`~/.near-credentials/testnet/my-new-account.json`というファイルが生成されてそこに鍵ペアの情報が記載される。

### ネットワークの種類などは下記を参照すること

[https://docs.near.org/concepts/basics/networks](https://docs.near.org/concepts/basics/networks)

### テンプレのNear DAppプロジェクト生成コマンド

`npx create-near-app@latest my-dapp --contract rust --frontend react --tests rust`  

うまく行けば`my-dapp`というディレクトリが生成され、下記のような内容が出力される。

```zsh
Creating a new NEAR dApp

======================================================
✅  Success! Created 'my-dapp'
   with a smart contract in Rust and a frontend template in React.js.
🦀 If you are new to Rust please visit https://www.rust-lang.org 

  Your next steps:
   - Navigate to your project:
         cd my-dapp
   - Install all dependencies
         npm install
   - Build your contract:
         npm run build
   - Test your contract in NEAR SandBox:
         npm test
   - Deploy your contract to NEAR TestNet with a temporary dev account:
         npm run deploy
   - Start your frontend:
         npm start

🧠 Read README.md to explore further.
```

### ビルド方法

`cd my-dapp && npm i && npm run build`

```zsh
>> Building contract
info: component 'rust-std' for target 'wasm32-unknown-unknown' is up to date
   Compiling proc-macro2 v1.0.47
   Compiling quote v1.0.21
   Compiling unicode-ident v1.0.5
   Compiling syn v1.0.102
   Compiling serde v1.0.145
   Compiling version_check v0.9.4
   Compiling serde_derive v1.0.145
   Compiling once_cell v1.15.0
   Compiling crunchy v0.2.2
   Compiling wee_alloc v0.4.5
   Compiling serde_json v1.0.86
   Compiling cfg-if v0.1.10
   Compiling Inflector v0.11.4
   Compiling ryu v1.0.11
   Compiling memory_units v0.4.0
   Compiling itoa v1.0.4
   Compiling byteorder v1.4.3
   Compiling near-sys v0.2.0
   Compiling base64 v0.13.0
   Compiling bs58 v0.4.0
   Compiling static_assertions v1.1.0
   Compiling hex v0.4.3
   Compiling ahash v0.7.6
   Compiling uint v0.9.4
   Compiling hashbrown v0.11.2
   Compiling toml v0.5.9
   Compiling borsh-derive-internal v0.9.3
   Compiling borsh-schema-derive-internal v0.9.3
   Compiling proc-macro-crate v0.1.5
   Compiling borsh-derive v0.9.3
   Compiling near-sdk-macros v4.0.0
   Compiling borsh v0.9.3
   Compiling near-sdk v4.0.0
   Compiling hello_near v1.0.0 (/Users/harukikondo/git/NearLearning/my-dapp/contract)
    Finished release [optimized] target(s) in 43.27s
```

`contract/target/wasm32-unknown-unknown/release`フォルダ配下にビルドの成果物が出力される。  
今回の場合は、`hello_near.wasm`

### スマートコントラクトのデプロイ方法

`npm run deploy` or 上記コマンドでビルド済みであれば下記コマンドでデプロイ可能

```zsh
cd contract && near dev-deploy --wasmFile ./target/wasm32-unknown-unknown/release/hello_near.wasm
```

うまく行けば下記のように出力される。

```zsh
Starting deployment. Account id: dev-1666101496152-75593018686129, node: https://rpc.testnet.near.org, helper: https://helper.testnet.near.org, file: ./target/wasm32-unknown-unknown/release/hello_near.wasm
Transaction Id 64HxQ1dqTrZkLUpBVH4eVqcvYBMbWcvDZUULHNyoQJ76
To see the transaction in the transaction explorer, please open this url in your browser
https://explorer.testnet.near.org/transactions/64HxQ1dqTrZkLUpBVH4eVqcvYBMbWcvDZUULHNyoQJ76
Done deploying to dev-1666101496152-75593018686129
```

デプロイが完了したら`npm run start`でフロントを起動させる。

<img src="./docs/img/hello.png">


#### 開発用のウォレットのシードリカバリーフレーズ ※開発用！！※

```zsh
nearlearning.testnet

expect erupt antenna simple census stereo student sadness fever cousin news escape
```

#### 参考文献
1. [NEAR Developer Docs](https://docs.near.org/concepts/basics/protocol)
2. [Near ADK Rust Docs](https://docs.rs/near-sdk/latest/near_sdk/collections/)
3. [Arlocal](https://github.com/textury/arlocal)
4. [RPC Providers](https://docs.near.org/api/rpc/providers)
5. [NEAR University](https://www.near.university/)
6. [Create NAER App](https://github.com/near/create-near-app)