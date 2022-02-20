import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { fetchData } from "../../middleware/RequestHandler";
import ViewerView from "../ViewerView/ViewerView";
import {startMaster} from '../../utils/service'
import "./VisitorView.css"

function VisitorsView(props) {
 
  const [currentMatchStatus, setCurrentMatchStatus] = useState(false);
  const [activeBatch,setActiveBatch] = useState(null);
  const [cameraState,setCameraState] = useState(false);
  const [micState,setMicState] = useState(false);
  const [localStream,setLocalStream] = useState(null);
  const [signalingClient,setSignalingClient] = useState(null)
  // const [loaclStreamAvailable,setLocalStreamAvailable] = useState(false)
  // var localStream=null;
  let style = {cursor:'pointer',borderRadius:"50%",padding:10,margin:5}
  useEffect(async () => {
    const response = await fetchData("/getActiveMatch", { method: "GET" });
    if (response.status) {
      setCurrentMatchStatus(true);
      props.callback(response.message);
    }
  }, []);

  useEffect(async()=>{
    const response = await fetchData('/newViewer',{method:"GET"});
    if(!response.status) {
      return;
    }
    setActiveBatch(response.message)
  },[])

  // useEffect(async ()=>{
  //   setLocalStream(await navigator.mediaDevices.getUserMedia({
  //     video: { width: { ideal: 1280 }, height: { ideal: 720 } },
  //     audio: true,
  //   }));
  // },[])

  // useEffect(()=>{
  //   if(localStream) {
  //     console.log(localStream)
  //     setLocalStreamAvailable(true)
  //   }
  //   else setLocalStreamAvailable(false);
  // },[localStream])

  useEffect(async()=>{
    if(localStream) {
      console.log(localStream,"IN")
      setSignalingClient(await startMaster(localStream,'game-a-toll-admin-batch-0'))
      return;
    }
    console.log(localStream,"OUT")
  },[localStream])

  useEffect(async()=>{
    console.log(micState,cameraState)
    const response = await fetchData('/shareResource',{method:'POST',body:JSON.stringify({micState,cameraState})})
    if(!micState && !cameraState) {
      console.log(localStream,micState,cameraState)
      if(localStream)
      {
        localStream.getTracks().forEach(function(track) {
          track.stop();
        });
        if(signalingClient){
          console.log(signalingClient)
        signalingClient.close();}
      }
      return;
    }
    try {
      setLocalStream(await navigator.mediaDevices.getUserMedia (
        {
           video: cameraState,
           audio: micState
        }
     ));  
    } catch (err) {
      console.log(err)
    }
    
  },[micState,cameraState])

  const requestPermission = async (key) => {
    console.log("IN")
    if(key == "camera")setCameraState(!cameraState);
    if(key == "mic")setMicState(!micState);
  }

  if (!currentMatchStatus || activeBatch == null) {
    return (
      <div className="alert_center">
        There is no active match on the server.
      </div>
    );
  }

  return (
    <div className="viewer_view" style={props.style}>
      <div className="visitor_viewer">
        <div className="viewer_screen">
          <ViewerView channel="game-a-toll-camera-one" batch={activeBatch} />
        </div>
        <div className="viewer_camera_one">
          <ViewerView channel="game-a-toll-screen-one" batch={activeBatch} />
        </div>
      </div>
      <div className="visitor_viewer">
        <div className="viewer_screen">
          <ViewerView channel="game-a-toll-camera-two" batch={activeBatch} />
        </div>
        <div className="viewer_camera_two">
          <ViewerView channel="game-a-toll-screen-two" batch={activeBatch} />
        </div>
      </div>
      <div style={{position:"absolute",bottom:20,left:"48%",display:'flex'}}>
        <div onClick={()=>requestPermission("camera")} style={!cameraState ? {...style,background:"red"} : {...style,background:"#54a542"}}><ion-icon size="large" color="light" name="camera-outline"></ion-icon></div>
        <div onClick ={()=>requestPermission("mic")} style={!micState ? {...style,background:"red"} : {...style,background:"#54a542"}}><ion-icon size="large" color="light" name="mic-outline"></ion-icon></div>
      </div>
    </div>
  );
}

export default VisitorsView;
