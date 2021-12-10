import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import TransactionManagementTable from "./TransactionManagementTable.jsx"
import './TransactionManagement.css'
function TransactionManagement() {
  const [transaction, setTransaction]=React.useState([]);
    const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleChange = (newValue) => {
    setValue(newValue);
  };



  React.useEffect(async ()=>{
    let response = await fetch(process.env.REACT_APP_PROXY+'/transaction',{method:'GET'})
    response = await response.json();
    setTransaction(response.transaction)
    console.log(response.transaction)
    // if(response.status) {
     
    // }
  },[])


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
         <TransactionManagementTable transactionData={transaction}/>
            
        </div>
    )
}

export default TransactionManagement
