import "dotenv/config";

import { CURVE_LPS } from "@tangent/defi-resources";
import MarketCreator from "../../abis/MarketCreator.json" with { type: "json" };

import { encodeFunctionData, parseEther } from "viem";
import { IR_PARAMS_LEC_USD_S } from "../../params/irParams.js";
import { RC_PARAMS_LEC_USD_S_A_B } from "../../params/rcParams.js";

import { PROD_ADDRESSES } from "../../params/prod_addresses.js";
import { batchTxCreator } from "../../utils/batchTxCreator.js";


async function main() {
    const abiMarketCreator = MarketCreator.abi;

    const data = encodeFunctionData(({
        abi: abiMarketCreator,
        functionName: "createCurveGaugeMarket",
        args: [
            [
                CURVE_LPS.DUO_RLUSD_USDC,
                PROD_ADDRESSES.ORACLES.CURVE_LP_STABLE_DUO.USDC_RLUSD,
                90_000, // MaxLTV
                91_500, // LT
                20_000, // Liquidation Fee
                0, // 1M
                parseEther("2000"), // Min Loan
                [COMMON_ERC20S.RLUSD],
                "Curve Gauge - RLUSD/USDC"
            ],
            CURVE_GAUGES.RLUSD_USDC,
            IR_PARAMS_LEC_USD_S,
            RC_PARAMS_LEC_USD_S_A_B
        ]
    }))

    await batchTxCreator([{
        to: PROD_ADDRESSES.MARKET_CREATOR,
        value: "0",
        data: data,
    }])
}

main().catch(console.error);