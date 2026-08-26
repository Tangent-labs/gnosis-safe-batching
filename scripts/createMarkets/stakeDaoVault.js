import "dotenv/config";

import { COMMON_ERC20S, CURVE_LPS } from "@tangent/defi-resources";
import { encodeFunctionData, parseEther } from "viem";
import MarketCreator from "../../abis/MarketCreator.json" with { type: "json" };
import { IR_PARAMS_HEC_USD_S, IR_PARAMS_HEC_VOL_BASE, IR_PARAMS_LEC_USD_A, IR_PARAMS_LEC_VOL_BASE } from "../../params/irParams.js";
import { RC_PARAMS_HEC_USD_BASE, RC_PARAMS_HEC_VOL_BASE, RC_PARAMS_LEC_USD_S_A_B, RC_PARAMS_LEC_VOL_BASE } from "../../params/rcParams.js";

import { SDT_frxUSD_OUSD_VAULT, SDT_msETH_OETH_VAULT, SDT_reUSD_sDOLA_VAULT } from "@tangent/defi-resources/build/ressources/erc20/stakeDao.js";
import { PROD_ADDRESSES } from "../../params/prod_addresses.js";
import { batchTxCreator } from "../../utils/batchTxCreator.js";



async function main() {
    const abiMarketCreator = MarketCreator.abi;

    const data = encodeFunctionData(({
        abi: abiMarketCreator,
        functionName: "createStakeDaoVaultV2Market",
        args: [
            [
                CURVE_LPS.DUO_reUSD_sDOLA,
                PROD_ADDRESSES.ORACLES.CURVE_LP_STABLE_DUO.reUSD_sDOLA,
                84_000, // MaxLTV
                85_000, // LT
                20_000, // Liquidation Fee
                0, // 1M
                parseEther("2000"), // Min Loan
                [COMMON_ERC20S.CRV],
                "StakeDao Vault - reUSD/sDOLA"
            ],
            SDT_reUSD_sDOLA_VAULT,
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