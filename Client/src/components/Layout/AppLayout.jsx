import React, { useCallback, useEffect, useRef } from "react";
import Header from "./Header";
import Title from "../Shared/Title";
import ChatList from "../specific/ChatList";
import { Drawer, Grid, Skeleton } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import { useMyChatsQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from "../../redux/reducers/misc";
import { useErrors, useSocketEvents } from "../../hooks/hooks";
import { getSocket } from "../../socket";
import { NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS } from "../constants/events";
import { incrementNotification, setNewMessagesAlert } from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../libs/features";
import DeleteChatMenu from "../Dialog/DeleteChatMenu";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const navigate=useNavigate();
    const chatId = params.chatid;
    const deleteMenuAnchor=useRef(null);

    const Socket=getSocket();
    const {isMobile}=useSelector((state)=>state.misc);
    const {user}=useSelector((state)=>state.auth);
    const dispatch=useDispatch();

    function handleDeleteChat(e, chatId, groupChat) {
      dispatch(setIsDeleteMenu(true));
      deleteMenuAnchor.current=e.currentTarget;
      dispatch(setSelectedDeleteChat({chatId,groupChat}))
      // console.log("Chat deleted",_id,groupChat);
    }
    const {newMessagesAlert}=useSelector((state)=>state.chat);
    
    const {isLoading,data,isError,error,refetch} =useMyChatsQuery("")

    const handleMobileClose=()=> dispatch(setIsMobile(false));

    useErrors([{error,isError}]);// custom hook for printing errors
    

    useEffect(()=>{
      getOrSaveFromStorage({key:NEW_MESSAGE_ALERT,value:newMessagesAlert})
    },[newMessagesAlert])

    const newMessageAlertHandler=useCallback((data)=>{
      const sdf=data.chatId;
      if(sdf===chatId)return ;
      dispatch(setNewMessagesAlert(data));
      console.log("new Message Alert",sdf);
    },[chatId]);

    const newRequestListener=useCallback(()=>{
      dispatch(incrementNotification());
    },[dispatch]);

    const refetchListener=useCallback(()=>{
      refetch();
      navigate("/");
    },[refetch,navigate]);

    const eventObj={
       [NEW_MESSAGE_ALERT]:newMessageAlertHandler,
       [NEW_REQUEST]:newRequestListener,
       [REFETCH_CHATS]:refetchListener,
      }
    
    useSocketEvents(Socket,eventObj)
    return (
      <div>
        <Title />
        <Header />

        <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor} />

        {
          <Drawer open={isMobile} onClose={handleMobileClose}>
            {isLoading ? <Skeleton/>:
          <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
            />}
          </Drawer>

        }

        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
          >
            {
              isLoading?<Skeleton/>:
              <ChatList
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
            />
            }
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
            height={"100%"}
          >
            <Profile user={user}/>
          </Grid>
        </Grid>
      </div>
    );
  };
};

export default AppLayout;
