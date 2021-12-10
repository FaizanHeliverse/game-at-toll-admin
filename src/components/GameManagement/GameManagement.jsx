import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Fade from "@mui/material/Fade";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ImageUploading from 'react-images-uploading';
import FormControl from "@mui/material/FormControl";
import Snackbar from "@mui/material/Snackbar";
import Select from "@mui/material/Select";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Stack from "@mui/material/Stack";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import MobileTimePicker from "@mui/lab/MobileTimePicker";
import GameTable from "../GameTable/GameTable";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { fetchData } from "../../middleware/RequestHandler";
import axios from "axios";

export default function GameTime(props) {
  console.log(props);
  const [open, setOpen] = React.useState(false);
  const [game, setGame] = React.useState("");
  const [allGame,setAllGames] = React.useState([]);
  const maxNumber = 69;
  const [value, setValue] = React.useState(
    new Date("2018-01-01T00:00:00.000Z")
  );
  // const [openAddGamePopup,setAddGamePopup]=React.useState('false')

  React.useEffect(async()=>{
    let response = await fetch(process.env.REACT_APP_PROXY+'/games',{method:'GET'})
    response = await response.json();
    if(response.status) {
      // console.log(response.games)
      setAllGames(response.games);
    }
  },[])

  const AddGamePopup = () => {
    const [snackbar,setSnackbar] = React.useState({open:false,message:""})
    const [images, setImages] = React.useState([]);
    const [gameInputState,setGameInputState] = React.useState({name:"",image:"",entryFee:10})
    const [state, setState] = React.useState({
      Transition: Fade,
    });
    
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleChange = (event) => {
      setGame(event.target.value);
    };

    const uploadImage = async () => {
      console.log(images[0].file)
      var data = new FormData();
      data.append("file",images[0].file)
      const response = await axios.post(process.env.REACT_APP_PROXY + '/uploadGameImage',data)
      setGameInputState({...gameInputState,image:response.data.name})
      setImages([])
      return response.data.name;
    }

    const handleSubmit = async () => {
      const imageName = await uploadImage();
      const response = await fetchData('/saveGame',{method:'POST',body:JSON.stringify({...gameInputState,image:imageName})});
      setSnackbar({open:false,message:""})
      setSnackbar({open:true,message:response.message})
      if(response.isSuccess) {
        setAllGames((allGames)=>[...allGames,response.newGame]);
        setOpen(false)
        setGameInputState({name:"",image:"",entryFee:null})
      }
    }

    const handleClose = () => {
      setOpen(false);
    };
    return (
      <>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Game</DialogTitle>
          <DialogContent sx={{ width: 420 }}>
          <TextField
          id="full-width-text-field"
          label="Game name"
          placeholder="Game name"
          margin="normal"
          value={gameInputState.name}
          onChange={(e)=>setGameInputState({...gameInputState,name:e.target.value})}
          fullWidth // this may override your custom width
          />
          {/* <TextField
          id="full-width-text-field"
          label="Entry Fee"
          value={gameInputState.entryFee}
          onChange={(e)=>setGameInputState({...gameInputState,entryFee:e.target.value})}
          placeholder="Entry Fee"
          margin="normal"
          fullWidth // this may override your custom width
          /> */}
{/* <div className="file_upload"> 
          <input type="file" id="actual-btn" onChange={(e)=>{setImageName(e.target.files[0].name);console.log(e.target.files[0])}} hidden />
         
  
        <label for="actual-btn">Upload Game Image </label>
        <div style={{margin:10}}>{imageName}</div>
          </div> */}

      <ImageUploading
        multiple
        value={images}
        onChange={(imageList, addUpdateIndex) => {
          // data for submit
          console.log(imageList, addUpdateIndex);
          setImages(imageList);
        }}
        maxNumber={1}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper" style={{border:"1px dashed black"}}>
            { imageList.length == 0 &&  <div
              style={isDragging ? { backgroundColor:"whitesmoke",textAlign:'center',cursor:"pointer",padding:"20px" } : {textAlign:'center',cursor:"pointer",padding:"20px"}}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or drop here
            </div>}
            {imageList.map((image, index) => (
              <div key={index} className="image-item" style={{textAlign:'center'}}>
                <img src={image['data_url']} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                <Button onClick={() => onImageRemove(index)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
           
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
        open={snackbar.open}
        TransitionComponent={state.Transition}
        message={snackbar.message}
        autoHideDuration={6000}
      />
      </>
    );
  };

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Game Management</h2>
        <div
          title="Add Game"
          onClick={() => {
            setOpen(true);
            console.log("add game popup");
          }}
        >
          <AddCircleOutlineIcon sx={{ fontSize: 35, cursor: "pointer" }} />
        </div>
      </div>

      <GameTable data={allGame} updateData={(gameId)=>{
        const newRows =  allGame.filter(function( obj ) {
        return obj._id !== gameId;
      });
      setAllGames(newRows);}}/>
      {open && <AddGamePopup />}
    </div>
  );
}
