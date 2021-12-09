import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import TransactionManagementTable from "./TransactionManagementTable.jsx"
import './TransactionManagement.css'
function TransactionManagement() {
    const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleChange = (newValue) => {
    setValue(newValue);
  };
    return (
        <div className="transaction_container">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                   <h1>Transaction Management</h1>
                   <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3}>
        <DesktopDatePicker
          label="Date "
          inputFormat="MM/dd/yyyy"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />

      </Stack>
    </LocalizationProvider>
            </div>
         <TransactionManagementTable/>
            
        </div>
    )
}

export default TransactionManagement
