import React, { memo } from 'react'

import { Link } from '../Style/StyledComponent'
import { Box, Stack, Typography } from '@mui/material'
import AvtarCard from './AvtarCard'
import {motion} from "framer-motion"

const ChatItem = ({
  avatar=[],
  name,
  _id,
  groupChat=false,
  sameSender,
  isOnline,
  newMessageAlert,
  index=0,
  handleDeleteChat
}) => {
  return (
    <Link sx={{ padding:"0"}}
     to={`/chat/${_id}`} onContextMenu={(e)=>handleDeleteChat(e,_id,groupChat)}> 
        <motion.div
        initial={{opacity:0,y:"-100%"}}
        whileInView={{opacity:1,y:0}}
        transition={{delay:index*0.01}}
         style={{
          display:"flex",
          alignItems:"center",
          padding:"1rem",
          backgroundColor:sameSender?"black":"unset",
          color:sameSender?"white":"unset",
          gap:"1rem",
          position:"relative"
        }}>
          {/* Avatar card */}

          <AvtarCard avatar={avatar}/>
          <Stack>
            <Typography>
              {name}
            </Typography>
            {
              newMessageAlert && (<Typography>{newMessageAlert.count} New Message</Typography>)
            }
          </Stack>
            {
              isOnline && (
                <Box sx={{
                  width:"10px",
                  height:"10px",
                  borderRadius:"50%",
                  backgroundColor:"green",
                  position:"absolute",
                  top:"50%",
                  right:"1rem",
                  transform:"translateY(-50%)"
                }}>

                </Box>
              )
            }
        </motion.div>
    </Link>
  )
}

export default memo(ChatItem)