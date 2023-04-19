import React, { useEffect, useRef, useState } from 'react' 
import Client from '../Components/Client'; 
import EditorComponent from '../Components/EditorComponent'; 
import './Editor.css'; 
import { initSocket } from '../Socket'; 
import ACTIONS from '../Actions'; 
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'; 
import toast from 'react-hot-toast'; 
 
export default function Editor() { 
  const socketRef = useRef(null);  
  const codeRef = useRef(null); 
  const location  = useLocation(); 
  const {roomId} = useParams(); 
 
  const [clients, setClients] = useState([]); 
 
  const reactNavigator = useNavigate(); 
 
  useEffect(() => { 
    const init = async()=>{ 
      socketRef.current = await initSocket(); 
      socketRef.current.on('connect_error',(err)=>handleErrors(err)); 
      socketRef.current.on('connect_failed',(err)=>handleErrors(err)); 
 
      function handleErrors(e){ 
        console.log('socket error', e); 
        toast.error('Socket connection failed, try again later.'); 
        reactNavigator('/'); 
      } 
 
 
      socketRef.current.emit(ACTIONS.JOIN, { 
        roomId, 
        username: location.state?.username 
      }); 
 
      //Listening for joining 
 
      socketRef.current.on(ACTIONS.JOINED, ({clients, username, socketId})=>{ 
        if(username !== location.state?.username){ 
          toast.success(`${username} joined the room !`); 
        } 
        console.log(clients); 
        setClients(clients); 
        socketRef.current.emit(ACTIONS.SYNC_CODE, { 
          code: codeRef.current, 
          socketId 
        }); 
      }) 
 
      //Listener for disconnection 
 
      socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, username})=>{ 
        toast.success(`${username} left the room`); 
        setClients((prev)=>{ 
          return prev.filter(client => client.socketId !== socketId) 
        }) 
      }) 
 
    } 
    init(); 
    return ()=>{ 
      socketRef.current.disconnect(); 
      socketRef.current.off(ACTIONS.JOINED); 
      socketRef.current.off(ACTIONS.DISCONNECTED); 
    }; 
  }, []); 
 
  async function copyId(){ 
    try { 
      await navigator.clipboard.writeText(roomId); 
      toast.success(`Room id ${roomId} copied to clipboard`); 
    } catch (err) { 
      toast.error(`Error in copying room id`); 
    } 
  } 
 
  function leaveRoom(){ 
    reactNavigator('/'); 
  } 
 
  if(!location.state){ 
    return <Navigate to="/" /> 
  } 
 
 
  return ( 
    <div className='mainWrap'> 
      <div className="sideBar"> 
        <div className="innerSideBar"> 
          <div className="logo"> 
          </div> 
          <span className='connected'>Connected Users : </span> 
          <div className="clientsList"> 
            { 
              clients.map(client=>(<Client key={client.socketId} username={client.username} />)) 
            } 
          </div> 
        </div> 
        <button className='btn copyBtn' onClick={copyId}>Copy Room Id</button> 
        <button className='btn leaveBtn' onClick={leaveRoom}>Leave Room</button> 
      </div> 
      <div className="editorWrap"> 
        <EditorComponent socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current = code;}} /> 
      </div> 
    </div> 
  ) 
}