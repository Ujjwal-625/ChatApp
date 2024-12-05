import { Menu, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { setIsDeleteMenu, setIsDeleteMessage } from '../../redux/reducers/misc'
import {useDispatch, useSelector } from 'react-redux'
import { Delete as DeleteIcon, ExitToApp as ExitToAppIcon} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAsyncMutation } from '../../hooks/hooks'
import { useDeleteChatMutation } from '../../redux/api/api'

const DeleteMessageMenu = ({deleteMessageAnchor}) => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {isDeleteMessage}=useSelector(state=>state.misc);
    const [deleteChat,_,data]=useAsyncMutation(useDeleteChatMutation);
    const closeHandler=()=>{
        dispatch(setIsDeleteMessage(false));
        deleteMessageAnchor.current=null; 
    }
    const DeleteMessageHandler=()=>{
        closeHandler();
        deleteChat("Removing Friend",selectedDeleteChat.chatId)
    }
  return (
    <Menu
    open={isDeleteMessage}
    onClose={closeHandler}
    anchorEl={deleteMessageAnchor?.current}
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
      onClick={DeleteMessageHandler}
    >
     (
          <>
            <DeleteIcon />
            <Typography>Delete Message</Typography>
          </>
          )
    </Stack>
  </Menu>
  )
}

export default DeleteMessageMenu;