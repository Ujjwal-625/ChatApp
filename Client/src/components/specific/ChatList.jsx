import React from 'react'
import { Stack } from '@mui/material'
import ChatItem from '../Shared/ChatItem'
import {bggradient} from "../constants/color"
  
const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
  user,
}) => {

  // console.log("online Users",onlineUsers);
  const userId=user?.data?._id || user?._id;
  // console.log("userID",userId);
  return (
    <Stack width={w} direction={"column"} overflow={"auto"} height={"100%"} sx={{backgroundImage:bggradient}}>
      {chats?.map((data, index) => {
        const { avatar, _id, name, groupChat, members } = data;

        const newMessageAlert = newMessagesAlert.find(
          ({ chatId }) => chatId === _id
        );

        const isOnline = members?.some((member) =>
          onlineUsers.includes(member) && member.toString() !== userId.toString()
        );

        return (
          <ChatItem
            index={index}
            newMessageAlert={newMessageAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            key={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;