import React from 'react'
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
function Logout(props) {
    const [open, setOpen]=React.useState(props.openLogout)
    const handleClose = ()=>{
        setOpen(false);
    }
    const logout=()=>{
    localStorage.clear();
    setOpen(false)
    window.location.href = '/signin';
    }
    
    return (
        <div>
           <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Logout</DialogTitle>
          <DialogContent sx={{ width: 420 }}>
          <div>
              Are you sure you want to Logout ?
          </div>
           
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={logout}>Yes</Button>
          </DialogActions>
        </Dialog>
            
        </div>
    )
}

export default Logout
