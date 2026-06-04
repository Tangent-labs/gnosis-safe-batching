import "dotenv/config";

import { COMMON_ERC20S, CURVE_LPS } from "@tangent/defi-resources";
import { encodeFunctionData, parseEther } from "viem";
import MarketCreator from "../../abis/MarketCreator.json" with { type: "json" };
import { IR_PARAMS_HEC_USD_S } from "../../params/irParams.js";
import { RC_PARAMS_HEC_USD_BASE } from "../../params/rcParams.js";

import { PROD_ADDRESSES } from "../../params/prod_addresses.js";
import { batchTxCreator } from "../../utils/batchTxCreator.js";



async function main() {
    const abiMarketCreator = MarketCreator.abi;

    const data = encodeFunctionData(({
        abi: abiMarketCreator,
        functionName: "createConvexFxnMarket",
        args: [
            [
                CURVE_LPS.LP_USDC_fxUSD,
                PROD_ADDRESSES.ORACLES.CURVE_LP_STABLE_DUO.USDC_fxUSD,
                90_000, // MaxLTV
                91_250, // LT
                20_000, // Liquidation Fee
                0, // 1M
                parseEther("2000"), // Min Loan
                [COMMON_ERC20S.FXN],
                "Convex FXN - fxUSD/USDC"
            ],
            32,
            IR_PARAMS_HEC_USD_S,
            RC_PARAMS_HEC_USD_BASE
        ]
    }))

    await batchTxCreator([{
        to: PROD_ADDRESSES.MARKET_CREATOR,
        value: "0",
        data: data,
    }])
}

main().catch(console.error);