import { chirpCasterAddress } from "@/contracts/contracts";
import { sign } from "crypto";
let createRoomURL = "https://api.huddle01.com/api/v1/create-room"
let joinRoomURL = "https://api.huddle01.com/api/v1/join-room-token"

export const createRoom = async(signer:any,name:string)=>
{  
     
    
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
    
     
 

 
  
 
     return roomId
   
}



export const getAccessToken = async(roomId:string)=>
{  
     
    let accessToken

     const response = await fetch("/api/joinroom", {
        method: "POST",
        body: JSON.stringify({
          roomId:roomId
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

      if (responseData?.token ) {
         accessToken = responseData;
      } else {
        throw new Error(responseData.message || 'Error joining room');
      }
    
     
 

 
  
 
     return accessToken
   
}