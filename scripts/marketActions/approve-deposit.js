import "dotenv/config";
import { createPublicClient, encodeFunctionData, getContract, http } from "viem";
import { mainnet } from 'viem/chains';
import ERC20 from "../../abis/ERC20.json" with { type: "json" };
import MarketExternalActions from "../../abis/MarketExternalActions.json" with { type: "json" };
import { PROD_ADDRESSES } from "../../params/prod_addresses.js";
import { batchTxCreator } from "../../utils/batchTxCreator.js";

export async function main() {
    const MARKETS = PROD_ADDRESSES.MARKETS
    const stakeMarkets = MARKETS.STAKEDAO_VAULT
    const cvxFxnMarkets = MARKETS.CONVEX_FXN

    const erc20Abi = ERC20.abi;
    const marketAbi = MarketExternalActions.abi;
    const DAO = "0x461B62CB3A7e9Df8f800aE058AE92F855F2c27Ca"
    const markets = [stakeMarkets.reUSD_sDOLA]
    const publicClient = createPublicClient({
        chain: mainnet,
        transport: http('https://eth-mainnet.g.alchemy.com/v2/zCrDEsqvlSdKaF_Tv0q4Q'),
    })
    const txContent = []
    for (let index = 0; index < markets.length; index++) {
        const market = markets[index];

        const marketContract = await getContract({ abi: marketAbi, address: market, client: publicClient })
        const lp = await marketContract.read.collatToken()
        const lpContract = await getContract({ abi: erc20Abi, address: lp, client: publicClient })

        const balance = await lpContract.read.balanceOf([DAO])

        // APPROVE MARKET TO SPEND LP
        const approveData = encodeFunctionData(({
            abi: erc20Abi,
            functionName: "approve",
            args: [market, balance]
        }))

        // Deposit 
        const depositData = encodeFunctionData(({
            abi: marketAbi,
            functionName: "deposit",
            args: [DAO, balance, false]
        }));

        txContent.push({
            to: lp,
            value: "0",
            data: approveData
        },)
        txContent.push({
            to: market,
            value: "0",
            data: depositData
        })
    }



    await batchTxCreator(txContent)

}

main().catch(console.error);