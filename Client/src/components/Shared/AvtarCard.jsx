import { Avatar, AvatarGroup, Box, Stack } from '@mui/material';
import React from 'react'

const AvtarCard = ({avatar=[] ,max=4}) => {
  return (
    <Stack direction={"row"} spacing={0.5}>
      <AvatarGroup>
      <Box width={"5rem"} height={"3rem"}>
          {
            avatar.map((src,index)=>(
              <Avatar
              key={Math.random()*100}
              src={src}
              alt={`Avater${index}`}
              sx={{
                width:"3rem",
                height:"3rem",
                position:"absolute",
                left:{
                  xs:`${index+0.5}rem`,
                  sx:`${index}rem`
                }
              }}
              />
            ))
          }
      </Box>
    </AvatarGroup>
    </Stack>
  )
}

export default AvtarCard;