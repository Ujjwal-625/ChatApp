import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React from 'react'
import { sampleUsers as users } from '../constants/sampleData'
import UserItem from "../Shared/Useritem"
const AddMemberDialog = ({addmember ,isloading,chatId}) => {
    const addFriendHandler=(id)=>{
        console.log(id,chatId);
    }
  return (
    <Dialog open>
        <Stack padding={"2rem"} width={"20rem"} spacing={"2rem"}>
                <DialogTitle textAlign={"center"}>Add Members</DialogTitle>
                <Stack spacing={"1rem"}>
                    {users.length>0?
                        users.map((user)=>{
                            return (
                                <UserItem key={user._id} user ={user} handler={addFriendHandler} />
                            )
                        }):<Typography textAlign={"center"}> No Friends</Typography>
                    }

                </Stack>
           <Stack direction={"row"} spacing={"2rem"}>
            <Button variant="outlined" size='large' color='error'>Cancel</Button>
            <Button size="large" disabled={isloading} variant='contained'>Confirm</Button>
           </Stack>
        </Stack>
    </Dialog>
  )
}

export default AddMemberDialog