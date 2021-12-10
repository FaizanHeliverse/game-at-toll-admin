import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
  { id: 'email',align:'left', label: 'Email', minWidth: 170 },
  { id: 'sessionId', align:'center',label: 'Transaction ID', minWidth: 100 },
  {
    id: 'updatedAt',
    label: 'Date',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'amount',
    label: 'Amount',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'type',
    label: 'Status',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toFixed(2),
  },
];

function createData(email, sessionId, updatedAt, amount,type) {
//   const density = population / size;
  return { email, sessionId, updatedAt, amount,type};
}

// const rows = [
//   createData('India', 'IN', 1324171354, 3287263,'credit'),
//   createData('China', 'CN', 1403500365, 9596961,'debit'),
//   createData('Italy', 'IT', 60483973, 301340, 'add_wallet'),
//   createData('United States', 'US', 327167434, 9833520,'credit'),
//   createData('Canada', 'CA', 37602103, 9984670,'credit'),
//   createData('Australia', 'AU', 25475400, 7692024,'credit'),
//   createData('Germany', 'DE', 83019200, 357578,'credit'),
//   createData('Ireland', 'IE', 4857000, 70273,'credit'),
//   createData('Mexico', 'MX', 126577691, 1972550,'credit'),
//   createData('Japan', 'JP', 126317000, 377973,'credit'),
 
// ];


export default function TransactionManagementTable({transactionData}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows,setRows]=React.useState([transactionData])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  React.useEffect(()=>{
    console.log(transactionData)
    setRows(transactionData)
  },[transactionData])

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id == "updatedAt" ? new Date(value).toLocaleDateString()
                          :
                          (column.format && typeof value === 'number'
                            ? column.format(value)
                            : value ?? "N/A")
                            }
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
