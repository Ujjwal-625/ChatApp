import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack, Typography } from '@mui/material';
import React, { memo, useState } from 'react';
import { sampleNotification } from '../constants/sampleData';

const Notification = () => {
  const [open, setOpen] = useState(true);

  function friendRequestHandler({_id, accept}) {
    // Handle friend request logic here
    console.log(`Request ID: ${_id}, Accepted: ${accept}`);
  }

  return (
    <Dialog open>
      <Stack p={{ xs: '1rem', sm: '2rem' }} maxWidth="25rem">
        <DialogTitle>Notification</DialogTitle>
        {sampleNotification.length > 0 ? (
          sampleNotification.map((e) => (
            <NotificationItem key={e._id} sender={e.sender} handler={friendRequestHandler} _id={e._id} />
          ))
        ) : (
          <Typography textAlign="center">No notifications</Typography>
        )}
      </Stack>
    </Dialog>
  );
};

export const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;

  return (
    <ListItem>
      <Stack direction="row" width="100%" spacing="1rem" alignItems="center">
        <Avatar/>
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
