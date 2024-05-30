
  


  export const _joinRoomCode = (url: string) => {
    return `(async () => {
      const apiKey = await Lit.Actions.decryptAndCombine({
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        authSig: null,
        chain: 'sepolia',
      });

      const decryptedData = JSON.parse(apiKey);

      const resp = await fetch(${url}, {
        method: "POST",
        {
          roomId: decryptedData.roomId,
          userType: "guest"
        },
        headers: {
          "Content-type": "application/json",
          'x-api-key': {{decryptedData.apiKey}},
        }
      });
      let data = await resp.json();
      Lit.Actions.setResponse({ response: data });
    })();`;
  }
  

  export const __joinRoomCode = (url: string) => {
    return `(async () => {
    /*const apiKey = await Lit.Actions.decryptAndCombine({
      accessControlConditions:unifiedAccessControlConditions,
        ciphertext,
        dataToEncryptHash,
        authSig:null,
        chain: 'sepolia',
      });
    */

 /*     const contractABI = [
        {
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
      ];
     // const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/");
      
       ///    const contract =  new ethers.Contract("0x9A3aF08E883402f1B805c6dB13C1f46A6dce0351",contractABI,provider);
           const inChannel = await contract.userInChannel(roomId,"0x654bA1c9809F16aFD9845B5ef86cd68b77DB4F26");

            let data = JSON.stringify({inchannel:"inChannel"});
     */       Lit.Actions.setResponse({ response:data});
    })();`;
  }
  export const joinRoomCode = (url: string) => {
    return `(async () => {
      const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/");
      const contractABI = [
        {
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
      ];
      //const contract =  new ethers.Contract("0x9A3aF08E883402f1B805c6dB13C1f46A6dce0351",contractABI,provider);
      try{
      //{const inChannel = await contract.userInChannel(roomId,"0x654bA1c9809F16aFD9845B5ef86cd68b77DB4F26");
      
      const apiKey = await Lit.Actions.decryptAndCombine({
        accessControlConditions,
          ciphertext,
          dataToEncryptHash,
          authSig:null,
          chain: 'sepolia',
        });
      Lit.Actions.setResponse({ response:"This is a 999"});

    }catch(error)
    {
      Lit.Actions.setResponse({ response:"My Error"+JSON.stringify(error)});
    }
    })();`;
   
  }