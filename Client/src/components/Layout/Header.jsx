import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { Suspense, useEffect, useState } from 'react'
import { Blue } from '../constants/color'
import {Add as AddIcon, Group as GroupIcon, Menu as MenuIcon, Search as SearchIcon,Logout as LogoutIcon, Notifications as NotificationIcon} from "@mui/icons-material"
import {useNavigate} from "react-router-dom";
import { lazy } from 'react';
import axios from 'axios';
import { server } from '../constants/config';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { userNotExist } from '../../redux/reducers/auth';
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc';
import { resetNotificationCount } from '../../redux/reducers/chat';

const SearchDialog=lazy(()=>import("../specific/Search"))
const NotificationDialog=lazy(()=>import("../specific/Notification"));
const GroupDialog=lazy(()=>import("../specific/NewGroup"));


const Header = () => {
  const dispatch=useDispatch()

  const {isSearch,isNotification,isNewGroup} =useSelector(state=>state.misc)
  const {notificationCount} =useSelector(state=>state.chat)

const navigate=useNavigate();

function handleMobile(){
  dispatch(setIsMobile(true));
}
function openSearch(){
  dispatch(setIsSearch(true));
}
function openNewGroup(){
  dispatch(setIsNewGroup(true));
}
function navigateToGroup(){
  navigate("/group");
}

function openNotification(){
  dispatch(setIsNotification(true));
  dispatch(resetNotificationCount());
}

async function LogoutHandler(){

  try {
    const {data}=await axios.get(`${server}/api/v1/user/logout`,{withCredentials:true});
    dispatch(userNotExist())
    toast(data.message);
  } catch (error) {
    toast(error?.response?.data?.message ||"something went wrong");
  }

}
  return (
    <>
    <Box sx={{flexGrow:1}} height={"4rem"}>
      <AppBar position='static' sx={{
        bgcolor:Blue
      }}>
        <Toolbar>
          <Typography variant='h6'
          sx={{display :{xs:"none" ,sm:"block"}}}>
            Chat App
          </Typography>

          {/* by applying this we are adding functionality for the small screen */}
          <Box sx={{display :{xs:"block" ,sm:"none"}}}>
            <IconButton color='inherit' onClick={handleMobile}>
              <MenuIcon/>
            </IconButton>
          </Box>
          {/* now this box will cover whole part between upper and below boxes */}
          <Box sx={{flexGrow:1}}/>

          <Box>
            {/* here we will be adding many icons */}
            {/* <Tooltip title="Search">
            <IconButton color='inherit' size='large' onClick={openSearchDialog}>
              <SearchIcon/>
            </IconButton>
            </Tooltip>
            it is replaced by our component */}

            <IconBtn title={"Search"} icon={<SearchIcon/>} onClick={openSearch}/>
            <IconBtn title={"New Group"} icon={<AddIcon/>} onClick={openNewGroup}/>
            <IconBtn title={"Manage Group"} icon={<GroupIcon/>} onClick={navigateToGroup}/>
            <IconBtn title={"Notifications"} icon={<NotificationIcon/>} onClick={openNotification} value={notificationCount}/>
            <IconBtn title={"Logout"} icon={<LogoutIcon/>} onClick={LogoutHandler}/>
            
             {/* by using tooltip on hovering over the icon title of the tooltip will be displayed */}
            
          </Box>
        </Toolbar>

      </AppBar>
    </Box>

    {isSearch && 
    <Suspense fallback={<Backdrop open/>}>
      <SearchDialog/>
    </Suspense>
    }
    {isNewGroup && 
    <Suspense fallback={<Backdrop open/>}>
      <GroupDialog/>
    </Suspense>
    }
    {isNotification && 
    <Suspense fallback={<Backdrop open/>}>
      <NotificationDialog/>
    </Suspense>
    }
    </>
  )
}


const IconBtn=({title,icon,onClick,value})=>{
  return (
    <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={onClick}>
              {value ? <Badge badgeContent={value} color="error">{icon}</Badge>:icon}
            </IconButton>
            </Tooltip>
  )

}

export default Header