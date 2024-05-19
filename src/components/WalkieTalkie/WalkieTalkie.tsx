import React, { useState, useRef, useEffect } from 'react';
import { PhoneIcon } from '@heroicons/react/24/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faWalkieTalkie,faMicrophone}  from '@fortawesome/free-solid-svg-icons'
const WalkieTalkie = ({ onClick }) => {
  const buttonRef = useRef(null);
  const windowRef = useRef(null);
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [minimized, setMinimized] = useState(true);
  const [micColor,setMicColor] = useState("white") 
  const [micButtonColor,setMicButtonColor] = useState("blue")
  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - (minimized ? buttonRef.current.getBoundingClientRect().left : windowRef.current.getBoundingClientRect().left),
      y: e.clientY - (minimized ? buttonRef.current.getBoundingClientRect().top : windowRef.current.getBoundingClientRect().top),
    });
  };

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

  const transmitPressed = (e) =>{
    setMicButtonColor("red")


  }


  const transmitReleased = (e)=>{
    setMicButtonColor("blue")

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
    }else
    {
         setPosition({ x: window.innerWidth - 100, y: window.innerHeight - 100 });

    }
    setMinimized(!minimized);
  };

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
              <FontAwesomeIcon icon={faWalkieTalkie} size="2x" />
        </button>
      ) : (
        <div
          ref={windowRef}
          className="z-[99999] fixed w-[350px] h-[600px] bg-black rounded-lg shadow-lg cursor-move border-2 border-gray-400"
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
          onMouseDown={handleMouseDown}
        >
          <div className="flex justify-between items-center bg-blue-500 text-white p-2 rounded-t-lg">
            <span className="text-lg font-semibold">ChirpCaster</span>
            <button
              className="text-lg font-semibold cursor-pointer"
              onClick={toggleMinimize}
            >
              ✕
            </button>
          </div>

          <div  className="flex justify-center items-center h-full">
            <button
              className={`w-64 h-64 bg-${micButtonColor}-500 rounded-full flex items-center justify-center border-2 border-${micButtonColor}-700`}
              onMouseDown={transmitPressed}
              onMouseUp={transmitReleased}
            >
              <FontAwesomeIcon icon={faMicrophone} size="2x" color={micColor}/>
            </button>
          </div>
         
        </div>
      )}
    </>
  );
};

export default WalkieTalkie;
