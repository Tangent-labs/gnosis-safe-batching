import "dotenv/config";
import { createPublicClient, encodeFunctionData, getAddress, http, parseEther } from "viem";
import { mainnet } from 'viem/chains';
import MarketExternalActions from "../../abis/MarketExternalActions.json" with { type: "json" };
import { PROD_ADDRESSES } from "../../params/prod_addresses.js";
import { batchTxCreator } from "../../utils/batchTxCreator.js";

export async function main() {
    const MARKETS = PROD_ADDRESSES.MARKETS
    const stakeMarkets = MARKETS.STAKEDAO_VAULT
    const cvxFxnMarkets = MARKETS.CONVEX_FXN

    const marketAbi = MarketExternalActions.abi;
    const markets = [getAddress(stakeMarkets.BOLD_USDC)]

    const newCaps = [parseEther("500000")]

    const publicClient = createPublicClient({
        chain: mainnet,
        transport: http('https://eth-mainnet.g.alchemy.com/v2/zCrDEsqvlSdKaF_Tv0q4Q'),
    })

    const txContent = []
    for (let index = 0; index < markets.length; index++) {
        const market = markets[index];
        const cap = newCaps[index];

        // APPROVE MARKET TO SPEND LP
        const setMaxMarketDebtData = encodeFunctionData(({
            abi: marketAbi,
            functionName: "setMaxMarketDebt",
            args: [cap]
        }))

        txContent.push({
            to: market,
            value: "0",
            data: setMaxMarketDebtData
        })
    }



    await batchTxCreator(txContent)

}

main().catch(console.error);