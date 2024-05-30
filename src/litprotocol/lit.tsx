import { LitNodeClient, encryptString,decryptToString } from "@lit-protocol/lit-node-client";
import { genSession } from "./session";
import {genAuthSig} from './genauthsig'
import { joinRoomCode} from "./litactions";
import { LitAbility, LitAccessControlConditionResource, LitActionResource } from "@lit-protocol/auth-helpers";
import { SessionSigsMap } from '@lit-protocol/types';
import { chirpCasterAddress } from "@/contracts/contracts";
import { sign } from "crypto";
let createRoomURL = "https://api.huddle01.com/api/v1/create-room"
let joinRoomURL = "https://api.huddle01.com/api/v1/join-room-token"
let client = new LitNodeClient({
    litNetwork: 'cayenne'
});


async function connectClient(){
    await client.connect();

}


const _accessControlConditions =  [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: "0x654bA1c9809F16aFD9845B5ef86cd68b77DB4F26",
      },
    },
  ];




  


const chain = 'sepolia';

export const createRoom = async(signer:any,name:string)=>
{  
     
    await client.connect();
    
    let roomId
     const response = await fetch("/api/createroom", {
        method: "POST",
        body: JSON.stringify({
          title: name,
          hostWallets: [await signer.getAddress()]
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log(responseData)

      if (responseData.message === "Room Created Successfully") {
          roomId = responseData.data.roomId;
      } else {
        throw new Error(responseData.message || 'Error creating room');
      }
    
      const accessControlConditions = [
        {
          contractAddress: '0x7d7Fe6Cd962ba9b495DB162D825A87fD8563397e',
          standardContractType: 'ERC1155',
          chain,
          method: 'balanceOf',
          parameters: [
            ':userAddress',
            '1'
          ],
          returnValueTest: {
            comparator: '>',
            value: '0'
          }
        }
      ]
 const __accessControlConditions = [
     {
        conditionType: "evmBasic",

        contractAddress: chirpCasterAddress,
         standardContractType: '',
         chain: 'sepolia',
         method: 'userInChannel',
        
         parameters: [roomId,':userAddress'],
         returnValueTest: {
             comparator: '=',
             value: 'true',
         },
     },
 ];

 const unifiedAccessControlConditions   = [
    {
      contractAddress: chirpCasterAddress, // Replace with your actual contract address
      conditionType: "evmContract",

      functionName: "userInChannel",
      functionParams: [roomId, ":userAddress"], // Placeholder for dynamic user address
      functionAbi: {
        type: "function",
        stateMutability: "view",
        outputs: [
          {
            type: "bool",
            name: "",
            internalType: "bool",
          },
        ],
        name: "userInChannel",
        inputs: [
          {
            type: "string",
            name: "roomId",
            internalType: "string",
          },
          {
            type: "address",
            name: "userAddress",
            internalType: "address",
          },
        ],
      },
      chain: "sepolia", // Specify the blockchain network
      returnValueTest: {
        key: "",
        comparator: "=",
        value: "true", // Expecting boolean true as a string
      },
    },
  ];
  
 
     /*const session = await genSession(signer, client, [
        {
            resource: new LitActionResource('*'),
            ability: LitAbility.LitActionExecution,
        },
        {
            resource: new LitAccessControlConditionResource('*'),
            ability: LitAbility.AccessControlConditionDecryption,
        }
    ]);*/
     //console.log(session)
     
     const { ciphertext, dataToEncryptHash } = await encryptString(
         {
            accessControlConditions:accessControlConditions ,
       //   sessionSigs: session,
       //     chain,
             dataToEncrypt: JSON.stringify({roomId:roomId,apiKey:process.env.NEXT_PUBLIC_HUDDLE01_API_KEY})
         },
         client
     );
     
     
     console.log("cipher text:", ciphertext, "hash:", dataToEncryptHash);
     return {ciphertext,dataToEncryptHash,roomId}
   
}
/*
Here we are encypting our key for secure use within an action
this code should be run once and the ciphertext and dataToEncryptHash stored for later sending
to the Lit Action in 'jsParams'
*/
export const getAccessToken= async(signer:any,roomId:string,ciphertext:string,dataToEncryptHash:string)=>
{   


    await client.connect();
    console.log(roomId)
    console.log(ciphertext)
    console.log(dataToEncryptHash)
    const accessControlConditions = [
        {
          contractAddress: '0x7d7Fe6Cd962ba9b495DB162D825A87fD8563397e',
          standardContractType: 'ERC1155',
          chain,
          method: 'balanceOf',
          parameters: [
            ':userAddress',
            '1'
          ],
          returnValueTest: {
            comparator: '>',
            value: '0'
          }
        }
      ]
    const __accessControlConditions = [
        {
            conditionType: "evmBasic",

            contractAddress: chirpCasterAddress,
            standardContractType: '',
            chain: 'sepolia',
            method: 'userInChannel',
           
            parameters: [roomId,':userAddress'],
            returnValueTest: {
                comparator: '=',
                value: 'true',
            },
        },
    ];

    const unifiedAccessControlConditions   = [
        {
          contractAddress: chirpCasterAddress, // Replace with your actual contract address
          conditionType: "evmContract",
    
          functionName: "userInChannel",
          functionParams: [roomId, ":userAddress"], // Placeholder for dynamic user address
          functionAbi: {
            type: "function",
            stateMutability: "view",
            outputs: [
              {
                type: "bool",
                name: "",
                internalType: "bool",
              },
            ],
            name: "userInChannel",
            inputs: [
              {
                type: "string",
                name: "roomId",
                internalType: "string",
              },
              {
                type: "address",
                name: "userAddress",
                internalType: "address",
              },
            ],
          },
          chain: "sepolia", // Specify the blockchain network
          returnValueTest: {
            key: "",
            comparator: "=",
            value: "true", // Expecting boolean true as a string
          },
        },
      ];
      
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

/*const x =await decryptToString(  {
    unifiedAccessControlConditions,
    sessionSigs:sessionForDecryption,
    chain,ciphertext,dataToEncryptHash},client)

console.log(x)
 return*/
const res = await client.executeJs({
    sessionSigs,
    code: joinRoomCode(joinRoomURL),
    jsParams: {
        sessionSigs,
        ciphertext,
        dataToEncryptHash,
        accessControlConditions ,chain,roomId
    }
});


console.log("result from action execution:", res);
return res

}