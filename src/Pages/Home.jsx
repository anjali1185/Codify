import React, { useState } from "react"; 
import logo from "./coding.png"; 
import "./Home.css"; 
import { v4 as uuidV4 } from "uuid"; 
import toast from "react-hot-toast"; 
import { useNavigate } from "react-router-dom"; 
 
export default function Home() { 
  const navigate = useNavigate(); 
  const [roomId, setRoomId] = useState(""); 
  const [username, setUserName] = useState(""); 
 
  const JoinRoom = (e) => { 
    if (!roomId || !username) { 
      toast.error("Room Id or Username missing"); 
      return; 
    } 
    navigate(`/editor/${roomId}`, { 
      state: { 
        username, 
      }, 
    }); 
  }; 
 
  const createNewRoomId = (e) => { 
    e.preventDefault(); 
    const id = uuidV4(); 
    setRoomId(id); 
    console.log(id); 
    toast.success("Created new room"); 
  }; 
 
  const handleEnter = (e) => { 
    if (e.code === "Enter") { 
      JoinRoom(); 
    } 
  }; 
  return ( 
    <div className="homePageWrapper"> 
      <div className="formWrapper"> 
      <div className="logo">
        <img src={logo} alt="" />
        <span id="codify">CODIFY</span>
      </div>
       
        <span className="mainLabel">Paste invitation Room Id below</span> 
        <div className="inputGroup"> 
          <input 
            type="text" 
            className="inputBox" 
            placeholder="Room Id" 
            onChange={(e) => setRoomId(e.target.value)} 
            value={roomId} 
            onKeyUp={handleEnter} 
          /> 
          <input 
            type="text" 
            className="inputBox" 
            placeholder="Username" 
            onChange={(e) => setUserName(e.target.value)} 
            value={username} 
            onKeyUp={handleEnter} 
          /> 
          <button className="btn joinBtn" onClick={JoinRoom}> 
            Join 
          </button> 
          <span className="createInfo"> 
            If you don't have an invitation id then create &nbsp; 
            <a href="#" onClick={createNewRoomId}> 
              new room 
            </a> 
          </span> 
        </div> 
      </div> 
    </div> 
  ); 
}