import { Avatar, Stack, Typography } from '@mui/material'
import {Face as FaceIcon , AlternateEmail as UserIcon , CalendarMonth as CalenderIcon} from "@mui/icons-material"
import React from 'react';
import moment from 'moment';
import { transformImage } from '../../libs/features';
const Profile = ({user}) => {
    // console.log(user.data.avatar.url);
    // console.log("user",user);
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
        src={(user?.data?.avatar?.url)}
        />
        <ProfileCard heading={"bio"} text={user?.data?.bio || ""}  />
        <ProfileCard heading={"UserName"} Icon={<UserIcon/>} text={user?.data?.username || ""}  />
        <ProfileCard heading={"Name"} Icon={<FaceIcon/>} text={user?.data?.name || ""}  />
        <ProfileCard heading={"Joined"} Icon={<CalenderIcon/>} text={moment(user?.data?.createdAt).fromNow()}  />
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