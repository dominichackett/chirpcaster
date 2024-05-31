import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faComments, faUsers,faWalkieTalkie,faMicrophone,faUpload ,faVolumeMute,faVolumeHigh,faWifi,faWifiStrong} from '@fortawesome/free-solid-svg-icons';
import { useEthersSigner } from '@/signer/signer'
import { useAccount} from 'wagmi'
import { getAccessToken } from '@/utils/huddle';
import { ethers } from 'ethers';
import { chirpCasterABI,chirpCasterAddress } from '@/contracts/contracts';
import { useRoom ,useLocalAudio, usePeerIds,useLocalPeer,useActivePeers,useDataMessage } from '@huddle01/react/hooks';
import UserAudio from '../UserAudio/UserAudio';
import { TPeerMetadata } from '@/utils/types';
import UserCard from '../UserCard/UserCard';
import MessageCard from '../MessageCard/MessageCard' 
import { decryptMessage,encryptMessage,encryptText,decryptText } from '@/litprotocol/lit';
import { base64StringToBlob } from '@lit-protocol/lit-node-client';
import { uploadToIPFS } from '@/fleek/fleek';
import { JsonToBuffer } from '@/utils/utils';
import { base64ToURL,getFileExtension } from '@/utils/utils';
 const WalkieTalkie = ({ refreshData,profile }) => {
  const signer = useEthersSigner()
  const account = useAccount()
  const { stream:localStream, enableAudio, disableAudio, isAudioOn } = useLocalAudio();
  const { peerId,updateMetadata } = useLocalPeer<TPeerMetadata>( {onMetadataUpdated: (data:any) => {console.log(data)}});
  const { peerIds } = usePeerIds();
  const [selectedFile, setSelectedFile] = useState()
  const filename = useRef()
  
  const buttonRef = useRef(null);
  const windowRef = useRef(null);
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [minimized, setMinimized] = useState(true);
  const [micColor, setMicColor] = useState("white")
  const [micButtonColor, setMicButtonColor] = useState("bg-blue-500")
  const [selectedTab,setSelectedTab]  = useState(1)
  const [channels,setChannels] = useState([])
  const [mute,setMute] = useState(false)
  const [channel,setChannel]  = useState("-1")
  const [isTransmitting,setIsTransmitting] = useState(false)
  const [isReceiving,setIsReceiving] = useState(false)
  const [channelConnected,setChannelConnected] = useState(false)
  const [channelTokenId,setChannelTokenId] = useState()
  const [channelTokens,setChannelTokens]  = useState(new Map())
  const {
    sendData
  } = useDataMessage({
    onMessage: (payload: string, from: string, label?: string)=>messageReceived(payload ,from, label)
  });
 
  const {
    room,
    state,
    joinRoom,
    leaveRoom,
    closeRoom,
    kickPeer,
    muteEveryone,
    closeStreamOfLabel,
  } = useRoom({ onJoin: (data:any) =>OnJoinChannel("Channel"),onLeave:(data)=> OnLeaveChannel(data)
  ,onFailed: (data)=> failedToJoin(data), onWaiting:(data)=>waitingToJoin(data),onPeerJoin:(data)=>peerJoined(data)} )

  const {
    activePeerIds,
    dominantSpeakerId,
  } = useActivePeers()
const failedToJoin = async(data:any)=>
{
   console.log(data)
}
const peerJoined = async(data:any)=>{
   console.log(data)
   console.log("Peer Joined")
  
}
const waitingToJoin = async(data:any)=>{
    console.log(data)
    console.log("waiting")
}
 
  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - (minimized ? buttonRef.current.getBoundingClientRect().left : windowRef.current.getBoundingClientRect().left),
      y: e.clientY - (minimized ? buttonRef.current.getBoundingClientRect().top : windowRef.current.getBoundingClientRect().top),
    });
  };

  const [_messages,_setMessages] = useState([{type:1,content:"This is a text message"}
  ,{type:2,content: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
,{type:2,content:'/images/chirp.png'},{type:3,content:'/videos/chirp.mp4'}])
const [messages,setMessages] = useState([])
  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      const element = minimized ? buttonRef.current : windowRef.current;
      setPosition({
        x: Math.max(0, Math.min(newX, window.innerWidth - element.offsetWidth)),
        y: Math.max(0, Math.min(newY, window.innerHeight - element.offsetHeight)),
      });
    }
  };

  const transmitPressed = (e) => {
    setMicButtonColor("bg-red-500")
    setIsTransmitting(true)
    enableAudio()
  }

  const transmitReleased = (e) => {
    setMicButtonColor("bg-blue-500")
    setIsTransmitting(false)
    sendData({to:"*",payload:"End Transmission",label:"End Transmission"}); //send message to peers to signal end of transmission
    disableAudio()
  }

  useEffect(()=>{          
    if(activePeerIds.length >0)
    {
       if(activePeerIds[0] != peerId)
      {
         setMicButtonColor("bg-green-500")
         setIsReceiving(true)
      }
    }else
    {
        if(!isTransmitting)
          setMicButtonColor("bg-blue-500")
    }
    console.log(activePeerIds)
    
  },[activePeerIds])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset]);

  useEffect(() => {
    const handleResize = () => {
      const element = minimized ? buttonRef.current : windowRef.current;
      setPosition({
        x: Math.min(position.x, window.innerWidth - element.offsetWidth),
        y: Math.min(position.y, window.innerHeight - element.offsetHeight),
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [position, minimized]);

  const toggleMinimize = () => {
    if (minimized) {
      setPosition({
        x: Math.max(0, Math.min(position.x, window.innerWidth - 400)),
        y: Math.max(0, Math.min(position.y, window.innerHeight - 600)),
      });
    } else {
      setPosition({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
    }
    setMinimized(!minimized);
  };

  const toggleMute = ()=>{
     setMute(!mute) 
  }
   const connectToChannel = async(e:any)=>{

    console.log(process.env.NEXT_PUBLIC_HUDDLE01_API_KEY)

    if(e.target.value == "-1")
    {
        setChannel("-1")
        leaveRoom()
        return
    }

    setChannel(e.target.value)
    console.log(channelTokens.get(e.target.value))
    setChannelTokenId(channelTokens.get(e.target.value))

    try
   { const accessToken = await getAccessToken(e.target.value)
    console.log(accessToken)

   // if(!isAudioOn)
    //enableAudio()
     const x = await joinRoom({roomId:e.target.value,token:accessToken.token})
     console.log(x)
   }catch(error)
   { console.log(error)
   }
  
  }


  const messageReceived =async(payload: string, from: string, label?: string)=>{
    if(label=="End Transmission" && isReceiving)
      {
         setIsReceiving(false)
         setMicButtonColor("bg-blue-500")
      }
      if(label=="message")
      {
        const _data = JSON.parse(payload)  
        const textMessage = await decryptText(_data.ciphertext,_data.dataToEncryptHash)
        console.log(textMessage)
        setMessages([...messages,{payload:textMessage.response,from:from,label:label,time:new Date().getTime()}])
          console.log("Message")
     }
     if(label=="image" || label == "video")
     {  
                 
      try{
      const data = JSON.parse(payload) 
      const  res = JSON.parse(await decryptMessage(data.url,data.dataToEncryptHash))
      const filedata = base64StringToBlob(res.file)
      const url = URL.createObjectURL(filedata)


      setMessages([...messages,{payload:url,from:from,label:res.filetype,time:new Date().getTime()}])
      }catch(error)
      {
        console.log(error)

      }
     }
  }

  const OnJoinChannel = async(channel:any)=>{


   setChannelConnected(true)
    console.log(channel)
    console.log("join")
    updateMetadata({displayName:profile?.displayName,profilepic:profile?.profilepic})
  }

  const OnLeaveChannel = async(data:any)=>{
    setChannelConnected(false)
    setMessages([])
    console.log(data)
    console.log("leave")
  }
   
useEffect(()=>{
  async function getChannels(){
 
     const contract = new ethers.Contract(chirpCasterAddress,chirpCasterABI,signer)
     const _channels = await contract.getMyChannels() 
     for(const _channel in _channels)
     {
         channelTokens.set(_channels[_channel].channelId,_channels[_channel].tokenId.toNumber());
     }
     console.log(_channels)
     setChannels(_channels)
  }
  if(account?.address && signer)
    getChannels() 
 
 },[account?.address,signer,refreshData])

 const handleKeyDown  = async(event) =>{
    if(event.key ==="Enter")
    {
        const _data = document.getElementById("textInput").value 
        if(_data.length > 0)
        {
           console.log(_data)
           if(channelConnected)
           {
                
               const {ciphertext,dataToEncryptHash} = await encryptText(_data) 
                const payload = JSON.stringify({ciphertext,dataToEncryptHash}) 
                sendData({to:"*",payload:payload,label:"message"})
             document.getElementById("textInput").value = ""
 
          }
        }
    }


 }

 const onSelectFile = async(e) => {
  if (!e.target.files || e.target.files.length === 0 || !channelConnected) {
      return
  }

  // I've kept this example simple by using the first image instead of multiple
  setSelectedFile(e.target.files[0])
  
   const _filename = e.target.files[0].name
    let fileType
    const input = e.target;
    const file = input.files[0];
    const _fileType = file.type;

    console.log('Selected file type:', _fileType);

    if (_fileType.startsWith('image/')) {
      console.log('The selected file is an image.');
      fileType="image"
    } else if (_fileType.startsWith('video/')) {
      console.log('The selected file is a video.');
      fileType="video"
    } else {
      console.log('The selected file is neither an image nor a video.');
      return
    }

    const {ciphertext,dataToEncryptHash} = await encryptMessage(file,_filename,fileType)
    const fileInfo = {ciphertext:ciphertext,dataToEncryptHash:dataToEncryptHash}
    const result = await  uploadToIPFS("profile.json",JsonToBuffer(fileInfo))
    //console.log(await result.json())
    
     const cid =result.cid.toV1().toString()
     const url = `https://${cid}.ipfs.cf-ipfs.com`
    const payload = JSON.stringify({url:url,dataToEncryptHash:dataToEncryptHash})
    sendData({to:"*",payload:payload,label:fileType})
  
}

  return (
    <>

            {peerIds.map((peerId) =>
              peerId ? <UserAudio  key={peerId} peerId={peerId} mute={mute} /> : null
            )}
      {minimized ? (
        <button
          ref={buttonRef}
          className={`${micButtonColor} z-[99999] fixed flex items-center justify-center w-12 h-12 text-white bg-blue-500 rounded-full shadow-lg cursor-pointer hover:bg-blue-700`}
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
          onMouseDown={handleMouseDown}
          onClick={toggleMinimize}
        >
                        <FontAwesomeIcon icon={faWalkieTalkie} size="2x" color="white" />

        </button>
      ) : (
        <div
          ref={windowRef}
          className="z-[99999] fixed w-[350px] h-[600px] bg-black rounded-lg shadow-lg cursor-move border-2 border-gray-400"
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
          onMouseDown={handleMouseDown}
        >
          <div className="flex justify-between items-center bg-bg-color text-white p-2 rounded-t-lg">
         <div className="flex items-center">
          <div className="h-11 w-11 flex-shrink-0 mr-2">
                          <img className="h-11 w-11 rounded-full" src="/images/chirp.png" alt="" />
                        </div>
            <span className="text-lg font-semibold">ChirpCaster</span>
            </div> 
            <button
              className="text-lg font-semibold cursor-pointer"
              onClick={toggleMinimize}
            >
              ✕
            </button>
          </div>
          {selectedTab === 1 && (
  <div className="flex flex-col justify-start items-center h-full">
    <div className="flex  justify-start items-center ">
    <span className="font-bold text-white mt-4 pr-2">Channels</span>
    {channelConnected && <FontAwesomeIcon icon={faWifiStrong}  color="lightgreen" />}
    {!channelConnected && <FontAwesomeIcon icon={faWifi}  color="red" />}


    </div>
    <div className="w-full pt-2 p-4"> 

    <select value={channel}
            className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
       onChange={connectToChannel}
       >
        {channel == "-1" && <option key={"-1"} value="-1"> Select Channel </option>}
        {channel != "-1" && <option key={"-1"} value="-1"> Click to Disconnect </option>}
  {channels.map((_channel) => (
    <option key={_channel.channelId} value={_channel.channelId}>
      {_channel.name}
    </option>
  ))}
</select>
</div>
    
    <div className="flex flex-col justify-center items-center mt-12"> {/* Adjust the margin top as needed */}
      <button
        className={`w-64 h-64 ${micButtonColor} rounded-full flex items-center justify-center border-2 border-white`}
        onMouseDown={transmitPressed}
        onMouseUp={transmitReleased}
      >
       {micButtonColor =="bg-blue-500" && <FontAwesomeIcon icon={faMicrophone} size="2x" color={micColor} />}
       {micButtonColor =="bg-green-500" && <FontAwesomeIcon icon={faVolumeHigh} size="2x" color={micColor} />}

      </button>

      <div className=" flex mt-4 w-full bg-bg-red cursor-pointer">
                  <FontAwesomeIcon onClick={()=>toggleMute()}  icon={mute ? faVolumeMute:faVolumeHigh} color={mute ? "red": "white"}/>   
            </div>
    </div>
  </div>
)}
           
          
           { selectedTab==2 && 
          <div className="p-6 overflow-y-auto overflow-x-hidden max-h-[400px] h-[400px]  scrollbar-thumb-black scrollbar-track-white">

             {messages.map((message,index) => (
        <MessageCard key={message.time} message={message} localPeer={peerId} profile={profile} />
      ))}
                
    
          </div>} 
          
          {selectedTab==2 &&   
    <div className=" mr-4 ml-4 mt-2 flex items-center justify-between ">
      <input
        type="text"
        id="textInput"
        placeholder="Type your message here..."
        onKeyDown={handleKeyDown}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 flex-1 mr-2"
      />
    <label for='uploadfile'>  <span className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 focus:outline-none"
      >
        <FontAwesomeIcon  icon={faUpload} className="w-6 h-6 mr-2" />
      </span></label>
      <input
                       type="file"
                      name="uploadfile"
                      id="uploadfile"
                      className="sr-only"
                      onChange={onSelectFile}
                    />
                    
    </div>}
          { (selectedTab==3 && peerIds.length >0)  && 
          <div className="p-4 overflow-y-auto overflow-x-hidden max-h-[460px]  scrollbar-thumb-black scrollbar-track-white">

             {peerIds.map((peerId) => (
          peerId ? <UserCard  key={peerId} peerId={peerId} /> : null
      ))}
          </div>}
          <div className="flex justify-between p-4 absolute bottom-0 left-0 w-full bg-bg-color text-white rounded-b-lg">
            <button onClick={()=>setSelectedTab(1)} className={selectedTab == 1 ? `text-red`:`text-white hover:text-red`} title="Home">
              <FontAwesomeIcon icon={faHome} size="2x"  />
            </button>
            <button onClick={()=>setSelectedTab(2)} className={selectedTab == 2 ? `text-red`:`text-white hover:text-red`} title="Messages">
              <FontAwesomeIcon icon={faComments} size="2x" />
            </button>
            <button onClick={()=>setSelectedTab(3)} className={selectedTab == 3 ? `text-red`:`text-white hover:text-red`} title="Users">
              <FontAwesomeIcon icon={faUsers} size="2x"  />
            </button>
          </div>
          
        </div>
      )}
    </>
  );
};

export default WalkieTalkie;
