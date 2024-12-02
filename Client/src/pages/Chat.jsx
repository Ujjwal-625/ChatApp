import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Blue, graycolor } from '../components/constants/color';
import { ALERT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../components/constants/events';
import FileMenu from '../components/Dialog/FileMenu';
import AppLayout from '../components/Layout/AppLayout';
import MessageComponenet from '../components/Shared/MessageComponenet';
import { InputBox } from '../components/Style/StyledComponent';
import { useErrors, useSocketEvents } from '../hooks/hooks';
import { useGetChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { getSocket } from '../socket';
import {useInfiniteScrollTop} from "6pp"
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from '../redux/reducers/misc';
import { removeNewMessagesAlert } from '../redux/reducers/chat';
import { TypingLoader } from '../components/Layout/Loaders';
import { useNavigate } from 'react-router-dom';



const Chat = ({chatId,user}) => {
  const [iamTyping,setiamTyping]=useState(false);
  const [userTyping,setuserTyping]=useState(false);
  const typingTimout=useRef(null);
  const bottumref=useRef(null);
  const navigate=useNavigate();

  //console.log("user Typing",userTyping);

  const containerRef=useRef(null);
  const Socket =getSocket();
  const dispatch=useDispatch()
  const [message,setMessage]=useState("");
  const [messages,setMessages]=useState([]);
  const [page,setPage]=useState(1);
  const [fileMenuAnchor,setfileMenuAnchor]=useState();
  const chatDetails=useGetChatDetailsQuery({chatId,skip:!chatId})

  const getMessageChunk=useGetMessagesQuery({chatId,page})


  
  const {data:oldMessages,setData:setoldMessages} =useInfiniteScrollTop(containerRef,
    getMessageChunk?.data?.totalPage,
    page,
    setPage,
    getMessageChunk?.data?.message
  )

  let allMessages=[...oldMessages,...messages];
  
  const errors=[
    {
    isError:chatDetails.isError,
    error:chatDetails.error
    },
    {
      isError:getMessageChunk.isError,
      error:getMessageChunk.error
      }
]
 useErrors(errors)
  
  const members=chatDetails?.data?.chat?.members || []

  const submitHandler=(e)=>{
    e.preventDefault()
    if(!message.trim())return ;

    Socket.emit(NEW_MESSAGE,{chatId,members,message})
    setMessage("")
  }


  useEffect(()=>{

    dispatch(removeNewMessagesAlert(chatId))
    return ()=>{
      setMessage("");
    setMessages([]);
    setoldMessages([]);
    setPage(1);
    }
  },[chatId])

  useEffect(()=>{
    if(bottumref){
      bottumref.current.scrollIntoView({behaviour:"smooth"})
    }
  },[messages])

  useEffect(()=>{
    if(!chatDetails.data?.chat){
     return  navigate("/");
    }
  },[chatDetails.data])

  const newMessageListener=useCallback((data)=>{
    if(data.chatId!=chatId)return ;
    setMessages((prev)=>[...prev,data?.message])
  },[chatId])

  const messageOnChange=(e)=>{
    setMessage(e.target.value);
    if(!iamTyping){
    Socket.emit(START_TYPING,{members,chatId});
    setiamTyping(true);
    }

    if(typingTimout.current){
      clearTimeout(typingTimout.current);
    }

    typingTimout.current= setTimeout(()=>{
      Socket.emit(STOP_TYPING,{members,chatId})
      setiamTyping(false);
    },2000)
  }

  const startTypingListener=useCallback((data)=>{
    if(data.chatId!=chatId)return ;
    setuserTyping(true);
  },[chatId])

  const stopTypingListener=useCallback((data)=>{
    if(data.chatId!=chatId)return ;
    // console.log("stop typing",data);
    setuserTyping(false);
  },[chatId])

  const handleFileOpen=(e)=>{
    dispatch(setIsFileMenu(true));
    setfileMenuAnchor(e.currentTarget)
  }
  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );


 const eventObj={ [NEW_MESSAGE]:newMessageListener,
  [START_TYPING]:startTypingListener,
  [STOP_TYPING]:stopTypingListener,
  [ALERT]:alertListener,
 }

 useSocketEvents(Socket,eventObj)

  return (
    <>
      <Stack ref={containerRef}
      boxSizing={"border-box"}
      padding={"1rem"}
      spacing={"1rem"}
      height={"90%"}
      bgcolor={graycolor}
      sx={{
        overflowX:"hidden",
        overflowY:"auto"
      }}
      >
      {/* Message Render */}

      {allMessages.map((i) =>  
        i && (<MessageComponenet key={i._id} message={i} user={user} />)
)}

    {
      userTyping && <TypingLoader />
      
    }

    <div ref={bottumref}/>


      </Stack>

      <form onSubmit={submitHandler} height="10%">
        <Stack direction={"row"} height={"100%"}
        padding={"1rem"}
        position={"relative"}
        alignItems={"center"}
        >
          <IconButton sx={{
            position:"absolute",
            left:"1rem",
            rotate:"30deg",
          }}
          onClick={handleFileOpen}
          >
            <AttachFileIcon/>
          </IconButton>

          <InputBox placeholder='Type Message Here....' value={message} onChange={messageOnChange}/>

          <IconButton type='submit' 
          sx={{
            bgcolor:Blue,
            color:"white",
            marginLeft:"1rem",
            padding:"0.5rem",
            "&:hover":{
              bgcolor:"primary.dark"
            }
          }}>
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </>
  )
}

export default AppLayout()(Chat);