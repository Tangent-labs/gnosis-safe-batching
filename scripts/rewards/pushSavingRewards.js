import "dotenv/config";
import { createPublicClient, encodeFunctionData, getContract, http, parseEther } from "viem";
import { mainnet } from 'viem/chains';
import erc20Abi from "../../abis/ERC20.json" with { type: "json" };
import YearnV3Vault from "../../abis/YearnV3Vault.json" with { type: "json" };

import { PROD_ADDRESSES } from "../../params/prod_addresses.js";
import { batchTxCreator } from "../../utils/batchTxCreator.js";

export async function main() {
    const amount = 750

    const weiAmount = parseEther(amount.toString())
    const publicClient = createPublicClient({
        chain: mainnet,
        transport: http('https://eth-mainnet.g.alchemy.com/v2/zCrDEsqvlSdKaF_Tv0q4Q'),
    })

    const usg = await getContract({ abi: erc20Abi.abi, address: PROD_ADDRESSES.USG, client: publicClient })
    const sUSG = await getContract({ abi: YearnV3Vault.abi, address: PROD_ADDRESSES.sUSG, client: publicClient })

    const txContent = []

    // Transfer USG to take sUSG
    const approveData = encodeFunctionData(({
        abi: erc20Abi.abi,
        functionName: "transfer",
        args: [sUSG.address, parseEther(amount.toString())]
    }))

    txContent.push({
        to: usg.address,
        value: "0",
        data: approveData
    })


    // Pulls and stream USG in sUSG
    const processReportData = encodeFunctionData(({
        abi: YearnV3Vault.abi,
        functionName: "process_report",
        args: [sUSG.address]
    }))

    txContent.push({
        to: sUSG.address,
        value: "0",
        data: processReportData
    })

    await batchTxCreator(txContent)


}



main().catch(console.error);