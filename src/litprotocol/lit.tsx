import { LitNodeClient, encryptString } from "@lit-protocol/lit-node-client";
import { genSession } from "./session";
import { joinRoomCode} from "./litactions";
import { LitAbility, LitAccessControlConditionResource, LitActionResource } from "@lit-protocol/auth-helpers";
import { sign } from "crypto";
let createRoomURL = "https://api.huddle01.com/api/v1/create-room"
let joinRoomURL = "https://api.huddle01.com/api/v1/join-room-token"
let client = new LitNodeClient({
    litNetwork: 'cayenne'
});


async function connectClient(){
    await client.connect();

}



const chain = 'ethereum';

export const createRoom = async(signer:any,name:string)=>
{  
     await client.connect();
     const  response = await fetch("https://api.huddle01.com/api/v1/create-room", {
    method: "POST",
    body:JSON.stringify({
       title: name,
       hostWallets: [signer.getAddress()]
    }),
    headers: {
      "Content-Type": "application/json",
      'x-api-key': process.env.NEXT_PUBLIC_HUDDLE01_API_KEY
}})


 let roomId
 if(response.message== "Meeting Created Successfully")
 {
     roomId = response.data.roomId
 
 }else
 {
     throw new Error(response)
 }
 
 
 const accessControlConditions = [
     {
         contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
         standardContractType: 'custom',
         chain: 'sepolia',
         method: 'userInChannel',
         parameters: [roomId,':userAddress'],
         returnValueTest: {
             comparator: '==',
             value: 'true',
         },
     },
 ];
 
     const session = await genSession(signer, client, []);
     const { ciphertext, dataToEncryptHash } = await encryptString(
         {
             accessControlConditions,
             sessionSigs: session,
             chain,
             dataToEncrypt: JSON.stringify({roomId:roomId,apiKey:process.env.NEXT_PUBLIC_HUDDLE01_API_KEY})
         },
         client
     );
     
     console.log("cipher text:", ciphertext, "hash:", dataToEncryptHash);
     return (ciphertext,dataToEncryptHash,roomId)
   
}
/*
Here we are encypting our key for secure use within an action
this code should be run once and the ciphertext and dataToEncryptHash stored for later sending
to the Lit Action in 'jsParams'
*/
export const getAccessToken= async(signer:any,roomId:string,ciphertext:string,dataToEncryptHash:string)=>
{   

    await client.connect();

    const accessControlConditions = [
        {
            contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
            standardContractType: 'custom',
            chain: 'sepolia',
            method: 'userInChannel',
            parameters: [roomId,':userAddress'],
            returnValueTest: {
                comparator: '==',
                value: 'true',
            },
        },
    ];

    const accsResourceString = 
    await LitAccessControlConditionResource.generateResourceString(accessControlConditions, dataToEncryptHash);
const sessionForDecryption = genSession(signer, client, [
    {
        resource: new LitActionResource('*'),
        ability: LitAbility.LitActionExecution,
    },
    {
        resource: new LitAccessControlConditionResource(accsResourceString),
        ability: LitAbility.AccessControlConditionDecryption,
    }
]);

/*
Here we use the encrypted key by sending the
ciphertext and dataToEncryptHash to the action
*/ 
const res = await client.executeJs({
    sessionSigs: sessionForDecryption,
    code: createRoomCode(joinRoomURL),
    jsParams: {
        ciphertext,
        dataToEncryptHash,
        accessControlConditions
    }
});

console.log("result from action execution:", res);

}