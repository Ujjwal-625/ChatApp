import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import { sampleUsers } from '../constants/sampleData'
import React, { useState } from 'react'
import Useritem from '../Shared/Useritem';
import { useInputValidation } from '6pp';

const NewGroup = () => {
  const groupName=useInputValidation("");

  const [memebers,setmembers]=useState(sampleUsers);
  const [selectedMembers,setSelectedMembers]=useState([]);

  const submithandler=()=>{

  }
  const closeHandler=()=>{

  }
  const selectMemberHandler=(id)=>{

    // adding and removing element from array on click of button if it exist then we will remove it form the array
      setSelectedMembers(prev=>prev.includes(id)?prev.filter((i)=>i!==id):[...prev,id]);
    }
    console.log(selectedMembers);
  return (
    <Dialog open onClose={closeHandler}>
      <Stack p={{ xs: '1rem', sm: '2rem' }} width="25rem" spacing={"1rem"}>
        <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle>

        <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler}/>
        <Typography variant="body1">Members</Typography>
        <Stack>
        {
            memebers.map((i)=>(
             <Useritem user={i} key={i._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />
            ))
          }
        </Stack>

        <Stack spacing={"1rem"} justifyContent={"space-evenly"} >
          <Button variant="contained" color='error'>Cancel</Button>
          <Button variant="contained" onClick={submithandler}>Create</Button>
        </Stack>
        </Stack>
    </Dialog>
  )
}

export default NewGroup