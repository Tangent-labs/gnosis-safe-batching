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
    const DAO = "0x461B62CB3A7e9Df8f800aE058AE92F855F2c27Ca"
    const markets = [MARKETS.CURVE_GAUGE.PYUSD_USDC]
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
                    2_956,
                    109_861,
                    980_000,
                    985_000,
                    1_000_000,
                    1000,
                    2025,
                    1_225
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