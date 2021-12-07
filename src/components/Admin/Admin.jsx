import React from 'react'
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Dashboard from '../Dashboard/Dashboard'
import ScheduleManagement from '../ScheduleManagement/ScheduleManagement'
import GameTime from '../GameTime/GameTime';

function Admin(props) {
    const [type,setType]=React.useState("dashboard")
    const [openDashboard, setOpenDashboard]=React.useState(true);
    const [openProfile,setOpenProfile]=React.useState(false);
    const [openGameTime,setOpenGameTime]=React.useState(false);
 let handleChange=(data,open)=>{
     console.log(data);
    setType(data);
    if(data=="dashboard"){
        setOpenDashboard(true);
        setOpenProfile(false);
        setOpenGameTime(false)

    }
    else if(data=="gameTime"){
        setOpenDashboard(false);
        setOpenProfile(true);
        setOpenGameTime(false);
    }
    else if(data=="addgame"){
        setOpenDashboard(false);
        setOpenProfile(false);
        setOpenGameTime(true);
    }
 }

//  let gameHandleChange=(data)=>{
//     setOpenProfile(data);
// gameHandleChange={gameHandleChange}
//  }

    return (
        <div>
            <Sidebar handleChange={handleChange}/>
            <Header />
           { openDashboard && <Dashboard/>}
           {openProfile &&  < GameTime  handleChange={handleChange} />}
            { openGameTime &&<ScheduleManagement handleChange={handleChange}/>}
        </div>
    )
}

export default Admin
