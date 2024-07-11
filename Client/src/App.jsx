import React, { lazy } from 'react'
import {BrowserRouter,Routes,Route} from "react-router-dom"

//lazy will import the componenet only when it is required
const Home=lazy(()=>import("./pages/Home"))
const Login=lazy(()=>import("./pages/Login"))
const Group=lazy(()=>import("./pages/Group"))
const Chat=lazy(()=>import("./pages/Chat"))
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/group' element={<Group/>}></Route>
        <Route path='/chat/:chatid' element={<Chat/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App