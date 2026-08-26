# gnosis-safe

Tx shortcuts on Gnosis Safe multisig. A collection of scripts that build & batch transactions to a Safe (Gnosis Safe / Safe{Wallet}) using `@safe-global/protocol-kit` and `@safe-global/api-kit`.

## Setup

```bash
npm install
cp .env-example .env
```

Fill in `.env`:

```
SIGNER=      # private key of a Safe signer/owner
SAFE_KEY=    # Safe Transaction Service API key
```

## How it works

Every script builds one or more encoded contract calls with `viem` and passes them to [`utils/batchTxCreator.js`](utils/batchTxCreator.js), which:

1. Initializes the Safe SDK.
2. Fetches the next nonce.
3. Batches the transactions into a single Safe transaction, hashes and signs it.
4. Proposes the signed transaction to the Safe Transaction Service via `SAFE_KEY`.

Addresses, IR (interest rate) curve params, and RC (risk/collateral) params live in [`params/`](params/) and are imported by the scripts.

## Layout

- `abis/` — contract ABIs
- `params/` — deployed contract addresses (`prod_addresses.js`), IR curve (`irParams.js`), and reward cut (`rcParams.js`).
- `scripts/` — executable scripts, grouped by purpose.
- `utils/` — shared helpers (`batchTxCreator.js`, `decode.js`).
