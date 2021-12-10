import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { fetchData } from "../../middleware/RequestHandler";
import ViewerView from "../ViewerView/ViewerView";
import "./VisitorView.css"

function VisitorsView(props) {
 
  const [currentMatchStatus, setCurrentMatchStatus] = useState(false);
  const [activeBatch,setActiveBatch] = useState(null);

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
          <ViewerView channel="game-a-toll-screen-one" batch={activeBatch} />
        </div>
        <div className="viewer_camera_one">
          <ViewerView channel="game-a-toll-camera-one" batch={activeBatch} />
        </div>
      </div>
      <div className="visitor_viewer">
        <div className="viewer_screen">
          <ViewerView channel="game-a-toll-screen-two" batch={activeBatch} />
        </div>
        <div className="viewer_camera_two">
          <ViewerView channel="game-a-toll-camera-two" batch={activeBatch} />
        </div>
      </div>
    </div>
  );
}

export default VisitorsView;
