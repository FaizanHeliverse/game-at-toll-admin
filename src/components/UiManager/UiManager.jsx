import React from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import bannerImage from "../../assests/images/game_a_toll.png";
import "./UiManager.css";
function UiManager() {
  const [open, setOpen] = React.useState(false);
  const [openChangeBanner,setChangeBanner]=React.useState(false);


function BannerPopup(){
    const [imageName,setImageName]=React.useState("")
    const [previewImage,setPreviewImage]=React.useState(false);
    const [heading,setHeading]=React.useState("");
    const [image, setImage]=React.useState('');

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    
    return(
        <>
        <Dialog open={open} onClose={handleClose}>
        <DialogContent sx={{ width: 420 }}>
        <DialogTitle>Banner</DialogTitle>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText> */}
            <TextField
          id="full-width-text-field"
          label="Banner Heading"
         onChange={(e)=>{
             setHeading(e.target.value)
         }}
               placeholder="Banner Heading"
          margin="normal"
          fullWidth // this may override your custom width
          />
          <div className="file_upload"> 
          <input type="file" id="actual-btn" onChange={(e)=>{setImageName(e.target.files[0].name);console.log(e.target.files[0]);setImage(URL.createObjectURL(e.target.files[0]))}} hidden />
         
  
        <label for="actual-btn">Upload Banner Image </label>
        <div style={{margin:10}}>{imageName}</div>
          </div>

 {
     previewImage && <div className="pre_banner">
           <div className="pre_banner_text">
            <h1>
            {heading}
          </h1> </div>
        <div className="pre_banner_image">
          <img src={image} />
        </div>
         
     </div>
 }


        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={()=>{setPreviewImage(true)}}>Preview</Button>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions>
        </Dialog>
        </>
    )
}




  return (
    <div className="ui_container">
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Banner Image</h2>
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

    </div> 
      <div className="curent_banner">
          <div>
      <div className="banner_text">
          {/* <h1>
            Play Game <br /> Everyday.
            <br />
            Always be   <br />
            Winner.
          </h1> */}
          <h1>
              Play Game Everyday.
              Always be Winner
          </h1>
         
        </div>
        <div className="banner_image">
          <img src={bannerImage} />
        </div>
        </div>

      </div>
      {open&&<BannerPopup/>}
    </div>
  );
}

export default UiManager;
