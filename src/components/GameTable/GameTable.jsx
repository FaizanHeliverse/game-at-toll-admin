import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';

import { makeStyles } from '@mui/styles'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


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
import CancelIcon from '@mui/icons-material/Cancel';
import './GameTable.css'
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function GameTable() {
  const classes = useStyles();
 

  const [open, setOpen] = React.useState(false);
  const [imageName,setImageName]=React.useState("")
  const [currimageName,setCurrImageName]=React.useState("")

  React.useEffect(()=>{
    // setCurrImageName(imageName)

  },[])
const Popup = ()=>{
  
    console.log("click")
   
   
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
       
      };
    return (
        <>
 <Dialog open={open} onClose={handleClose}>
     <div style={{position:"absolute",right:30,top:20}}><CancelIcon className="icon"/></div>
        <DialogTitle>Game A Toll</DialogTitle>
        <DialogContent sx={{ width: 420 }}>
     <div classsName="time">
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
          </div>
          <div className="time">
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
          </div>
          <div className="time">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <MobileTimePicker
                label="Game Time End"
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />

            </Stack>
          </LocalizationProvider>
          </div>
          {/* <div className="file_upload"> 
          <input type="file" id="actual-btn" onChange={(e)=>{setImageName(e.target.files[0].name);console.log(e.target.files[0])}} hidden />
         
  
        <label for="actual-btn">Game Image Upload</label>
        <div style={{margin:10}}>{imageName}</div> */}
          {/* </div> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Submit</Button>
        </DialogActions>
      </Dialog> 
        </>
    )
}





  return (
      <div style={{width:"80%",margin:"auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2>Game Management</h2>
          <div  title="Add Game" onClick={()=>[setOpen(!open)]}><AddCircleOutlineIcon sx={{fontSize:35,cursor:"pointer"}}/></div>
          
          </div>
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Game Image</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Start Time</TableCell>
            <TableCell align="right">End Time</TableCell>
            <TableCell align="center">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="center"><ion-icon class="del-icon" name="trash-outline"></ion-icon></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
{open && <Popup/>}
    </div>
  );
}
