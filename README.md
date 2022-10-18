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

#### 参考文献
1. [NEAR Developer Docs](https://docs.near.org/concepts/basics/protocol)
2. [Near ADK Rust Docs](https://docs.rs/near-sdk/latest/near_sdk/collections/)
3. [Arlocal](https://github.com/textury/arlocal)
4. [RPC Providers](https://docs.near.org/api/rpc/providers)
5. [NEAR University](https://www.near.university/)
6. [Create NAER App](https://github.com/near/create-near-app)