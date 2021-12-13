import React, { useEffect } from 'react'
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Dashboard from '../Dashboard/Dashboard'
import ScheduleManagement from '../ScheduleManagement/ScheduleManagement'
import GameManagement from '../GameManagement/GameManagement';
import UserManagement from '../UserManagement/UserManagement'
import UiManager from "../UiManager/UiManager"
import TransactionManagement from "../TransactionManagement/TransactionManagement"
import AdminView from '../AdminView/AdminView';
import Logout from "../Logout/Logout"
import { fabClasses } from '@mui/material';
import {fetchData} from '../../middleware/RequestHandler'
import { useHistory } from 'react-router';

function Admin(props) {
    const [type,setType]=React.useState("dashboard")
    const [openDashboard, setOpenDashboard]=React.useState(true);
    const [openSchedule,setOpenSchedule]=React.useState(false);
    const [openGameManagement,setOpenGameManagement]=React.useState(false);
    const [openuserManagement, setUserManagement]=React.useState(false);
    const [openLogout,setLogout]=React.useState(false);
    const [openLiveGame,setOpenLiveGame] = React.useState(false);
    const [adminLogout,setAdminLogout]=React.useState(false);
    const router = useHistory();
    useEffect(async()=>{
        const response = await (await fetch(process.env.REACT_APP_PROXY+'/verifyAdmin',{method:"GET",headers:{'Authorization':localStorage.accessToken}})).json();
        
        if(response.message != "Authorized")
            router.push('/signin')
    },[])
    const [openUimanager, setUimanager]=React.useState(false);
    const [openTransactionManagement,setTransactionMnanagement]=React.useState(false);
 let handleChange=(data,open)=>{
     console.log(data);
    setType(data);
    if(data=="dashboard"){
        setOpenLiveGame(false);
        setOpenDashboard(true);
        setOpenSchedule(false);
        setOpenGameManagement(false)
        setUserManagement(false)
        setUimanager(false)
        setTransactionMnanagement(false)
        setLogout(false)

    }
    else if(data=="gameTime"){
        setOpenDashboard(false);
        setOpenLiveGame(false);
        setOpenSchedule(true);
        setOpenGameManagement(false);
        setUserManagement(false)
        setUimanager(false)
        setTransactionMnanagement(false)
        setLogout(false)

    }
    else if(data=="addgame"){
        setOpenDashboard(false);
        setOpenSchedule(false);
        setUserManagement(false)
        setUimanager(false)
        setOpenLiveGame(false);
        setOpenGameManagement(true);
        setTransactionMnanagement(false)
        setLogout(false)

    }
    else if(data=="userManagement")
    {
        setOpenDashboard(false);
        setOpenSchedule(false);
        setOpenGameManagement(false);
        setUimanager(false)
        setTransactionMnanagement(false)
        setLogout(false)
        setOpenLiveGame(false);
        setUserManagement(true)
    }
    else if(data=="uiManager"){
        setOpenDashboard(false);
        setOpenSchedule(false);
        setOpenGameManagement(false);
        setUserManagement(false)
        setTransactionMnanagement(false)
        setLogout(false)
        setOpenLiveGame(false);
        setUimanager(true)
    }
    else if(data=="transactionManagement")
    {
        setOpenDashboard(false);
        setOpenSchedule(false);
        setOpenGameManagement(false);
        setUserManagement(false)
        setUimanager(false)
        setOpenLiveGame(false);
        setTransactionMnanagement(true)
        setLogout(false)

    }
    else if(data == "liveGame") {
        setOpenDashboard(false);
        setOpenSchedule(false);
        setOpenGameManagement(false);
        setUserManagement(false)
        setUimanager(false)
        setTransactionMnanagement(false)
        setLogout(false)
        setOpenLiveGame(true);
    }
    // else if(data=="logout"){
    //     setOpenDashboard(false);
    //     setOpenSchedule(false);
    //     setOpenGameManagement(false);
    //     setUserManagement(false)
    //     setUimanager(false)
    //     setTransactionMnanagement(false)
    //     setLogout(true)
    // }
 }

 let logout=(data)=>{
    setLogout(data);
// gameHandleChange={gameHandleChange}
 }

    return (
        <div>
            <Sidebar handleChange={handleChange} logout={logout}/>
            <Header />
            { openDashboard && <Dashboard/>}
            {openSchedule &&  < GameManagement  handleChange={handleChange} />}
            { openGameManagement &&<ScheduleManagement handleChange={handleChange}/>}
            { openuserManagement &&<UserManagement handleChange={handleChange}/>}
            { openUimanager&&<UiManager handleChange={handleChange}/>}
            {openTransactionManagement && <TransactionManagement handleChange={handleChange}/> }
            {openLogout&&<Logout openLogout={openLogout}/>}
            {openLiveGame && <AdminView />}

        </div>
    )
}

export default Admin
