
import React, { useState } from "react";

import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Stack,
  Avatar,
  IconButton,
} from "@mui/material";

import { CameraAlt } from "@mui/icons-material";
import { VisuallyhiddenInput } from "../../components/Style/StyledComponent";
import { useFileHandler, useInputValidation } from "6pp";
import { userNameValidator } from "../../utils/validators";
import { Navigate } from "react-router-dom";

const AdminLogin = () => {
    const adminKey=useInputValidation("");
    const isAdmin=true;

    const handleLogin=(e)=>{
        e.preventDefault();
        console.log("submitted");
    }
    if(isAdmin){
        return(<Navigate to="/admin/dashboard"></Navigate>)
    }
  return (
    <div style={
        {
          backgroundImage:"linear-gradient(rgba(200,200,200,0.5),rgba(120,110,220,0.5))"
        }
       }>
         <Container
          component={"main"}
          maxWidth="xs"
          sx={{
            display: "flex",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            sx={{
              padding: 4,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
              <>
                <Typography variant="h5">Admin Login</Typography>
                <form
                  style={{
                    width: "100%",
                    marginTop: "1rem",
                   
                  }}
                  onSubmit={handleLogin}
                >
    
    
                  <TextField
                    label="Secret Key"
                    required
                    fullWidth
                    type="password"
                    margin="normal"
                    variant="outlined"
                    value={adminKey.value}
                    onChange={adminKey.changeHandler}
                  />
    
                  <Button
                    fullWidth
                    sx={{ marginTop: "1rem" }}
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Login
                  </Button>
                </form>
              </>
          </Paper>
        </Container>
       </div>
  )
}

export default AdminLogin