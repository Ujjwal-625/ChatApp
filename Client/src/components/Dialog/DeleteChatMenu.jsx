import { Menu, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { setIsDeleteMenu } from '../../redux/reducers/misc'
import { useSelector } from 'react-redux'
import { Delete as DeleteIcon, ExitToApp as ExitToAppIcon} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAsyncMutation } from '../../hooks/hooks'
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api/api'

const DeleteChatMenu = ({dispatch,deleteMenuAnchor}) => {
    const navigate=useNavigate();
    const {isDeleteMenu,selectedDeleteChat}=useSelector(state=>state.misc);
    const [deleteChat,_,data]=useAsyncMutation(useDeleteChatMutation);
    const [leaveGroup,__,leavegroupData]=useAsyncMutation(useLeaveGroupMutation);
    const closeHandler=()=>{
        dispatch(setIsDeleteMenu(false));
        deleteMenuAnchor.current=null; 
    }
    const leaveGroupHandler=()=>{
        closeHandler();
        leaveGroup("Leaving Group",selectedDeleteChat.chatId)
    }
    const removeFriendHandler=()=>{
        closeHandler();
        deleteChat("Removing Friend",selectedDeleteChat.chatId)
    }
    useEffect(()=>{
        if(data){
            navigate("/");
        }
        if(leavegroupData){
            navigate("/");
        }
    },[data,leavegroupData])
  return (
    <Menu
    open={isDeleteMenu}
    onClose={closeHandler}
    anchorEl={deleteMenuAnchor?.current}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "center",
      horizontal: "center",
    }}
  >
    <Stack
      sx={{
        width: "10rem",
        padding: "0.5rem",
        cursor: "pointer",
      }}
      direction={"row"}
      alignItems={"center"}
      spacing={"0.5rem"}
      onClick={selectedDeleteChat.groupChat ? leaveGroupHandler : removeFriendHandler}
    >
      {
        selectedDeleteChat.groupChat?
        (<>
        
            <ExitToAppIcon />
            <Typography>Leave Group</Typography>
          </>
        ) : (
          <>
            <DeleteIcon />
            <Typography>Remove Friend</Typography>
          </>)
    }
    </Stack>
  </Menu>
  )
}

export default DeleteChatMenu