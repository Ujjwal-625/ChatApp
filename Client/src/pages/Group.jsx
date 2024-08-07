import React, { lazy, memo, Suspense, useEffect, useState } from 'react';
import { Backdrop, Box, Button, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { bggradient, lightblue } from "../components/constants/color.js";
import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackSpaceIcon, Menu as MenuIcon } from "@mui/icons-material";
import { matBlack } from "../components/constants/color.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import AvatarCard from "../components/Shared/AvtarCard.jsx";
import { samepleChats } from "../components/constants/sampleData.js";
import { sampleUsers } from '../components/constants/sampleData.js';

import { Link } from "../components/Style/StyledComponent.jsx";
import Useritem from '../components/Shared/Useritem.jsx';
const ConfirmDeleteDialog = lazy(() => import("../components/Dialog/ConfirmDeleteDialog.jsx"));
const AddMemberDialog = lazy(() => import("../components/Dialog/AddMemberDialog.jsx"));

const Group = () => {
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate("/");
  };

  const [ismobileMenuOpen, setismobileMenuOpen] = useState(false);
  const handleMoblile = () => {
    setismobileMenuOpen((prev) => !prev);
  };
  const handleMobileClose = () => {
    setismobileMenuOpen(false);
  };

  const chatId = useSearchParams()[0].get("group");

  const IconBtn = (
    <>
      <Box sx={{
        display: {
          xs: "block",
          position: "fixed",
          right: "1rem",
          top: "1rem"
        }
      }}>
        <Tooltip title="menu">
          <IconButton onClick={handleMoblile}>
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Tooltip title="Back">
        <IconButton sx={{
          position: "absolute", top: "2rem", left: "2rem", color: "white", bgcolor: matBlack,
          ":hover": {
            bgcolor: "rgba(0,0,0,0.65)"
          }
        }} onClick={navigateBack}>
          <KeyboardBackSpaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const [isEdit, setisEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const updateGroupName = () => {
    setisEdit(false);
    console.log(`group name updated value= ${groupNameUpdatedValue}`);
  };
  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setisEdit(false);
    }
  }, [chatId]);

  const GroupName = (
    <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"1rem"} padding={"3rem"}>
      {
        isEdit ? <>
          <TextField value={groupNameUpdatedValue} onChange={e => setGroupNameUpdatedValue(e.target.value)} />
          <IconButton onClick={updateGroupName}>
            <DoneIcon />
          </IconButton>
        </> :
          <>
            <Typography variant='h4'>{groupName}</Typography>
            <IconButton onClick={() => setisEdit(true)}>
              <EditIcon />
            </IconButton>
          </>
      }
    </Stack>
  );

  const [confirmDeleteDialog, setconfirmDeleteDialog] = useState(false);
  const openconfirmDeleteHandler = () => {
    setconfirmDeleteDialog(true);
  };
  const closeconfirmDeletehandler = () => {
    setconfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    console.log("Member Added");
  };

  const groupDeleteHandler = () => {
    console.log("Delete Handler");
    closeconfirmDeletehandler();
  };
  const removeMemberHandler = (id) => {
    console.log(id);
  };

  const [isAddMember, setisAddMember] = useState(false);

  const ButtonGroup = (
    <>
      <Stack
        direction={{
          sm: "row",
          xs: "column-reverse"
        }}
        spacing={"1rem"}
        p={{
          sm: "1rem",
          xs: "0",
          md: "1rem 4rem"
        }}
      >
        <Button size="large" variant='outlined' color='error' startIcon={<DeleteIcon />} onClick={openconfirmDeleteHandler}>Delete Group</Button>
        <Button size="large" variant='contained' startIcon={<AddIcon />} onClick={openAddMemberHandler}>Add Member</Button>
      </Stack>
    </>
  );

  return (
    <Grid container height={"100vh"}>
      <Grid item
        sx={{
          display: {
            xs: "none",
            sm: "block"
          },
          overflow: "auto",  // Make the container scrollable
          maxHeight: "100vh" // Set a maximum height to prevent the container from growing indefinitely
        }}
        sm={4}
      >
        <GroupsList myGroups={samepleChats} chatId={chatId} />
      </Grid>
      <Grid item xs={12} sm={8} sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        padding: "1rem 3rem"
      }}>
        {IconBtn}

        {
          groupName && <>
            {GroupName}
            <Typography
              margin={"2rem"}
              alignSelf={"flex-start"}
              variant='body1'
            >
              Members
            </Typography>

            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "",
                md: "1rem 4rem"
              }}
              spacing={"2rem"}
              backgroundimage={bggradient}
              height={"50vh"}
              overflow={"auto"}
            >
              {/* Members */}
              {
                sampleUsers.map((i) =>
                  <Useritem key={i._id} user={i} isAdded styling={{
                    boxShadow: "0 0 0.5rem 0.5rem rgba(0,0,0,0.2)",
                    padding: "1rem 2rem",
                    borderRadius: "1rem"
                  }}
                    handler={removeMemberHandler}
                  />
                )
              }
            </Stack>
            {ButtonGroup}
          </>
        }
      </Grid>

      {
        isAddMember &&
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog />
        </Suspense>
      }

      {
        confirmDeleteDialog && <>
          <Suspense fallback={<Backdrop open />}>
            <ConfirmDeleteDialog open={confirmDeleteDialog} handleclose={closeconfirmDeletehandler} deleteHandler={groupDeleteHandler} />
          </Suspense>
        </>
      }

      <Drawer sx={{
        display: {
          xs: "block",
          sm: "none"
        }
      }} open={ismobileMenuOpen} onClose={handleMobileClose}>
        <GroupsList w={"50vw"} myGroups={samepleChats} chatId={chatId} />
      </Drawer>
    </Grid>
  )
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => {
  return (
    <Stack width={w} sx={{
      backgroundimage: bggradient,
      height: "100%",
      overflow: "auto" // Make the container scrollable
    }}>
      {
        myGroups.length > 0 ?
          (myGroups.map((group) => {
            return <GroupItem group={group} chatId={chatId} key={group._id} />
          }))
          :
          <Typography textAlign={"center"} padding={"1rem"}>No Groups</Typography>
      }
    </Stack>
  )
};

const GroupItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return (
    <Link to={`?group=${_id}`} onClick={(e) => {
      if (chatId == _id)
        e.preventDefault();
    }}>
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  )
});

export default Group;
