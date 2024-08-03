import React, { useRef } from 'react'
import AppLayout from '../components/Layout/AppLayout'
import { IconButton, Stack } from '@mui/material';
import { graycolor } from '../components/constants/color';
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { InputBox } from '../components/Style/StyledComponent';
import { Blue } from '../components/constants/color';
import FileMenu from '../components/Dialog/FileMenu';
import { sampleMessage } from '../components/constants/sampleData';
import MessageComponenet from '../components/Shared/MessageComponenet';


const user={
  _id:"akjsd",
  name:"Ujjwal Singh Rawat"
}
const Chat = () => {
  const containerRef=useRef(null);
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
      {
        sampleMessage.map((i)=>(
          <MessageComponenet key={i._id} message={i} user={user}/>
        ))
      }
      </Stack>

      <form height="10%">
        <Stack direction={"row"} height={"100%"}
        padding={"1rem"}
        position={"relative"}
        alignItems={"center"}
        >
          <IconButton sx={{
            position:"absolute",
            left:"1rem",
            rotate:"30deg"
          }}
          >
            <AttachFileIcon/>
          </IconButton>

          <InputBox placeholder='Type Message Here....'/>

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
      <FileMenu />
    </>
  )
}

export default AppLayout()(Chat);