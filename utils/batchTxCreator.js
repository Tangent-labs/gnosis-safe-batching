import SafeApiKit from "@safe-global/api-kit";
import Safe from "@safe-global/protocol-kit";
import { privateKeyToAccount } from "viem/accounts";

export async function batchTxCreator(safeTransactions) {
    const safeApiService = new SafeApiKit({
        chainId: 1n, apiKey: process.env.SAFE_KEY
    });

    const rpcUrl = "https://eth-mainnet.g.alchemy.com/v2/zCrDEsqvlSdKaF_Tv0q4Q";
    const privateKey = process.env.SIGNER;
    const safeAddress = "0x536d4e9C0944dE2aC6657d610Aa99fA5e97Ce493";

    const account = privateKeyToAccount(privateKey);


    // Initialisation of SDK
    const safeSdk = await Safe.init({
        provider: rpcUrl,
        signer: privateKey,
        safeAddress
    });

    const nextNonce = await safeApiService.getNextNonce(safeAddress);

    // Create safe tx
    const safeTx = await safeSdk.createTransaction({
        transactions: safeTransactions,
        options: {
            nonce: nextNonce - 1
        }
    });

    // Get tx Hash
    const safeTxHash = await safeSdk.getTransactionHash(safeTx);

    // Sign 
    const sig = await safeSdk.signTransaction(safeTx, 'eth_sign');

    const signature = Array.from(sig.signatures.values())[0];

    // Broadcast signature to API
    safeApiService.proposeTransaction({
        safeAddress,
        safeTransactionData: safeTx.data,
        safeTxHash,
        senderAddress: account.address,
        senderSignature: signature.data
    }).then(resp => { console.log(resp) })
        .catch(err => { console.error(err) })

    return { rpcUrl, safeSdk, safeAddress, account, safeApiService }
}