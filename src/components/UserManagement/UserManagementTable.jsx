import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Stack from "@mui/material/Stack";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import MobileTimePicker from "@mui/lab/MobileTimePicker";
import { fetchData } from '../../middleware/RequestHandler';

function createData(name, calories, fat, carbs,price) {
  return {
    name,
    calories,
    fat,
    carbs,
 
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}

function Row(props) {
  const { row} = props
  const [open, setOpen] = React.useState(false);
  // const [game, setGame] = React.useState("active")

  const handleChange = async(event) => {
    console.log(event.target)
    const response = await fetchData('/updateUserStatus',{method:'POST',body:JSON.stringify({userId:event.target.name,status:event.target.value})})
    props.updateRow(event.target.value)
  };

  const formatDate = (d) => {
    const date = new Date(d)
    return date.toLocaleDateString()
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          <img style={{height:50}} src={process.env.REACT_APP_PROXY+"/images/user/"+row.user.image}></img>
        </TableCell>
        <TableCell align="center">{row.user.username}</TableCell>
        <TableCell align="center">{row.user.amount}</TableCell>
        <TableCell align="center">{formatDate(row.user.createdAt)}</TableCell>
        <TableCell align="center">
        <Box sx={{ minWidth: 120, marginBottom: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" sx={{ width: "10ch" }}>
                User Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={row.user.status}
                label="Select User Status"
                onChange={(e)=>{handleChange(e,)}}
                name={row.user._id}
              >
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="notconfirmed">Not Confirmed</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
                
              </Select>
            </FormControl>
          </Box>
        </TableCell>
      
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Match History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">S.No.</TableCell>
                    <TableCell align="center">Opponent</TableCell>
                    <TableCell align="center">Game</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.length == 0 && <> <TableRow > 
                    <TableCell align="center">{}</TableCell>
                    <TableCell align="right">No History</TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    </TableRow> </>}
                  {row.history.map((historyRow,k) => (
                    <TableRow key={historyRow.opponent}>
                      <TableCell align="center">{k+1}</TableCell>
                      <TableCell align="center" component="th" scope="row">
                        {historyRow.opponent}
                      </TableCell>
                      <TableCell align="center">{historyRow.gameName}</TableCell>
                      <TableCell align="center">{historyRow.status ? "WON":"LOSE"}</TableCell>
                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};


export default function UserManagementTable({data}) {

  const [rows,setRows] = React.useState([]);
  React.useEffect(()=>{
    setRows(data);
  },[data])

  return (
    <>
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="center">Profile Image</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Credit</TableCell>
            <TableCell align="center">Date of Joining</TableCell>
            <TableCell align="center">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.user._id} row={row} updateRow={(status)=>{
              let newRow = rows;
              newRow = newRow.map((v)=>{
                if(v.user._id == row.user._id) {
                  v.user.status = status;
                }
                return v;
              })
              console.log(newRow)
              setRows(newRow);
            }}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <div style={{marginBottom:100}}></div>
    </>
  );
}
