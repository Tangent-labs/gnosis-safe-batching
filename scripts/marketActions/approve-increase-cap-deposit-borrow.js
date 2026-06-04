import { CURVE_LPS } from "@tangent/defi-resources";
import "dotenv/config";
import { encodeFunctionData, parseEther } from "viem";
import { PROD_ADDRESSES } from "../../params/prod_addresses.js";
import { batchTxCreator } from "../../utils/batchTxCreator.js";

import ERC20 from "../../abis/ERC20.json" with { type: "json" };
import MarketExternalActions from "../../abis/MarketExternalActions.json" with { type: "json" };

export async function main() {
    const market = PROD_ADDRESSES.MARKETS.CURVE_GAUGE.PYUSD_USDC
    const erc20Abi = ERC20.abi;
    const marketAbi = MarketExternalActions.abi;

    // APPROVE MARKET TO SPEND LP
    const approveData = encodeFunctionData(({
        abi: erc20Abi,
        functionName: "approve",
        args: [market, parseEther("22500")]
    }))

    // INCREASE CAP AT 20K 
    const increaseDebtCapData = encodeFunctionData(({
        abi: marketAbi,
        functionName: "setMaxMarketDebt",
        args: [parseEther("20000")]
    }))

    // Deposit and borrow 
    const depositAndBorrowData = encodeFunctionData(({
        abi: marketAbi,
        functionName: "depositAndBorrow",
        args: [parseEther("22500"), parseEther("20000"), false]
    }));

    await batchTxCreator([
        // Approve
        {
            to: CURVE_LPS.DUO_PYUSD_USDC,
            value: "0",
            data: approveData
        },
        // Increase
        {
            to: market,
            value: "0",
            data: increaseDebtCapData
        },
        // Deposit and borrow
        {
            to: market,
            value: "0",
            data: depositAndBorrowData
        }])

}

main().catch(console.error);