import {
    useRemoteAudio,
    
  } from '@huddle01/react/hooks';
  import React, { useEffect, useRef } from 'react';
  
  type Props = {
    peerId: string;
    mute:boolean;
  };
  
  const UserAudio = ({ peerId,mute }: Props) => {
    const { stream: audioStream, state: audioState } = useRemoteAudio({ peerId });
  
    const audioRef = useRef<HTMLAudioElement>(null);
  
    
  
    useEffect(() => {
      if (audioStream && audioRef.current && audioState === 'playable') {
        audioRef.current.srcObject = audioStream;
  
        audioRef.current.onloadedmetadata = async () => {
          try {
            if(!mute)
            audioRef.current?.play();
          } catch (error) {
            console.error(error);
          }
        };
  
        audioRef.current.onerror = () => {
          console.error('AudioCard() | Error is hapenning...');
        };
      }
    }, [audioStream]);
  
     if(mute)
       return null
    if(!mute)
    return (
        <audio ref={audioRef} autoPlay></audio>
    
    );
  };
  
  export default React.memo(UserAudio);