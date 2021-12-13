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
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange, deepPurple } from '@mui/material/colors';


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
       <Avatar sx={{ bgcolor: deepOrange[500],marginRight:4}}>A</Avatar>
       {/* <seclect>
         <option>User Profile</option>
       </seclect> */}
       {/* <div style={{marginRight:10}}>Admin Name</div> */}
      <div></div>
    </div>
              

            </div>
            
        </div>
    )
}

export default Header
