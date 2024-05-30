import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { genAuthSig } from "./genauthsig";
import {ethers} from 'ethers';
import { LitResourceAbilityRequest ,generateAuthSig,createSiweMessageWithRecaps} from "@lit-protocol/auth-helpers";
import { AuthCallbackParams } from "@lit-protocol/types";

export const genSession = async (
    wallet: ethers.Signer,
    client: LitNodeClient,
    resources: LitResourceAbilityRequest[]) => {
      console.log(client)
      
      let sessionSigs = await client.getSessionSigs({
        chain: "sepolia",
        resourceAbilityRequests: resources,
        authNeededCallback: async (params: AuthCallbackParams) => {
        
          console.log("resourceAbilityRequests:", params.resources);

          if (!params.expiration) {
            throw new Error("expiration is required");
          }
  
          if (!params.resources) {
            throw new Error("resourceAbilityRequests is required");
          }
  
          if (!params.uri) {
            throw new Error("uri is required");
          }

          console.log("HBCU")
          console.log(params.resourceAbilityRequests )
          // generate the authSig for the inner signature of the session
          // we need capabilities to assure that only one api key may be decrypted
         // const authSig = await genAuthSig(wallet, client, params.uri, params.resourceAbilityRequests ?? []);
         let blockHash = await client.getLatestBlockhash();

         const toSign = await createSiweMessageWithRecaps({
          uri: params.uri,
          expiration: params.expiration,
          resources: params.resourceAbilityRequests,
          walletAddress: await wallet.getAddress(),
          nonce: blockHash,
          litNodeClient:client,
        });

        const authSig = await generateAuthSig({
          signer: wallet,
          toSign,
        });

        return authSig;
      },
    });

       

    return sessionSigs;
}