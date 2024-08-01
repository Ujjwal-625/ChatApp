import { Dialog, DialogTitle, InputAdornment, List, ListItem, ListItemText, Stack, TextField } from '@mui/material'
import React, { useState } from 'react'
import {useInputValidation} from "6pp";
import { sampleUsers } from '../constants/sampleData';

import { Search as SearchIcon } from '@mui/icons-material';
import Useritem from '../Shared/Useritem';
const Search = () => {
  const search=useInputValidation("");
  const [users,setUsers]=useState(sampleUsers);

  function addFriendHandler(){

  }
  let isLoadinSendFriendRequest=false;
  return (
    <Dialog open>
      <Stack direction={"column"} width={"25rem"} p={"2rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
        label=""
        value={search.value}
        onChange={search.onChange}
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