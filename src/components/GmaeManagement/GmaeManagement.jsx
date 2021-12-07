import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Stack from "@mui/material/Stack";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import MobileTimePicker from "@mui/lab/MobileTimePicker";
import UserTable from "../Table/UserTable";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function GameTime(props) {
  console.log(props);
  const [open, setOpen] = React.useState(false);
  const [imageName,setImageName]=React.useState("")
  const [game, setGame] = React.useState("");
  const [value, setValue] = React.useState(
    new Date("2018-01-01T00:00:00.000Z")
  );
  // const [openAddGamePopup,setAddGamePopup]=React.useState('false')

  const AddGamePopup = () => {
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleChange = (event) => {
      setGame(event.target.value);
    };

    const handleClose = () => {
      setOpen(false);
    };
    return (
      <>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Game</DialogTitle>
          <DialogContent sx={{ width: 420 }}>
          <TextField
      id="full-width-text-field"
      label="Game name"
      placeholder="Game name"
      margin="normal"
      fullWidth // this may override your custom width
/>
<div className="file_upload"> 
          <input type="file" id="actual-btn" onChange={(e)=>{setImageName(e.target.files[0].name);console.log(e.target.files[0])}} hidden />
         
  
        <label for="actual-btn">Upload Game Image </label>
        <div style={{margin:10}}>{imageName}</div>
          </div>
           
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Submit</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Game Management</h2>
        <div
          title="Add Game"
          onClick={() => {
            setOpen(true);
            console.log("add game popup");
          }}
        >
          <AddCircleOutlineIcon sx={{ fontSize: 35, cursor: "pointer" }} />
        </div>
      </div>

      <UserTable />
      {open && <AddGamePopup />}
    </div>
  );
}
