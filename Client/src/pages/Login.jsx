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
import { VisuallyhiddenInput } from "../components/Style/StyledComponent";
import { useFileHandler, useInputValidation } from "6pp";
import { userNameValidator } from "../utils/validators";
const Login = () => {
  const [islogin, setislogin] = useState(true);
  const avatar=useFileHandler("single");// for uploading the image
  function toggleLogin() {
    setislogin((prev) => !prev);
  }

  function handleLogin(e){
    e.preventDefault();
  }
  function handleSignUp(e){
    e.preventDefault();
  }

  const username=useInputValidation("",userNameValidator) //initialize it with empty and provide this in form as value
  const name=useInputValidation("");// you can also pass validator also with coma
  const password=useInputValidation(""); //you can also use useStrongpassword from 6pp package for strong password validation

  const bio=useInputValidation("");
  
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
        {islogin ? (
          <>
            <Typography variant="h5">Login</Typography>
            <form
              style={{
                width: "100%",
                marginTop: "1rem",
               
              }}
              onSubmit={handleLogin}
            >
              <TextField
                label="Username"
                required
                fullWidth
                margin="normal"
                variant="outlined"
                value={username.value}
                onChange={username.changeHandler}
              />

                {/* adding validator to username */}
            
              {username.error && (
                <Typography color={"error"} variant="caption">
                  {username.error}
                </Typography>
              )}


              <TextField
                label="password"
                required
                fullWidth
                type="password"
                margin="normal"
                variant="outlined"
                value={password.value}
                onChange={password.changeHandler}
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

              <Typography textAlign={"center"} margin={"1rem"}>
                OR
              </Typography>

              <Button fullWidth variant="text" onClick={toggleLogin}>
                Don't have acccout Register
              </Button>
            </form>
          </>
        ) : (
          <>
            <Typography variant="h5">Sign Up</Typography>

            <form
              style={{
                width: "100%",
                marginTop: "1rem",
              }}
              onSubmit={handleSignUp}
            >
              <Stack position="relative" width={"10rem"} margin={"auto"}>
                <Avatar
                  sx={{
                    width: "10rem",
                    height: "10rem",
                    objectFit: "contain",
                  }}
                  src={avatar.preview}
                />

                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    color:"white",
                    bgcolor:"rgba(0,0,0,0.5)",
                    ":hover":{
                      bgcolor:"rgba(0,0,0,0.7)"
                    }
                  }}
                    component="label"
                >
                  <>
                    <CameraAlt />
                    <VisuallyhiddenInput type="file" onChange={avatar.changeHandler} /> 
                  </>
                </IconButton>
              </Stack>

              {avatar.error && (
                <Typography m={"1rem"}
                  width={"fit-content"}
                  display={"block"}
                 color={"error"} 
                 variant="caption">
                  {avatar.error}
                </Typography>
              )}

              <TextField
                label="Username"
                required
                fullWidth
                margin="normal"
                variant="outlined"
                value={username.value}
                onChange={username.changeHandler}
              />

              {username.error && (
                <Typography color={"error"} variant="caption">
                  {username.error}
                </Typography>
              )}


              <TextField
                label="Name"
                required
                fullWidth
                margin="normal"
                variant="outlined"
                value={name.value}
                onChange={name.changeHandler}
              />

              <TextField
                label="Bio"
                required
                fullWidth
                margin="normal"
                variant="outlined"
                value={bio.value}
                onChange={bio.changeHandler}
              />

              <TextField
                label="password"
                required
                fullWidth
                type="password"
                margin="normal"
                variant="outlined"
                value={password.value}
                onChange={password.changeHandler}
              />
              
              {/* for pasword validation */}

              {/* {password.error && (
                <Typography color={"error"} variant="caption">
                  {password.error}
                </Typography>
              )} */}

              <Button
                fullWidth
                sx={{ marginTop: "1rem" }}
                variant="contained"
                color="primary"
                type="submit"
              >
                Sign Up
              </Button>

              <Typography textAlign={"center"} margin={"1rem"}>
                OR
              </Typography>

              <Button fullWidth variant="text" onClick={toggleLogin}>
                Already have acccout Login
              </Button>
            </form>
          </>
        )}
      </Paper>
    </Container>
   </div>
  );
};

export default Login;
