import React from 'react'
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Dashboard from '../Dashboard/Dashboard'
import GameTime from '../GameTime/GameTime';

function Admin(props) {
    const [type,setType]=React.useState("dashboard")
    const [openDashboard, setOpenDashboard]=React.useState(true);
    const [openProfile,setOpenProfile]=React.useState(false);
 let handleChange=(data,open)=>{
     console.log(data);
    setType(data);
    if(data=="dashboard"){
        setOpenDashboard(true);
        setOpenProfile(false);

    }
    else if(data=="gameTime"){
        // setOpenDashboard(false);
        setOpenProfile(true);
    }
 }

 let gameHandleChange=(data)=>{
    setOpenProfile(data);
 }

    return (
        <div>
            <Sidebar handleChange={handleChange}/>
            <Header />
           { openDashboard && <Dashboard/>}
           {  <GameTime  profile={openProfile} gameHandleChange={gameHandleChange}/>}
            
        </div>
    )
}

export default Admin
