import React from 'react' 
import Editor from './Pages/Editor' 
import Home from './Pages/Home' 
import {BrowserRouter, Routes, Route} from 'react-router-dom'; 
import { Toaster } from 'react-hot-toast'; 
 
export default function App() { 
  return ( 
    <> 
    <Toaster 
    position='top-right' 
    toastOptions={{ 
      success: { 
        theme: { 
          primary: '#4aed88' 
        }, 
      }, 
    }} 
    ></Toaster> 
      <BrowserRouter> 
      <Routes> 
        <Route path='/' element={<Home />}></Route> 
        <Route path='/editor/:roomId' element={<Editor />}></Route> 
      </Routes> 
      </BrowserRouter> 
    </> 
  ) 
}