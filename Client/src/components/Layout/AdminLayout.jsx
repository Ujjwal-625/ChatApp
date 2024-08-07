import { Box, Drawer, Grid, IconButton, Stack, Typography,styled} from '@mui/material'
import React, { useState } from 'react'
import { graycolor, matBlack } from '../constants/color'
import {Dashboard as DashboardIcon, Close as CloseIcon, ManageAccounts as ManageAccountIcon, Menu as MenuIcon, Group as GroupIcon, Message as MessageIcon, ExitToApp as ExitToAppIcon} from '@mui/icons-material'
import {Link as LinkComponent,Navigate,useLocation} from "react-router-dom";


const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: black;
  &:hover {
    color: rgba(0, 0, 0, 0.54);
  }
`;

const adminTabs=[{
  name:"Dashboard",
  path:"/admin/dashboard",
  icon:<DashboardIcon/>
},
{
  name:"User",
  path:"/admin/user-managment",
  icon:<ManageAccountIcon/>
},{
  name:"Chat",
  path:"/admin/Chat-managment",
  icon:<GroupIcon/>
},{
  name:"Message",
  path:"/admin/Message-managment",
  icon:<MessageIcon/>
}
]

const LogoutHandler=()=>{
  console.log("logout succesfull");
  // return <Navigate to="/"/>
}

const Sidebar=({w="100%"})=>{
  const location=useLocation();
  return (
    <Stack width={w} direction={"column"} padding={"3rem"} spacing={"3rem"}>
      <Typography variant="h5" textTransform={"uppercase"}>
        Admin Page
      </Typography>
      <Stack spacing={"1rem"}>
        {adminTabs.map((ele) => (
          <Link
            key={ele.path}
            to={ele.path}
            sx={
              location.pathname == ele.path && {
                bgcolor: matBlack,
                color: "white",
                ":hover": {
                  color: "white",
                },
              }
            }
          >
            <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
              {ele.icon}
              <Typography fontSize={"1.2rem"}>{ele.name}</Typography>
            </Stack>
          </Link>
        ))}

        <Link onClick={LogoutHandler}>
          <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
            <ExitToAppIcon/>
            <Typography fontSize={"1.2rem"}>Logout</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
}
const AdminLayout = ({children}) => {
  const [isMobile,setisMobile]=useState(false);
  const closeHandler=()=>{
    setisMobile(false);
  }
  const handleMobile=()=>{
    setisMobile(prev=>!prev);
  }
  
  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }}
      >
        <IconButton onClick={handleMobile}>
         {isMobile? <CloseIcon/>: <MenuIcon/>} 
        </IconButton>
      </Box>

      <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
        <Sidebar />
      </Grid>

      <Grid
        item
        xs={12}
        md={8}
        lg={9}
        sx={{
          bgcolor: graycolor,
        }}
      >
        {children}
      </Grid>

      <Drawer open={isMobile} onClose={closeHandler}>
        <Sidebar w={"50vw"}/>
      </Drawer>

    </Grid>


  )
}

export default AdminLayout