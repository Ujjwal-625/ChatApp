import React, { useState } from "react";
import {useInputValidation} from "6pp";

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
const Login = () => {
  const [islogin, setislogin] = useState(true);
  function toggleLogin() {
    setislogin((prev) => !prev);
  }

  const user=useInputValidation("") //initialize it with empty and provide this in form as value
  const name=useInputValidation("");
  const password=useInputValidation("");
  
  return (
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
            >
              <TextField
                label="Username"
                required
                fullWidth
                margin="normal"
                variant="outlined"
              />

              <TextField
                label="password"
                required
                fullWidth
                type="password"
                margin="normal"
                variant="outlined"
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
            >
              <Stack position="relative" width={"10rem"} margin={"auto"}>
                <Avatar
                  sx={{
                    width: "10rem",
                    height: "10rem",
                    objectFit: "contain",
                  }}
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
                    <VisuallyhiddenInput type="file" />
                  </>
                </IconButton>
              </Stack>

              <TextField
                label="Username"
                required
                fullWidth
                margin="normal"
                variant="outlined"
              />

              <TextField
                label="Name"
                required
                fullWidth
                margin="normal"
                variant="outlined"
              />

              <TextField
                label="Bio"
                required
                fullWidth
                margin="normal"
                variant="outlined"
              />

              <TextField
                label="password"
                required
                fullWidth
                type="password"
                margin="normal"
                variant="outlined"
              />

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
  );
};

export default Login;
