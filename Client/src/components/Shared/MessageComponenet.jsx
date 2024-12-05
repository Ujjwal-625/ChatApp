import { Box, Typography } from '@mui/material';
import { motion } from "framer-motion";
import moment from 'moment';
import React, { memo } from 'react';
import { fileFormat } from '../../libs/features';
import { lightblue } from '../constants/color';
import RenderAttachment from './RenderAttachment';

const MessageComponenet = ({message,user}) => {
  // console.log("user",user);

  // console.log("message",message)
  
    const {sender,content ,attachments=[],createdAt}=message;
    const timeAgo=moment(createdAt).fromNow();
    const sameSender= sender?._id===user?.data?._id;

    // const DeleteMessage=(e)=>{
    //   dispatch(setIsDeleteMessage(true));
    //   dispatch(setDeleteMessageLocation({
    //     id: e.currentTarget.id,
    //     className: e.currentTarget.className
    //   }))
    //   console.log("message",message)
    //   console.log("user",user);
    // }
  return (
    <motion.div
    initial={{opacity:0,x:"-100%"}}
    whileInView={{opacity:1,x:0}}
    id={message._id}
    style={{
        alignSelf:sameSender?"flex-end":"flex-start",
        backgroundColor: "white",
        color: "black",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "fit-content"
    }}
    >
      {
        !sameSender && <Typography variant='caption' fontWeight={"600"} color={lightblue}>{sender?.name}</Typography>
      }
      
      {
        content && <Typography>{content}</Typography>
      }

      {
        attachments.length>0 && attachments.map((attachment,index)=>{
          const url=attachment.url;
          const file=fileFormat(url);
          return (
            <Box key={index}>
                <a href={url} target='_blank' download
                style={{color:"black",}}
                >
                  {RenderAttachment(file,url)}
                </a>
            </Box>
          )
        })
      }


      <Typography variant='caption' color={"text.secondary"}>{timeAgo}</Typography>
    </motion.div>
  )
}

export default memo(MessageComponenet);