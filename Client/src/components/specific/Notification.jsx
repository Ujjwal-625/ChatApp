import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material';
import React, { memo, useState } from 'react';
import { sampleNotification } from '../constants/sampleData';
import { useAcceptFriendRequestMutation, useGetNotificationQuery } from '../../redux/api/api';
import { useErrors } from '../../hooks/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNotification } from '../../redux/reducers/misc';
import toast from 'react-hot-toast';

const Notification = () => {

  const {isNotification}=useSelector((state)=>state.misc);
  const {isLoading ,data ,error,isError}=useGetNotificationQuery();
  const dispatch=useDispatch();

  const [acceptRequest]=useAcceptFriendRequestMutation();

  const notifications=data?.allRequest || [];


async  function friendRequestHandler({_id, accept}) {

  dispatch(setIsNotification(false));


  try {
    const res=await acceptRequest({requestId:_id,accept});
    if(res.data.success)
    toast.success(res?.data?.message);
    else{
      toast.error(res?.data?.error || "something went wrong in request")
    }
    
  } catch (error) {
    toast.error("something went wrong");
    console.log(error);
    
  }
  }

  useErrors([{error,isError}])
  const handleClose=()=>{
    dispatch(setIsNotification(false));
    console.log(setIsNotification);
  }

  return (
    <Dialog open={isNotification} onClose={handleClose}>
      <Stack p={{ xs: '1rem', sm: '2rem' }} maxWidth="25rem">
        <DialogTitle>Notification</DialogTitle>
        {
          isLoading?<Skeleton/>:
          notifications.length > 0 ? (
            notifications.map((e) => (
              <NotificationItem key={e._id} sender={e.sender} handler={friendRequestHandler} _id={e._id} />
            ))
          ) : (
            <Typography textAlign="center">No notifications</Typography>
          )
        }
      </Stack>
    </Dialog>
  );
};

export const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name ,avatar } = sender;

  return (
    <ListItem>
      <Stack direction="row" width="100%" spacing="1rem" alignItems="center">
        <Avatar src={avatar}/>
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%'
          }}
        >
          {`${name} sent you a friend request`}
        </Typography>
        <Stack direction={{
          xs:"column",
        }}>
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>Reject</Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notification;
