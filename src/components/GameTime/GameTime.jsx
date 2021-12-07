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
import UserTable from '../Table/UserTable'


export default function GameTime(props) {
  console.log(props);
  const [open, setOpen] = React.useState(props.profile);
  const [game, setGame] = React.useState("");
  const [value, setValue] = React.useState(
    new Date("2018-01-01T00:00:00.000Z")
  );

  const handleChange = (event) => {
    setGame(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    props.gameHandleChange(false);
  };

  return (
    <div style={{width:"80%",margin:"auto"}}>
      <h1>ADD GAME</h1>
      <UserTable/>
      {/* <Dialog open={props.profile} onClose={handleClose}>
        <DialogTitle>Game A Toll</DialogTitle>
        <DialogContent sx={{ width: 420 }}>
   
          <Box sx={{ minWidth: 120, marginBottom: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" sx={{ width: "100ch" }}>
                Select Game
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={game}
                label="Select Game"
                onChange={handleChange}
              >
                <MenuItem value="Pupg">Pupg</MenuItem>
                <MenuItem value="callofduty">Call Of Duty</MenuItem>
                <MenuItem value="freefire">Free Fire</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <MobileTimePicker
                label="Game Time Start"
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />

            </Stack>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Submit</Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
}
