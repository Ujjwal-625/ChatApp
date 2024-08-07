import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { sampleUsers as users } from '../constants/sampleData'
import UserItem from "../Shared/Useritem"
const AddMemberDialog = ({addmember ,isloading,chatId}) => {

    const [memebers,setmembers]=useState(users);
  const [selectedMembers,setSelectedMembers]=useState([]);
  const selectMemberHandler=(id)=>{

    // adding and removing element from array on click of button if it exist then we will remove it form the array
      setSelectedMembers(prev=>prev.includes(id)?prev.filter((i)=>i!==id):[...prev,id]);
    }

    
    const addmemberSumitHandler=()=>{
     closeHandler();
    }
    const closeHandler=()=>{
      setSelectedMembers([]);
      setmembers([]);
      // setisAddMember(false);
    }
  return (
    <Dialog open onClose={closeHandler}>
        <Stack padding={"2rem"} width={"20rem"} spacing={"2rem"}>
                <DialogTitle textAlign={"center"}>Add Members</DialogTitle>
                <Stack spacing={"1rem"}>
                    {memebers.length>0?
                        memebers.map((user)=>{
                            return (
                                <UserItem key={user._id} user ={user} handler={selectMemberHandler} isAdded={selectedMembers.includes(user._id)} />
                            )
                        }):<Typography textAlign={"center"}> No Friends</Typography>
                    }

                </Stack>
           <Stack direction={"row"} spacing={"2rem"}>
            <Button onClick={closeHandler} variant="outlined" size='large' color='error'>Cancel</Button>
            <Button onClick={addmemberSumitHandler} size="large" disabled={isloading} variant='contained'>Confirm</Button>
           </Stack>
        </Stack>
    </Dialog>
  )
}

export default AddMemberDialog