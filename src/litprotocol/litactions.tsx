export const decryptCode = ()=>{

  return `(async () => {
 
    

   try {

   
    const textMessage = await Lit.Actions.decryptAndCombine({
      accessControlConditions,
      ciphertext,
      dataToEncryptHash,
      authSig: null,
      chain: 'ethereum',
    });
     
      //let data = JSON.parse(filedata);
      Lit.Actions.setResponse({ response: textMessage });
  }catch(error)
  {
    Lit.Actions.setResponse({ response: JSON.stringify(error )});
    
  }
  })();`;
}

  



