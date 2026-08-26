# gnosis-safe

Tx shortcuts on Gnosis Safe multisig. A collection of scripts that build, batch, sign, and propose transactions to a Safe (Gnosis Safe / Safe{Wallet}) using `@safe-global/protocol-kit` and `@safe-global/api-kit`, mostly for creating and managing DeFi lending markets (Morpho, Curve Gauge, Convex FXN, StakeDAO vaults) and pushing protocol rewards.

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

1. Initializes the Safe SDK against a Multisig.
2. Fetches the next nonce from the Safe Transaction Service.
3. Batches the transactions into a single Safe transaction, hashes and signs it (`eth_sign`) with `SIGNER`.
4. Proposes the signed transaction to the Safe Transaction Service via `SAFE_KEY`.

Addresses, IR (interest rate) curve params, and RC (risk/collateral) params live in [`params/`](params/) and are imported by the scripts.

## Scripts

- `scripts/morpho/createMarketSupplyDepositBorrow.js` — creates a Morpho market and, in the same batch, approves, supplies, deposits collateral, and borrows.
- `scripts/createMarkets/curveGauge.js` — creates a Curve Gauge market via `MarketCreator`.
- `scripts/createMarkets/convexFXN.js` — creates a Convex FXN market via `MarketCreator`.
- `scripts/createMarkets/stakeDaoVault.js` — creates a StakeDAO vault market.
- `scripts/marketActions/approve-deposit.js` — approves and deposits the DAO's LP balance into a given market.
- `scripts/marketActions/approve-increase-cap-deposit-borrow.js` — approves, raises a market's max debt cap, then deposits and borrows.
- `scripts/update-params/updateIRParams.js` — updates interest rate parameters on one or more markets via `IRCalculator`.
- `scripts/update-params/updateMaxMarketDebt.js` — updates the max market debt cap on one or more markets.
- `scripts/rewards/pushSavingRewards.js` — transfers USG into sUSG (Yearn V3 vault) and triggers `process_report` to stream rewards.
- `utils/decode.js` — decodes raw calldata against a given ABI (currently `IRCalculator`), useful for inspecting pending Safe transactions.

Each script hardcodes the market/params it targets — edit the constants at the top of the file before running, e.g.:

```bash
node scripts/update-params/updateMaxMarketDebt.js
```

## Layout

- `abis/` — contract ABIs (ERC20, Morpho, MarketCreator, MarketExternalActions, IRCalculator, YearnV3Vault).
- `params/` — deployed contract addresses (`prod_addresses.js`), IR curve presets (`irParams.js`), and risk/collateral presets (`rcParams.js`).
- `scripts/` — one-off executable scripts, grouped by purpose (`createMarkets/`, `marketActions/`, `morpho/`, `rewards/`, `update-params/`).
- `utils/` — shared helpers (`batchTxCreator.js`, `decode.js`).
