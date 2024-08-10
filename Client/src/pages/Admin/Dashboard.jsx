import React from 'react'
import AdminLayout from '../../components/Layout/AdminLayout'
import { Box, Container, Icon, Paper, Stack, Typography } from '@mui/material';
import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Message as MessageIcon, Notifications as NotificationsIcon, Person as PersonIcon } from '@mui/icons-material';
import moment from "moment";
import {SearchField} from "../../components/Style/StyledComponent"
import { CurveButton } from '../../components/Style/StyledComponent';
import { DoughnutChart, LineChart } from '../../components/specific/Charts';
// const isAdmin=false;
const Appbar= ()=> (
  <Paper
    elevation={3}
    sx={{
      padding: '2rem',
      marginBottom: '2rem 0',
      borderRadius: "1rem"
    }}
  >
   <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
    <AdminPanelSettingsIcon sx={{fontSize:"3rem"}}/>
    <SearchField placeholder='...Search'/>
    <CurveButton>Search</CurveButton>
    <Box flexGrow={1}/>
    <Typography sx={{display:{xs:"none",lg:"block"}}}>
      {moment().format('MMMM Do YYYY, h:mm:ss a')}
    </Typography>

    <NotificationsIcon/>
   </Stack>
  </Paper>
);

const Widgets=()=>{
  return (
    <Stack 
      direction={{
        xs:"column",
        sm:"row"
      }}
      spacing={"2rem"}
      justifyContent={"space-between"}
      alignItems={"center"}
      margin={"2rem 0"}
    >
      <Widget title={"User"} value={5} icon={<PersonIcon/>} />
      <Widget title={"Chats"} value={10} icon={<GroupIcon/>} />
      <Widget title={"Messages"} value={10} icon={<MessageIcon/>}  />
    </Stack>
  )
}

const Dashboard = () => {
  
  return (


    <AdminLayout>
        <Container component={"main"}>
          <Appbar/>
          <Stack
          marginTop={"2rem"}
            direction={{
              xs: "column",
              lg: "row",
            }}
            flexWrap={"wrap"}
            justifyContent={"center"}
            alignItems={{
              xs: "center",
              lg: "stretch",
            }}
            sx={{ gap: "2rem" }}
          >
           <Paper
              elevation={3}
              sx={{
                padding: "2rem 3.5rem",
                borderRadius: "1rem",
                width:{
                  lg:"50%",
                  xs:"100%"
                },
                maxWidth: "45rem",
              }}
            >
              <Typography margin={"2rem 0"} variant="h4">
                Last Messages
              </Typography>
              <LineChart value={[20,55,30,70,30,0]}/>
            </Paper>


            <Paper
              elevation={3}
              sx={{
                padding: "1rem ",
                borderRadius: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: { xs: "100%", sm: "50%" },
                position: "relative",
                width:{
                  lg:"25rem",
                  xs:"100%"
                },
              }}
            >
              <DoughnutChart labels={["Single Chats","Group Chats"]} value={[23,67]} />
              <Stack
                position={"absolute"}
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={"0.5rem"}
                width={"100%"}
                height={"100%"}
              >
                <GroupIcon/> <Typography>Vs </Typography>
                <PersonIcon/>

              </Stack>
            </Paper>
          </Stack>

          <Widgets/>
        </Container>
    </AdminLayout>
  )
}


const Widget=({title ,value,icon})=>{
  return (
  <Paper elevation={3}
   sx={{
    padding: "2rem",
    margin: "2rem 0",
    borderRadius: "1.5rem",
    width:"20rem"
  }}>
    <Stack alignItems={"center"} spacing={"1rem"}>
      <Typography
      sx={{
        color:"rgba(0,0,0,0.7)",
        borderRadius:"50%",
        border:"5px solid rgba(0,0,0,0.9)",
        width:"5rem",
        height:"5rem",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
      }}
      >{value}</Typography>
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        {icon}
        <Typography>{title}</Typography>
      </Stack>
    </Stack>
  </Paper>
  )
}

export default Dashboard