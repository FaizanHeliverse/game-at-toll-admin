import React, { useEffect } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import ImageUploading from 'react-images-uploading';
import DialogTitle from '@mui/material/DialogTitle';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import bannerImage from "../../assests/images/game_a_toll.png";
import "./UiManager.css";
import axios from "axios";
import { fetchData } from "../../middleware/RequestHandler";
import { set } from "date-fns/esm";
function UiManager() {
  const [open, setOpen] = React.useState(false);
  const [openChangeBanner,setChangeBanner]=React.useState(false);
  const [ui,setUI] = React.useState({heading:[],image:""});
  const [snackbar,setSnackbar] = React.useState({open:false,message:""})

  useEffect( async()=>{
    const response = await fetchData('/banner',{method:'GET'})
    setUI(response.data);
  },[])

function BannerPopup(){
    const [heading,setHeading]=React.useState("");
    const [images, setImages] = React.useState([]);

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

      const uploadImage = async()=>{
        console.log(images[0].file)
        var data = new FormData();
        data.append('file',images[0].file);
        const response = await axios.post(process.env.REACT_APP_PROXY + '/uploadBannerImage',data)
        setImages([]);
        return response.data.name;
      }
    
      const handleSubmit = async () => {
        const image = await uploadImage();
        const response = await fetchData('/changeBanner',{method:'POST',body:JSON.stringify({image,heading})})
        setSnackbar({open:false,message:""})
        setSnackbar({open:true,message:response.message})
        if(response.isSuccess) {
          setOpen(false)
          setUI({heading:heading.split('\n'),image})
          setHeading("");
        }
      }

    return(
        <>
        <Dialog open={open} onClose={handleClose}>
        <DialogContent sx={{ width: 420 }}>
        <DialogTitle>Banner</DialogTitle>
            <TextField
              multiline={true}
              id="full-width-text-field"
              label="Banner Heading"
              value = {heading}
              onChange={(e)=>{
                  setHeading(e.target.value)
              }}
              placeholder="Banner Heading"
              margin="normal"
              fullWidth
           />
          {/* <div className="file_upload"> 
          <input type="file" id="actual-btn" onChange={(e)=>{setImageName(e.target.files[0].name);console.log(e.target.files[0]);setImage(URL.createObjectURL(e.target.files[0]))}} hidden />
         
  
        <label for="actual-btn">Upload Banner Image </label>
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

 {/* {
     previewImage && <div className="pre_banner">
           <div className="pre_banner_text">
            <h1>
            {heading}
          </h1> </div>
        <div className="pre_banner_image">
          <img src={image} />
        </div>
         
     </div>
 } */}


        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {/* <Button onClick={()=>{setPreviewImage(true)}}>Preview</Button> */}
          <Button onClick={handleSubmit}>Save</Button>
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
          {ui.heading.map((v,i)=>{
            return ( <>
              {v}<br />
              </>
            )
          })}
          </h1>
         
        </div>
        <div className="banner_image">
          <img src={process.env.REACT_APP_PROXY + '/images/ui/'+ui.image} />
        </div>
        </div>
      </div>
      {open&&<BannerPopup/>}
      <div style={{marginBottom:100}}></div>
    </div>
  );
}

export default UiManager;
