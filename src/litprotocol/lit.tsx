import { LitNodeClient, encryptString,decryptToString,blobToBase64String,base64StringToBlob } from "@lit-protocol/lit-node-client";
import { genSession } from "./session";
import {genAuthSig} from './genauthsig'
import { joinRoomCode,decryptCode} from "./litactions";
import { LitAbility, LitAccessControlConditionResource, LitActionResource } from "@lit-protocol/auth-helpers";
import { SessionSigsMap } from '@lit-protocol/types';
import { chirpCasterAddress } from "@/contracts/contracts";
import { ethers } from "ethers";

const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY)


const provider = new ethers.providers.JsonRpcProvider(
"https://api.calibration.node.glif.io/rpc/v1"  );

const signer = wallet.connect(provider);


let createRoomURL = "https://api.huddle01.com/api/v1/create-room"
let joinRoomURL = "https://api.huddle01.com/api/v1/join-room-token"
let client = new LitNodeClient({
    litNetwork: 'cayenne'
});


async function connectClient(){
    await client.connect();

}


const accessControlConditions =  [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: "0x5858769800844ab75397775Ca2Fa87B270F7FbBe",
      },
    },
  ];




  


const chain = 'ethereum';




export const encryptMessage = async(file:File,filename:string,filetype:string)=>
{  
     
    await client.connect();
    

     const fileData = await blobToBase64String(file)
     const { ciphertext, dataToEncryptHash } = await encryptString(
         {
            accessControlConditions:accessControlConditions ,
       
             dataToEncrypt: JSON.stringify({filetype:filetype,filename:filename,file:fileData})
         },
         client
     );
     
     
     console.log("cipher text:", ciphertext, "hash:", dataToEncryptHash);
     return {ciphertext,dataToEncryptHash}
   
}


export const encryptText = async(textMessage:string)=>
{  
     
    await client.connect();
    

     const { ciphertext, dataToEncryptHash } = await encryptString(
         {
            accessControlConditions:accessControlConditions ,
       
             dataToEncrypt: textMessage
         },
         client
     );
     
     
     console.log("cipher text:", ciphertext, "hash:", dataToEncryptHash);
     return {ciphertext,dataToEncryptHash}
   
}



export const decryptMessage = async(url:string,dataToEncryptHash:string)=>
{  
     
    await client.connect();
    

      const accsResourceString = 
      await LitAccessControlConditionResource.generateResourceString(accessControlConditions , dataToEncryptHash);
  const sessionForDecryption = await genSession(signer, client, [
      {
          resource: new LitActionResource("*"),
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
  
  const sessionSigs: SessionSigsMap =sessionForDecryption;
  console.log(sessionForDecryption)
  console.log(sessionSigs)
 const response = await fetch("/api/gethash", {
    method: "POST",
    body: JSON.stringify({
      url: url,
      
    }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
console.log(accessControlConditions)

const responseData = await response.json();
  console.log(responseData)

  const data =await decryptToString(  {
    accessControlConditions,
    sessionSigs:sessionSigs,
    ciphertext:responseData.ciphertext,
    chain,dataToEncryptHash},client)
   console.log(data)
    return data

     
   
}


export const decryptText = async(ciphertext:string,dataToEncryptHash:string)=>
{  
     
    await client.connect();
    

      const accsResourceString = 
      await LitAccessControlConditionResource.generateResourceString(accessControlConditions , dataToEncryptHash);
  const sessionForDecryption = await genSession(signer, client, [
      {
          resource: new LitActionResource("*"),
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
  
  const sessionSigs: SessionSigsMap =sessionForDecryption;
 
const res = await client.executeJs({
    sessionSigs,
    code: decryptCode(),
    jsParams: {
        sessionSigs,
         dataToEncryptHash,
         ciphertext, 
        accessControlConditions ,chain
    }
});

     
console.log("result from action execution:", res);
return res
   
}
