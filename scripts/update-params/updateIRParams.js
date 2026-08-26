import "dotenv/config";
import { createPublicClient, encodeFunctionData, getContract, http } from "viem";
import { mainnet } from 'viem/chains';
import IRCalculator from "../../abis/IRCalculator.json" with { type: "json" };
import MarketExternalActions from "../../abis/MarketExternalActions.json" with { type: "json" };

import { PROD_ADDRESSES } from "../../params/prod_addresses.js";
import { batchTxCreator } from "../../utils/batchTxCreator.js";

export async function main() {
    const MARKETS = PROD_ADDRESSES.MARKETS

    const marketAbi = MarketExternalActions.abi;
    const markets = [MARKETS.STAKEDAO_VAULT.cbBTC_WBTC]
    const publicClient = createPublicClient({
        chain: mainnet,
        transport: http('https://eth-mainnet.g.alchemy.com/v2/zCrDEsqvlSdKaF_Tv0q4Q'),
    })
    const txContent = []
    for (let index = 0; index < markets.length; index++) {
        const market = markets[index];
        const irCalculator = await getContract({ abi: IRCalculator.abi, address: PROD_ADDRESSES.IR_CALCULATOR, client: publicClient })

        // Update parameters of IR on a list of markets
        const updateData = encodeFunctionData(({
            abi: IRCalculator.abi,
            functionName: "updateIRParams",
            args: [
                market,
                [
                    false,
                    3440,
                    160944,
                    980_000,
                    994000,
                    1_000_000,
                    900,
                    4225,
                    50
                ]


            ]
        }))

        txContent.push({
            to: irCalculator.address,
            value: "0",
            data: updateData
        },)

    }

    await batchTxCreator(txContent)

}

main().catch(console.error);