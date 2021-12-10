import * as React from "react";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Snackbar from "@mui/material/Snackbar";
import './GameTable.css'
import ConfirmPopup from "../ConfirmPopup/ConfirmPopup";
import { fetchData } from "../../middleware/RequestHandler";

const columns = [
  { id: "image", label: "Image", minWidth: 170 },
  { id: "name", label: "Name", minWidth: 100 },
  {
    id: "entryFee",
    label: "Entry Fee",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
];


export default function GameTable({data,updateData}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows,setRows] = React.useState([]);
  const [snackbar,setSnackbar] = React.useState({open:false,message:""})
  const [state, setState] = React.useState({
    Transition: Fade,
  });
  const [openConfirmPopup,setOpenConfirmPopup] = React.useState({status:false,gameId:null});
  React.useEffect(()=>{
    console.log(data)
    setRows(data)
  },[data])

  const deleteGame = async (game) => {
    if(!openConfirmPopup.status) {
      return;
    }
    let response = await fetchData('/deleteGame',{method:'POST',body:JSON.stringify({gameId:openConfirmPopup.gameId})});
    setSnackbar({open:false,message:""})
    setSnackbar({open:true,message:response.message})
    if(response.isSuccess) {
      updateData(openConfirmPopup.gameId);
    }
    setOpenConfirmPopup({status:false,gameId:null})
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  return (
    <>
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
              <TableCell align="right">Delete game</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      if(column.id == "image") {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <img style={{width:50,borderRadius:"50%"}} src={process.env.REACT_APP_PROXY+'/images/game/'+value} />
                        </TableCell>
                        )
                      }
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                    <TableCell onClick={()=>{setOpenConfirmPopup({status:true,gameId:row._id})}} align="right"><ion-icon class="del-icon" name="trash-outline"></ion-icon></TableCell>
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
    {openConfirmPopup.status && <ConfirmPopup handleClose={()=>setOpenConfirmPopup({status:false,gameId:null})} confirm={deleteGame}/>}
    <Snackbar
        open={snackbar.open}
        TransitionComponent={state.Transition}
        message={snackbar.message}
        autoHideDuration={6000}
      />
    </>
    
  );
}