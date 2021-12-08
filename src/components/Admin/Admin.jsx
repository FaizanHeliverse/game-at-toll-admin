import React from 'react'
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Dashboard from '../Dashboard/Dashboard'
import ScheduleManagement from '../ScheduleManagement/ScheduleManagement'
import GameManagement from '../GameManagement/GameManagement';
import UserManagement from '../UserManagement/UserManagement'
import { fabClasses } from '@mui/material';

function Admin(props) {
    const [type,setType]=React.useState("dashboard")
    const [openDashboard, setOpenDashboard]=React.useState(true);
    const [openSchedule,setOpenSchedule]=React.useState(false);
    const [openGameManagement,setOpenGameManagement]=React.useState(false);
    const [openuserManagement, setUserManagement]=React.useState(false);
 let handleChange=(data,open)=>{
     console.log(data);
    setType(data);
    if(data=="dashboard"){
        setOpenDashboard(true);
        setOpenSchedule(false);
        setOpenGameManagement(false)
        setUserManagement(false)

    }
    else if(data=="gameTime"){
        setOpenDashboard(false);
        setOpenSchedule(true);
        setOpenGameManagement(false);
        setUserManagement(false)
    }
    else if(data=="addgame"){
        setOpenDashboard(false);
        setOpenSchedule(false);
        setUserManagement(false)
        setOpenGameManagement(true);
    }
    else if(data=="userManagement")
    {
        setOpenDashboard(false);
        setOpenSchedule(false);
        setOpenGameManagement(false);
        setUserManagement(true)
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
           {openSchedule &&  < GameManagement  handleChange={handleChange} />}
            { openGameManagement &&<ScheduleManagement handleChange={handleChange}/>}
            { openuserManagement &&<UserManagement handleChange={handleChange}/>}

        </div>
    )
}

export default Admin
