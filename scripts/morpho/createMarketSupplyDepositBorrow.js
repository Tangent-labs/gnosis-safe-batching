import "dotenv/config";
import { encodeFunctionData, parseEther } from "viem";
import { batchTxCreator } from "../../utils/batchTxCreator.js";

import ERC20 from "../../abis/ERC20.json" with { type: "json" };
import MorphoSingleton from "../../abis/Morpho.json" with { type: "json" };

export async function main() {
    const frxUSD = "0xCAcd6fd266aF91b8AeD52aCCc382b4e165586E29"
    const sUSG = "0xF17D6f98A5C6EAA99d149079984119e0A4EF6900"
    const oracle = "0x983C54E46F6fe7793fA4fD01B72fC3c065AE1b11"
    const irm = "0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC"
    const lltv = 860000000000000000n

    const morphoSingleton = "0xbbbbbbbbbb9cc5e90e3b3af64bdaf62c37eeffcb"
    const erc20Abi = ERC20.abi;
    const morphoSingletonAbi = MorphoSingleton;

    // Create Market
    const createMarket = encodeFunctionData(({
        abi: morphoSingletonAbi,
        functionName: "createMarket",
        args: [[frxUSD, sUSG, oracle, irm, lltv]]
    }))

    // Approve loan token
    const approveLoanToken = encodeFunctionData(({
        abi: erc20Abi,
        functionName: "approve",
        args: [morphoSingleton, parseEther("2")]
    }))

    // Approve sUSG 
    const approveCollatToken = encodeFunctionData(({
        abi: erc20Abi,
        functionName: "approve",
        args: [morphoSingleton, parseEther("2")]
    }))

    // Supply on behalf of dead
    const supplyLoanToken = encodeFunctionData(({
        abi: morphoSingletonAbi,
        functionName: "supply",
        args: [[frxUSD, sUSG, oracle, irm, lltv], parseEther("1"), 0n, '0x000000000000000000000000000000000000dEaD', ""]
    }))

    // Deposit sUSG
    const supplyCollateral = encodeFunctionData(({
        abi: morphoSingletonAbi,
        functionName: "supplyCollateral",
        args: [[frxUSD, sUSG, oracle, irm, lltv], parseEther("2"), '0x461B62CB3A7e9Df8f800aE058AE92F855F2c27Ca', ""]
    }));

    // Borrow frxUSD
    const borrow = encodeFunctionData(({
        abi: morphoSingletonAbi,
        functionName: "borrow",
        args: [[frxUSD, sUSG, oracle, irm, lltv], parseEther("0.9"), 0, '0x461B62CB3A7e9Df8f800aE058AE92F855F2c27Ca', "0x461B62CB3A7e9Df8f800aE058AE92F855F2c27Ca"]
    }));

    await batchTxCreator([
        // Create market
        {
            to: morphoSingleton,
            value: "0",
            data: createMarket
        },
        // Approve loan token
        {
            to: frxUSD,
            value: "0",
            data: approveLoanToken
        },
        // Approve collat token
        {
            to: sUSG,
            value: "0",
            data: approveCollatToken
        },
        // Supply loan token 
        {
            to: morphoSingleton,
            value: "0",
            data: supplyLoanToken
        },

        // Deposit
        {
            to: morphoSingleton,
            value: "0",
            data: supplyCollateral
        },
        // Borrow
        {
            to: morphoSingleton,
            value: "0",
            data: borrow
        },

    ])


}

main().catch(console.error);