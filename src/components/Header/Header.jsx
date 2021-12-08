import React from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import './Header.css'
import { roundToNearestMinutes } from 'date-fns';
import { Router } from '@mui/icons-material';
import { useHistory } from 'react-router';

function Header() {
    const [age, setAge] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const router = useHistory();
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

    return (
        <div className="header_container">
            <div className="header">
            <div className="left">
            <div onClick={()=>router.push('/admin')}><ion-icon style={{cursor:"pointer",fontSize:"40px",marginRight:15}} name="play-outline"></ion-icon></div>
  
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-controlled-open-select-label">user</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>Admin</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </div>
              

            </div>
            
        </div>
    )
}

export default Header
