import React, { lazy, Suspense, useEffect } from 'react'

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


import axios from "axios"
import {server} from "./components/constants/config.js"
import {useDispatch,useSelector} from "react-redux"
import { userExist, userNotExist } from './redux/reducers/auth.js'
import {Toaster} from "react-hot-toast"


import Protectroute from './components/Auth/Protectroute'
import { LayoutLoader } from './components/Layout/Loaders'
import { SocketProvider } from './socket.jsx'
// const user =true;// if user is true then it will show you home page,chat and group else it will redirect to login and vice versa if user is true then it will redirect you form login to home page 
const App = () => {

  const { user, loader } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${server}/api/v1/user/me`, { withCredentials: true });
                // console.log("finding user",response.data)
                dispatch(userExist(response.data));
            } catch (error) {
                console.error("Error fetching user:", error);
                dispatch(userNotExist());
            }
        };

        fetchUser();

  },[dispatch])
  return loader ? <LayoutLoader/>: (
    <BrowserRouter>
     <Suspense fallback={<LayoutLoader/>}>
     <Routes>
        <Route element={<SocketProvider>
          <Protectroute user={user}/>
        </SocketProvider>}>
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
     <Toaster position='bottom-center'/> 
    </BrowserRouter>
  )
}

export default App