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
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Snackbar from "@mui/material/Snackbar";
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
import './ScheduleManagement.css'
import { fetchData } from '../../middleware/RequestHandler';
import ConfirmPopup from '../ConfirmPopup/ConfirmPopup';
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function ScheduleManagement() {
  const classes = useStyles();
 

  const [open, setOpen] = React.useState(false);
  const [allGames,setAllGames] = React.useState([])
  const [allSchedules,setAllSchedules] = React.useState([]);
  const [snackbar,setSnackbar] = React.useState({open:false,message:""})
  const [openConfirmPopup,setOpenConfirmPopup] = React.useState({status:false,day:null,startTime:null,endTime:null});
  const [currimageName,setCurrImageName]=React.useState("")
  const [state, setState] = React.useState({
    Transition: Fade,
  });

  React.useEffect(async ()=>{
    let response = await fetch(process.env.REACT_APP_PROXY+'/games',{method:'GET'})
    response = await response.json();
    if(response.status) {
      setAllGames(response.games);
    }
  },[])

  React.useEffect(async ()=>{
    const response = await fetchData('/schedules',{method:'GET'})
    if(response.isSuccess) {
      setAllSchedules(response.data)
      setOpen(false)
    }

  },[])

const Popup = ()=>{
  
    console.log("click")
    console.log(open);
   
   
    const [game, setGame] = React.useState("");
    const [day, setDay] = React.useState("");
    const [inputState,setInputState] = React.useState({gameId:null,day:null,startTime:null,endTime:null,commission:null});
    const [endTime, setEndTime] = React.useState(null);
    const [startTime, setStartTime] = React.useState(null);
    const handleChange = (event) => {
        setGame(event.target.value);
        setInputState({...inputState,gameId:event.target.value});
      };
    const handleChangeDay = (event) => {
      setDay(event.target.value);
      setInputState({...inputState,day:event.target.value});
    };
    
      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
       
      };

      

    const handleSubmit = async () => {
      const response = await fetchData('/updateSchedule',{method:'POST',body:JSON.stringify({
        gameId: inputState.gameId,
        startTime: inputState.startTime,
        endTime: inputState.endTime,
        commission: inputState.commission,
        day: inputState.day
      })});
      setSnackbar({open:false,message:""})
      setSnackbar({open:true,message:response.message})
      if(response.isSuccess) {
        setAllSchedules([...allSchedules,response.data])
      }
      setOpen(false);
    }


    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];



    return (
        <>
        
 <Dialog open={open} onClose={handleClose}>
     {/* <div style={{position:"absolute",right:30,top:20}}  ><CancelIcon onClick={setOpen(false)} className="icon"/></div> */}
        <DialogTitle>Game A Toll</DialogTitle>
        <div style={{width:"90%",margin:"auto",border:"0.5px solid whitesmoke"}}></div>
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
                onChange={(handleChange)}
              >
                {allGames.map((v)=>{
                  return  <MenuItem value={v._id}>{v.name}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ minWidth: 120, marginBottom: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" sx={{ width: "100ch" }}>
                Select Day
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={day}
                label="Select Day"
                onChange={(handleChangeDay)}
              >
                {days.map((v)=>{
                  return  <MenuItem value={v.toLowerCase()}>{v}</MenuItem>
                })}
              </Select>
            </FormControl>
          </Box>
          </div>
          <TextField
          id="full-width-text-field"
          label="Commission"
          value={inputState.commission}
          onChange={(e)=>setInputState({...inputState,commission:e.target.value})}
          placeholder="Commission"
          margin="normal"
          fullWidth // this may override your custom width
          />
          <div className="time">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
              <MobileTimePicker
                label="Game Time Start"
                value={startTime}
                onChange={(newValue) => {
                  let date = new Date(newValue)
                  let hour = (String(date.getHours()).length == 1) ? '0'+date.getHours() : date.getHours();
                  let minute = (String(date.getMinutes()).length == 1) ? '0'+date.getMinutes() : date.getMinutes();
                  let time = hour + ':' + minute;
                  setInputState({...inputState,startTime: time});
                  setStartTime(newValue)
                }}
                ampm={false}
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
                value={endTime  }
                onChange={(newValue) => {
                  let date = new Date(newValue)
                  let hour = (String(date.getHours()).length == 1) ? '0'+date.getHours() : date.getHours();
                  let minute = (String(date.getMinutes()).length == 1) ? '0'+date.getMinutes() : date.getMinutes();
                  let time = hour + ':' + minute;
                  setInputState({...inputState,endTime: time});
                  setEndTime(newValue)
                }}
                ampm={false}
                renderInput={(params) => <TextField {...params} />}
              />

            </Stack>
          </LocalizationProvider>
          </div>
    
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog> 
        </>
    )
}


// React.useEffect(()=>{
//   console.log("use effect is open ")
//   {open && <Popup/>}
// },[open])

  const deleteSchedule = async () => {
    if(!openConfirmPopup.status) return;
    const response = await fetchData('/deleteSchedule',{method:'POST',body:JSON.stringify({
      day:openConfirmPopup.day,
      startTime: openConfirmPopup.startTime,
      endTime: openConfirmPopup.endTime,
    })})
    setSnackbar({open:false,message:""})
    setSnackbar({open:true,message:response.message})
    if(response.isSuccess) {
      const newRows = allSchedules.filter(function(obj) {
        return !(obj.day == openConfirmPopup.day && obj.startTime == openConfirmPopup.startTime && obj.endTime == openConfirmPopup.endTime)
      })
      setAllSchedules(newRows);
      setOpenConfirmPopup({status:false,day:null,startTime:null,endTime:null});
    }
  }

  return (
      <div style={{width:"80%",margin:"auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2>Schedule Management</h2>
          <div  title="Add Game" onClick={()=>{setOpen(true);
          console.log("add game popup")}}><AddCircleOutlineIcon sx={{fontSize:35,cursor:"pointer"}}/></div>
          
          </div>
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Day</TableCell>
            <TableCell align="center">Game</TableCell>
            <TableCell align="center">Start Time</TableCell>
            <TableCell align="center">End Time</TableCell>
            <TableCell align="center">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allSchedules.map((row) => (
            <TableRow key={row.day}>
              <TableCell component="th" align="center" scope="row">
                {row.day}
              </TableCell>
              <TableCell align="center">{row.gameName}</TableCell>
              <TableCell align="center">{row.startTime}</TableCell>
              <TableCell align="center">{row.endTime}</TableCell>
              <TableCell onClick={()=>{setOpenConfirmPopup({status:true,day:row.day,startTime:row.startTime,endTime:row.endTime})}} align="center"><ion-icon class="del-icon" name="trash-outline"></ion-icon></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    {openConfirmPopup.status && <ConfirmPopup handleClose={()=>setOpenConfirmPopup({status:false,day:null,startTime:null,endTime:null})} confirm={deleteSchedule}/>}
    {open && <Popup/>}
    <Snackbar
        open={snackbar.open}
        TransitionComponent={state.Transition}
        message={snackbar.message}
        autoHideDuration={6000}
      />
    </div>
  );
}
