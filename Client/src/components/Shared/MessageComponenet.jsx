import React, { memo } from 'react'

const MessageComponenet = ({message,user}) => {
    const {sender,content ,attachments=[],createdAt}=message;
  return (
    <div>MessageComponenet</div>
  )
}

export default memo(MessageComponenet);