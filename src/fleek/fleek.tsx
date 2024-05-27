import { FleekSdk, ApplicationAccessTokenService } from '@fleekxyz/sdk';

const applicationService = new ApplicationAccessTokenService({
    clientId: process.env.NEXT_PUBLIC_FLEEK_CLIENTID
})

const fleekSdk = new FleekSdk({ accessTokenService: applicationService })

 export const project = async()=>{
  const projects = await fleekSdk.projects().list();
  return projects
}


// fleekSdk is an authenticated instance of FleekSDK
// with a selected projectId

export const uploadToIPFS = async (filename: string, content: Buffer) => {
  const result = await fleekSdk.ipfs().add({
      path: filename,
      content: content,
  })
  
  return result
}

