import React, { lazy, Suspense } from 'react'

import {BrowserRouter,Routes,Route} from "react-router-dom"

//lazy will import the componenet only when it is required

const Home=lazy(()=>import("./pages/Home"))
const Login=lazy(()=>import("./pages/Login"))
const Group=lazy(()=>import("./pages/Group"))
const Chat=lazy(()=>import("./pages/Chat"))
const NotFound=lazy(()=>import("./pages/NotFound"))
const AdminLogin=lazy(()=>import("./pages/Admin/AdminLogin"));
const Usermanagment =lazy(()=>import("./pages/Admin/Usermanagment"))
const Chatmanagment =lazy(()=>import("./pages/Admin/Chatmanagment"))
const Messagemanagment =lazy(()=>import("./pages/Admin/Messagemanagment"))
const  Dashboard=lazy(()=>import("./pages/Admin/Dashboard"));



import Protectroute from './components/Auth/Protectroute'
import { LayoutLoader } from './components/Layout/Loaders'
const user =true;// if user is true then it will show you home page,chat and group else it will redirect to login and vice versa if user is true then it will redirect you form login to home page 
const App = () => {
  return (
    <BrowserRouter>
     <Suspense fallback={<LayoutLoader/>}>
     <Routes>
        <Route element={<Protectroute user={user}/>}>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/group' element={<Group/>}></Route>
          <Route path='/chat/:chatid' element={<Chat/>}></Route>
        </Route>

        <Route path ="/login" element={<Protectroute user={!user} redirect='/'> <Login/> </Protectroute>}>
        </Route>

        <Route path="/admin" element={<AdminLogin/>}></Route>
        <Route path="/admin/user-managment" element={<Usermanagment/>}></Route>
        <Route path="/admin/Chat-managment" element={<Chatmanagment/>}></Route>
        <Route path="/admin/Message-managment" element={<Messagemanagment/>}></Route>

        <Route path="/admin/dashboard" element={<Dashboard/>}></Route>
      <Route path='*' element={<NotFound/>}></Route>
      </Routes>
     </Suspense>
    </BrowserRouter>
  )
}

export default App