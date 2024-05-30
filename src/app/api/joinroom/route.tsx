import { NextResponse } from 'next/server';
import { AccessToken, Role } from '@huddle01/server-sdk/auth';

export async function POST(request: Request) {
  const { roomId } = await request.json();
  const accessToken = new AccessToken({
    apiKey: process.env.NEXT_PUBLIC_HUDDLE01_API_KEY!,
    roomId: roomId,
    //available roles: Role.HOST, Role.CO_HOST, Role.SPEAKER, Role.LISTENER, Role.GUEST - depending on the privileges you want to give to the user
    role: Role.HOST,
    //custom permissions give you more flexibility in terms of the user privileges than a pre-defined role
    permissions: {
      admin: true,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: false,
        mic: true,
        screen: false,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    },
    
  });
   
  const token = await accessToken.toJwt();

  return NextResponse.json({token});

  
/*try{
const  response = await fetch("https://api.huddle01.com/api/v1/join-room-token", {
 
    method: "POST",
    body:JSON.stringify({
      roomId: roomId,
      userType: "host"
    }),
    headers: {
      "Content-type": "application/json",
      'x-api-key': process.env.NEXT_PUBLIC_HUDDLE01_API_KEY!
    }
    })

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }*/
}
