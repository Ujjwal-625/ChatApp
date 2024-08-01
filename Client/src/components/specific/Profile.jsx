import { Avatar, Stack, Typography } from '@mui/material'
import {Face as FaceIcon , AlternateEmail as UserIcon , CalendarMonth as CalenderIcon} from "@mui/icons-material"
import React from 'react';
import moment from 'moment';
const Profile = () => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"} >
        <Avatar
        sx={{
            width:200,
            height:200,
            objectFit:"contain",
            border:"solid 1px white",
            marginBottom:"1rem"
        }}
        />
        <ProfileCard heading={"bio"} text={"some random text "}  />
        <ProfileCard heading={"UserName"} Icon={<UserIcon/>} text={"Ujjwal_625"}  />
        <ProfileCard heading={"Name"} Icon={<FaceIcon/>} text={"Ujjwal Singh"}  />
        <ProfileCard heading={"Joined"} Icon={<CalenderIcon/>} text={moment("Tue Mar 17 2020 00:00:00 GMT+0530").fromNow()}  />
    </Stack>
    
  )
}

const ProfileCard=({text ,Icon ,heading})=>{
    return (
        <Stack direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        color={"white"}
        textAlign={"center"}
        >
            {Icon && Icon}

            <Stack>
                <Typography variant='body1'>{text}</Typography>
                <Typography variant='caption' color={"gray"}>{heading}</Typography>
            </Stack>
        </Stack>
    )
}

export default Profile