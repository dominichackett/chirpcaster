
  


  export const joinRoomCode = (url: string) => {
    return `(async () => {
      const contractAddress = '0x1234567890abcdef1234567890abcdef12345678';
      const apiKey = await Lit.Actions.decryptAndCombine({
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        authSig: null,
        chain: 'sepolia',
      });

      const decryptedData = JSON.parse(apiKey)

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
  