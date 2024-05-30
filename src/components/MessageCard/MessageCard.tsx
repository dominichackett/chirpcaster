import { TPeerMetadata } from '@/utils/types';

import { useRemotePeer,useLocalPeer } from '@huddle01/react/hooks';

interface Props {
  
  message:{payload: string, from: string, label?: string,time:number};
  localPeer:string;
  profile:{displayName:string,profilepic:string}
}

function MessageCard({ message,localPeer,profile }: Props) {
  const { metadata } = useRemotePeer<TPeerMetadata>({ peerId: message.from });
  console.log(localPeer)
  
  if(message.label == "message")
  return (
    <div
    key={message.time}
    className="mt-4 w-full relative flex flex-col rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
  >
    <div className="flex items-start space-x-3">
      <img
        src={message.from == localPeer ? profile?.profilepic :metadata?.profilepic} // URL of the sender's profile picture
        alt={message.from == localPeer ? "You" :metadata?.displayName}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex flex-col">
        <p className="text-sm font-medium text-gray-900">{message.from == localPeer ? "You" :metadata?.displayName}</p>
        <p className="text-sm text-gray-500">{message?.payload}</p>
      </div>
    </div>
  </div>
  


  );

  if(message.label == "image")
  return (

    <div
    key={message.time}
    className="mt-4 w-full relative flex flex-col items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
  >
    <div>
     <p className="text-sm font-medium text-gray-900"><img src={message.payload}/></p>
 
    </div>
    </div>

  );

  if(message.label == "video")
  return (

    <div
    key={message.time}
    className="mt-4 w-full relative flex flex-col items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
  >
    <div>
     <video src={message.content} controls autoPlay={false}/> 
  </div>
  </div>

  );
}

export default MessageCard;