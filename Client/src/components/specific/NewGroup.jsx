import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import Useritem from '../Shared/Useritem';
import { useInputValidation } from '6pp';
import { useDispatch, useSelector } from 'react-redux';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api';
import { useAsyncMutation, useErrors } from '../../hooks/hooks';
import { setIsNewGroup } from '../../redux/reducers/misc';
import toast from 'react-hot-toast';

const NewGroup = () => {
  const groupName=useInputValidation("");

  const dispatch=useDispatch();
  const {isNewGroup}=useSelector((state)=>state.misc);

  const {isError,error,data,isLoading}=useAvailableFriendsQuery();
  // console.log("data",data);
  const [selectedMembers,setSelectedMembers]=useState([]);


  const [newGroup,isLoadinNewGroup]=useAsyncMutation(useNewGroupMutation)

  const errors=[{
    error,
    isError
  }]

  useErrors(errors);

  const submithandler=()=>{
    // console.log("selected members",selectedMembers);
    if(groupName.value.trim()===""){
      toast.error("Please Provide Group Name");
      closeHandler();
      return ;
    }
    if(selectedMembers.length<2){
      toast.error("Group must have atleast 3 members");
      closeHandler();
      return ;
    }
    // console.log(selectedMembers);
    //creating new Group
    newGroup("Creating New Group",{name:groupName.value , members:selectedMembers})
    closeHandler();
  }
  const closeHandler=()=>{
    dispatch(setIsNewGroup(false));
  }
  const selectMemberHandler=(id)=>{

    // adding and removing element from array on click of button if it exist then we will remove it form the array
      setSelectedMembers(prev=>prev.includes(id)?prev.filter((i)=>i!==id):[...prev,id]);
    }
    //console.log(selectedMembers);
  return (
    <Dialog  onClose={closeHandler} open={isNewGroup}>
      <Stack p={{ xs: '1rem', sm: '2rem' }} width="25rem" spacing={"1rem"}>
        <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle>

        <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler}/>
        <Typography variant="body1">Members</Typography>
        <Stack>
        { isLoading ? <Skeleton/>:
            (data?.friends?.map((i)=>(
             <Useritem user={i} key={i._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />
            )))
          }
        </Stack>

        <Stack spacing={"1rem"} justifyContent={"space-evenly"} >
          <Button variant="contained" color='error' onClick={closeHandler}>Cancel</Button>
          <Button variant="contained" onClick={submithandler} disabled={isLoadinNewGroup}>Create</Button>
        </Stack>
        </Stack>
    </Dialog>
  )
}

export default NewGroup