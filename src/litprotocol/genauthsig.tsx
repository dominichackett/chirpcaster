import { LitResourceAbilityRequest, createSiweMessageWithRecaps } from '@lit-protocol/auth-helpers';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import {ethers} from 'ethers';

const ONE_WEEK_FROM_NOW = new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 7
    ).toISOString();

export const genProvider = () => {
    return new ethers.providers.JsonRpcProvider('https://chain-rpc.litprotocol.com/http');
}


export const genAuthSig = async (
    wallet: ethers.Signer,
    client: LitNodeClient,
    uri: string,
    resources: LitResourceAbilityRequest[]) => {
    
    let blockHash = await client.getLatestBlockhash();
    const message = await createSiweMessageWithRecaps({
        walletAddress: await wallet.getAddress(),
        nonce: blockHash,
        litNodeClient: client,
        resources,
        expiration: ONE_WEEK_FROM_NOW,
        uri
    })
    // Sign the message and format the authSig
    const signature = await wallet.signMessage(message);

    const authSig = {
        sig: signature,
        derivedVia: 'web3.eth.personal.sign',
        signedMessage: signature,
        address: await wallet.getAddress(),
    };


    return authSig;
}