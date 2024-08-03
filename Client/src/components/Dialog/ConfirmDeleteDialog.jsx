import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'

const ConfirmDeleteDialog = ({open ,handleclose,deleteHandler}) => {
  return (
    <Dialog open={open} onClose={handleclose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are You Sure You Want to delete this Group?
            </DialogContentText>

            <DialogActions>
                <Button onClick={handleclose}>No</Button>
                <Button onClick={deleteHandler} color="error">Yes</Button>
            </DialogActions>
        </DialogContent>
    </Dialog>
  )
}

export default ConfirmDeleteDialog