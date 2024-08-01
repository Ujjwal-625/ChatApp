import React from 'react'
import AppLayout from '../components/Layout/AppLayout'
import { Box, Typography } from '@mui/material';
import { graycolor } from '../components/constants/color';

const Home = () => {
  return (
    <Box bgcolor={graycolor} height={"100%"}>
      <Typography p={"2rem"} textAlign={"center"} variant='h5'>
      Select a Friend To chat
    </Typography>
    </Box>
  )
}

export default AppLayout()(Home);