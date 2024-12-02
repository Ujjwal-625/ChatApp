import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import UserItem from "../Shared/Useritem";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/reducers/misc";
import { useAsyncMutation, useErrors } from "../../hooks/hooks";
import { useAddGroupMemberMutation, useAvailableFriendsQuery } from "../../redux/api/api";

const AddMemberDialog = ({ chatId }) => {
  const { isAddMember } = useSelector((state) => state.misc);
  const [addGroupMember, isLoadingAddGroupMember] = useAsyncMutation(
    useAddGroupMemberMutation
  );
  const {isLoading ,data,error,isError} =useAvailableFriendsQuery(chatId);
  const errors=[{
    error,isError
  }]
  useErrors(errors);
  const dispatch = useDispatch();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const selectMemberHandler = (id) => {
    // adding and removing element from array on click of button if it exist then we will remove it form the array
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const addmemberSumitHandler = () => {
    addGroupMember("Adding Member", {
      chatId: chatId,
      members: selectedMembers,
    });
    closeHandler();
  };
  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };
  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack padding={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Members</DialogTitle>
        <Stack spacing={"1rem"}>
          {isLoading ? <Skeleton/>:(data?.availableFriends?.length > 0 ? (
            data?.availableFriends?.map((user) => {
              return (
                <UserItem
                  key={user._id}
                  user={user}
                  handler={selectMemberHandler}
                  isAdded={selectedMembers.includes(user._id)}
                />
              );
            })
          ) : (
            <Typography textAlign={"center"}> No Friends</Typography>
          ))}
        </Stack>
        <Stack direction={"row"} spacing={"2rem"}>
          <Button
            onClick={closeHandler}
            variant="outlined"
            size="large"
            color="error"
          >
            Cancel
          </Button>
          <Button
            onClick={addmemberSumitHandler}
            size="large"
            disabled={isLoadingAddGroupMember}
            variant="contained"
          >
            Confirm
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
