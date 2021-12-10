import React,{ useEffect, useState } from "react";
import CustomizedSnackbars from "../Snackbar/Snackbar";
import VisitorsView from "../VisitorsView/VisitorsView";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";
import { Dialog } from "@mui/material";
import { fetchData } from "../../middleware/RequestHandler";
import "./AdminView.css"

// import Image from 'next/image';
export default function AdminView() {
  const [match, setMatch] = useState(null);
  const [winner, setWinner] = useState(null);
  const [open, setOpen] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState("");

  const router = useHistory();

  useEffect(async()=>{
    const response = await (await fetch(process.env.REACT_APP_PROXY+'/verifyAdmin',{method:"GET",headers:{'Authorization':localStorage.accessToken}})).json();
    if(response.message == "Unauthorized") {
      router.push('/')
    }
  },[])

  const handleChange = (event) => {
    setWinner(event.target.value);
  };

  const openPopup = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const finishGame = async () => {
    let payload = {
      winnerId: "",
      draw: false,
    };
    if (winner == "draw") {
      payload = { ...payload, draw: true };
    } else {
      payload = { ...payload, winnerId: winner };
    }

    const response = await fetchData("/v1/finishMatch", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setSnackBarMsg(response.message);
    setShowSnackBar(true);

    if (response.status) {
      window.location.reload();
    }
  };

  return (
    <div id="">
      <VisitorsView
        callback={(match) => {
          console.log("SUHAIL");
          setMatch(match);
        }}
      />
      {match && (
        <>
          <div className="fix-at-top">
            <div>{match.users[1].email}</div>
            <div style={{ fontWeight: "bolder" }}>
              <span
                style={{
                  border: "1px solid white",
                  borderRadius: "5px",
                  padding: "5px",
                  cursor: "pointer",
                }}
                onClick={openPopup}
              >
                Finish Game
              </span>
            </div>
            <div>{match.users[0].email}</div>
          </div>
          <Dialog open={open} sx={{ minWidth: "40%" }}>
            <div className="float-right" onClick={handleClose}>
              X
            </div>
            <div
              style={{
                display: "flex",
                padding: "30px 50px",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  padding: "20px 10px",
                }}
              >
                <div
                  className="row"
                  style={{ marginBottom: 20, border: "none" }}
                >
                  <img src={process.env.REACT_APP_PROXY+'/images/game/'+match.game.image} />
                </div>
                <span
                  className="row"
                  style={{ marginBottom: 20, border: "none" }}
                >
                  {match.game.name}
                </span>

                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Winner</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={winner}
                    label="Winner"
                    onChange={handleChange}
                  >
                    <MenuItem value={match.users[0]._id}>
                      {match.users[0].email}
                    </MenuItem>
                    <MenuItem value={match.users[1]._id}>
                      {match.users[1].email}
                    </MenuItem>
                    <MenuItem value={"draw"}>Draw</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  className="started_btn"
                  style={{ width: "100%", margin: 0, marginTop: 20 }}
                  onClick={finishGame}
                >
                  Finish Game
                </Button>
              </Box>
            </div>
          </Dialog>
        </>
      )}
      {showSnackBar && (
        <CustomizedSnackbars open={showSnackBar} message={snackBarMsg} />
      )}
    </div>
  );
}
