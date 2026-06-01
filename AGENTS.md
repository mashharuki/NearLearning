# AGENTS.md

Guidance for AI coding agents working in this repository.

## Repository Overview

This is a NEAR Protocol learning repository containing many independent examples rather than one unified application. Treat each top-level example as its own project with its own dependency lockfile, build scripts, tests, and README.

Major areas:

- `counter/`, `guest-book/`, `donation/`, `cross-contract/`, `factory/`, `my-dapp/`: NEAR examples with Rust contracts, optional Parcel frontends, and sandbox integration tests.
- `coin-flip-js/`: NEAR example with a JavaScript/TypeScript contract built by `near-sdk-js`.
- `nft-zero-to-hero/nft/`, `NFT/backend/`, `NFT/nft-tutorial-frontend/`: NFT tutorials and example contracts/frontends.
- `FT/`: fungible token contract examples and TS/Rust integration tests.
- `token-factory/`: older token factory contracts using `near-sdk` 3.x plus a Create React App frontend.
- `update-migrate/`: contract upgrade and state migration examples.
- `dao/sputnik-dao-contract/`: Sputnik DAO contracts, Rust workspace, and AVA tests.
- `near-intents/`: notes and references, currently documentation-oriented.

There is no root-level package manager workflow. Do not assume `npm install`, `npm test`, or `cargo test` at the repository root is meaningful.

## First Steps

Before editing:

1. Identify the target subproject from the user request.
2. Read that subproject's `README.md`, `package.json`, `Cargo.toml`, and relevant `build.sh`/`deploy.sh` files.
3. Check `git status --short` and avoid touching unrelated user changes.
4. Prefer the exact local scripts already defined for that subproject.

Use `rg`/`rg --files` for code discovery. Avoid broad recursive commands over generated directories such as `node_modules`, `target`, `dist`, `build`, and `.parcel-cache`.

## Common Commands

Run commands from the relevant subproject directory unless noted.

Typical Rust-contract examples:

```sh
npm install
npm run build
npm test
npm run deploy
npm start
```

Examples using this pattern include `counter`, `guest-book`, `donation`, `cross-contract`, and `factory`. Some have no frontend (`cross-contract`, `factory`), and their `start` scripts may only print a placeholder.

For contract-only Rust examples:

```sh
cd contract
./build.sh
cargo test
```

For `FT`:

```sh
./scripts/build.sh
cd integration-tests/ts && npm test
cd integration-tests/rs && cargo test
```

For `coin-flip-js`:

```sh
npm install
npm run build
npm test
npm run deploy
npm start
```

For `dao/sputnik-dao-contract`:

```sh
./build.sh
cd sputnikdao2 && cargo test
cd sputnikdao2/tests-ava && npm test
```

For `token-factory/frontend`:

```sh
npm install
npm start
npm run build
npm test
```

Always verify the exact script names in the local `package.json`; similar examples are not perfectly identical.

## NEAR Contract Guidelines

- Preserve the NEAR SDK generation already used by each contract. This repo mixes `near-sdk` 3.x, 4.0.0, and 4.0.0-pre.x examples; do not upgrade SDKs or rewrite macros unless explicitly requested.
- Rust contracts build to `wasm32-unknown-unknown`. Use the existing `build.sh` scripts, which generally run `rustup target add wasm32-unknown-unknown` and `cargo build --all --target wasm32-unknown-unknown --release`.
- Keep contract state serialization compatible. Be especially careful in `update-migrate/`, NFT, FT, and DAO contracts where storage layout matters.
- For cross-contract calls and callbacks, update state before external promises where appropriate, validate callback results, and keep callback methods protected when the pattern requires it.
- Use `near_sdk::env`, SDK collections, and existing local patterns. Do not introduce unrelated abstractions into tutorial code.
- For payable methods, storage deposits, FT/NFT transfers, and DAO proposals, preserve attached deposit and gas assumptions in tests and docs.

## Frontend Guidelines

- Older examples use Parcel with simple JS/React files under `frontend/`; keep changes lightweight and consistent with existing structure.
- `token-factory/frontend` uses Create React App, CSS modules in places, and a larger component tree. Follow its existing component and CSS organization.
- Do not replace the wallet integration style unless requested. This repo uses older `near-api-js` patterns in several examples.
- When changing UI behavior, run the subproject's frontend build if dependencies are available.

## Testing and Verification

Choose the narrowest verification that covers the change:

- Rust contract logic: `cd <contract-dir> && cargo test`.
- Contract build output: run the local `./build.sh` or the parent `npm run build:contract`.
- Sandbox integration tests: run the parent `npm test` or its `test:integration` script after building the contract.
- JS contract changes in `coin-flip-js/contract`: `npm run build` and parent integration tests.
- Frontend changes: run `npm run build` in the frontend directory or parent `npm run build:web`.

If tests cannot be run because dependencies are missing or network access is restricted, state that clearly in the final response.

## Generated Files and Artifacts

Generated outputs are common in this repo:

- Rust: `target/`, `res/*.wasm`, `contract/target/`
- JS/Parcel/CRA: `node_modules/`, `dist/`, `build/`, `.parcel-cache/`
- NEAR dev accounts: `neardev/`, `.neardev/`

Do not commit or intentionally edit generated build outputs unless the subproject already tracks them as part of the tutorial and the requested change specifically requires regenerating them. Several `res/*.wasm` files are tracked examples; treat changes to tracked WASM as high-signal and mention them explicitly.

## CLI and Network Operations

This repository contains docs for both legacy `near-cli` and newer `near-cli-rs`. Check the installed CLI syntax before giving or running commands:

```sh
near --version
near --help
```

Legacy examples often use:

```sh
near dev-deploy --wasmFile <path>
near deploy --accountId <account> --wasmFile <path>
near call <contract> <method> '<json>' --accountId <signer>
near view <contract> <method> '<json>'
```

Newer `near-cli-rs` commands require `network-config <network>` and different signing syntax. Do not mix command styles.

Network actions can create accounts, spend testnet funds, deploy contracts, or write keys under `~/.near-credentials`. Ask before destructive or externally visible actions unless the user explicitly requested them.

## Secrets and Accounts

- Do not add new seed phrases, private keys, access keys, or account credential files to the repo.
- Existing tutorial/dev credentials in docs should not be expanded or reused for production guidance.
- Do not read or print private key material from `~/.near-credentials` unless the user explicitly asks and understands the risk.
- Prefer testnet/dev-account workflows for examples.

## Style

- Keep tutorial code simple and local to the example being changed.
- Match existing Rust edition, dependency versions, formatting, and module layout.
- Match existing JavaScript style. Many examples are intentionally minimal and not modernized.
- Use ASCII for new files unless the existing file already uses Japanese or other non-ASCII text.
- Update README instructions when behavior or commands change.

## Pull Request / Final Response Checklist

When finishing work, report:

- Which subproject(s) changed.
- The exact verification commands run and their results.
- Any tests not run and why.
- Any network/deploy/account operations performed.
- Any tracked generated artifacts changed, especially `.wasm` files.
