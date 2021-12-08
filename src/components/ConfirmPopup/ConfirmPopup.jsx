import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";

export default function ConfirmPopup({handleClose,confirm}) {

    return (
        <>
        <Dialog open={true} onClose={handleClose}>
          <DialogTitle>Confirm</DialogTitle>
          <DialogContent sx={{ width: 420 }}>
          <div>
              Are you sure you want to delete ?
          </div>
           
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={confirm}>Yes</Button>
          </DialogActions>
        </Dialog>
        </>
    )
}