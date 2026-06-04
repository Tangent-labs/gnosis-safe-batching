import "dotenv/config";

import { COMMON_ERC20S, CURVE_LPS } from "@tangent/defi-resources";
import { encodeFunctionData, parseEther } from "viem";
import MarketCreator from "../../abis/MarketCreator.json" with { type: "json" };
import { IR_PARAMS_LEC_USD_A } from "../../params/irParams.js";
import { RC_PARAMS_LEC_USD_S_A_B } from "../../params/rcParams.js";

import { SDT_frxUSD_OUSD_VAULT } from "@tangent/defi-resources/build/ressources/erc20/stakeDao.js";
import { PROD_ADDRESSES } from "../../params/prod_addresses.js";
import { batchTxCreator } from "../../utils/batchTxCreator.js";



async function main() {
    const abiMarketCreator = MarketCreator.abi;

    const data = encodeFunctionData(({
        abi: abiMarketCreator,
        functionName: "createStakeDaoVaultV2Market",
        args: [
            [
                CURVE_LPS.DUO_frxUSD_OUSD,
                PROD_ADDRESSES.ORACLES.CURVE_LP_STABLE_DUO.frxUSD_OUSD,
                87_500, // MaxLTV
                88_750, // LT
                20_000, // Liquidation Fee
                0, // 1M
                parseEther("2000"), // Min Loan
                [COMMON_ERC20S.CRV],
                "StakeDao Vault - frxUSD/OUSD"
            ],
            SDT_frxUSD_OUSD_VAULT,
            IR_PARAMS_LEC_USD_A,
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