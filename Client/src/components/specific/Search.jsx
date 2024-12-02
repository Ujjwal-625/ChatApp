import { useInputValidation } from "6pp";
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { Search as SearchIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api';
import { setIsSearch } from '../../redux/reducers/misc';
import toast from "react-hot-toast";
import Useritem from '../Shared/Useritem';
import { useAsyncMutation } from "../../hooks/hooks";
const Search = () => {
  const search=useInputValidation("");
  const {isSearch}=useSelector((state)=>state.misc);
  const dispatch=useDispatch();

  const [searchUser] =useLazySearchUserQuery()
  const [sendFriendRequest,isLoadinSendFriendRequest]=useAsyncMutation(useSendFriendRequestMutation);

  const [users,setUsers]=useState([]);

  const handleCloseSearch =()=>{
    dispatch(setIsSearch(false));
  }

  useEffect(()=>{

    const timeOutId=setTimeout(()=>{
        searchUser(search.value)
        .then(({data})=> setUsers(data.users))
        .catch((err)=>console.log(err))

    },1000)

  },[search.value])

  
 async function addFriendHandler(id){
  await sendFriendRequest("Sending friend request...", {userId:id})

  }
  // let isLoadinSendFriendRequest=false;
  return (
    <Dialog open={isSearch}  onClose={handleCloseSearch}>
      <Stack direction={"column"} width={"25rem"} p={"2rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
        label="search"
        value={search.value}
        onChange={search.changeHandler}
        variant='outlined'
        size='small'
        InputProps={{
          startAdornment:(
            <InputAdornment position='start'>
              <SearchIcon/>
            </InputAdornment>
          )
        }}
        >

        </TextField>

        <List>
          {
            users.map((i)=>(
             <Useritem user={i} key={i._id} handler={addFriendHandler} handlerIsLoading={isLoadinSendFriendRequest}/>
            ))
          }
        </List>
      </Stack>
    </Dialog>
  )
}

export default Search