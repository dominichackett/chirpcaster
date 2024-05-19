import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEnvelope, faUsers,faWalkieTalkie,faMicrophone,faUpload ,faVolumeMute,faVolumeHigh} from '@fortawesome/free-solid-svg-icons';

const WalkieTalkie = ({ onClick }) => {
  const buttonRef = useRef(null);
  const windowRef = useRef(null);
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [minimized, setMinimized] = useState(true);
  const [micColor, setMicColor] = useState("white")
  const [micButtonColor, setMicButtonColor] = useState("bg-blue-500")
  const [selectedTab,setSelectedTab]  = useState(1)
  const [channels,setChannels] = useState([{channelId:1,name:"Main Channel"},{channelId:2,name:"Family"},{channelId:3,name:"54321123456789009876543211234567890"}])
  const [mute,setMute] = useState(false)
  const [users,setUsers] = useState([{
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'Co-Founder / CEO',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },{
    name: 'Leslie Alexander',
    email: 'l1eslie.alexander@example.com',
    role: 'Co-Founder / CEO',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
{
    name: 'L2eslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'Co-Founder / CEO',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
},
{
    name: 'L3eslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'Co-Founder / CEO',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'L4eslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'Co-Founder / CEO',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
},
{
  name: 'L5eslie Alexander',
  email: 'leslie.alexander@example.com',
  role: 'Co-Founder / CEO',
  imageUrl:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}])
  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - (minimized ? buttonRef.current.getBoundingClientRect().left : windowRef.current.getBoundingClientRect().left),
      y: e.clientY - (minimized ? buttonRef.current.getBoundingClientRect().top : windowRef.current.getBoundingClientRect().top),
    });
  };

  const [messages,setMessages] = useState([{type:1,content:"This is a text message"}
  ,{type:2,content: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
,{type:2,content:'/images/chirp.png'},{type:3,content:'/videos/chirp.mp4'}])

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
  }

  const transmitReleased = (e) => {
    setMicButtonColor("bg-blue-500")
  }

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
   
  return (
    <>
      {minimized ? (
        <button
          ref={buttonRef}
          className="z-[99999] fixed flex items-center justify-center w-12 h-12 text-white bg-blue-500 rounded-full shadow-lg cursor-pointer hover:bg-blue-700"
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
    <span className="font-bold text-white mt-4">Channels</span>
    <div className="w-full pt-2 p-4"> 
 
    <select 
            className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
            >
  {channels.map((channel) => (
    <option key={channel.channelId} value={channel.channelId}>
      {channel.name}
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
        <FontAwesomeIcon icon={faMicrophone} size="2x" color={micColor} />
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
        <div
          key={message.type}
          className="mt-4 w-full relative flex flex-col items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
        >
       
          <div className="flex items-center min-w-0 ">
              {message.type == 1 && <p className="text-sm font-medium text-gray-900">{message.content}</p>}
              {message.type == 2 && <p className="text-sm font-medium text-gray-900"><img src={message.content}/></p>}
              {message.type == 3 && <p className="text-sm font-medium text-gray-900"><video src={message.content} controls autoPlay={false}/></p>}

          </div>
          </div>
      ))}
                
    
          </div>} 
          
          {selectedTab==2 &&   
    <div className=" mr-4 ml-4 mt-2 flex items-center justify-between ">
      <input
        type="text"
        placeholder="Type your message here..."
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 flex-1 mr-2"
      />
      <button className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none">
        <FontAwesomeIcon  icon={faUpload} className="w-6 h-6 mr-2" />
      </button>
    </div>}
          { selectedTab==3 && 
          <div className="p-4 overflow-y-auto overflow-x-hidden max-h-[460px]  scrollbar-thumb-black scrollbar-track-white">

             {users.map((user) => (
        <div
          key={user.email}
          className="m-2 w-full relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
        >
            <div className="flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
          </div>
          <div className="min-w-0 flex-1">
            <a href="#" className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
            </a>
          </div>
          </div>
      ))}
          </div>}
          <div className="flex justify-between p-4 absolute bottom-0 left-0 w-full bg-bg-color text-white rounded-b-lg">
            <button onClick={()=>setSelectedTab(1)} className={selectedTab == 1 ? `text-red`:`text-white hover:text-red`} title="Home">
              <FontAwesomeIcon icon={faHome} size="2x"  />
            </button>
            <button onClick={()=>setSelectedTab(2)} className={selectedTab == 2 ? `text-red`:`text-white hover:text-red`} title="Messages">
              <FontAwesomeIcon icon={faEnvelope} size="2x" />
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
