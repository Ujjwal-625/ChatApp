import React from 'react'
import AdminLayout from '../../components/Layout/AdminLayout'
import { Box, Container, Icon, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Message as MessageIcon, Notifications as NotificationsIcon, Person as PersonIcon } from '@mui/icons-material';
import moment from "moment";
import {SearchField} from "../../components/Style/StyledComponent"
import { CurveButton } from '../../components/Style/StyledComponent';
import { DoughnutChart, LineChart } from '../../components/specific/Charts';
// const isAdmin=false;
import {useFetchData} from "6pp"
import { server } from '../../components/constants/config';
import { LayoutLoader } from '../../components/Layout/Loaders';
import { useErrors } from '../../hooks/hooks';



const Dashboard = () => {

  const {loading,data,error}=useFetchData(`${server}/api/v1/admin/stats`,"dashboard-stats")
  // console.log(data);
  const stats=data?.data || {};
  useErrors([{
    error:error,
    isError:error
  }])

  console.log("Stats",stats);
  
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
        <Widget title={"User"} value={stats?.userCount || 0} icon={<PersonIcon/>} />
        <Widget title={"Chats"} value={stats?.totalChatCount || 0} icon={<GroupIcon/>} />
        <Widget title={"Messages"} value={stats?.messageCount || 0} icon={<MessageIcon/>}  />
      </Stack>
    )
  }
  return (
    <AdminLayout>
        {
          loading ? <Skeleton height={"100vh"}/>:<Container component={"main"}>
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
              <LineChart value={stats?.messages || []}/>
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
              <DoughnutChart labels={["Single Chats","Group Chats"]} value={[stats?.totalChatCount-stats?.groupCount || 0,stats.groupCount || 0]} />
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
        }
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