import React from 'react'
import AdminLayout from '../../components/Layout/AdminLayout'
// import { Navigate } from 'react-router-dom';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import { AdminPanelSettings as AdminPanelSettingsIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import moment from "moment";
import {SearchField} from "../../components/Style/StyledComponent"
import { CurveButton } from '../../components/Style/StyledComponent';
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

const Dashboard = () => {
  
  return (


    <AdminLayout>
        <Container component={"main"}>
          <Appbar/>
        </Container>
    </AdminLayout>
  )
}

export default Dashboard