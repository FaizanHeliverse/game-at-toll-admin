import React from "react";
import "./Dashboard.css";
import GameTable from "../GameTable/GameTable";
import Graphs from "../Graphs/Graphs";
import BarGraph from "../Graphs/BarGraph"
import { fetchData } from "../../middleware/RequestHandler";
import LineGraph from "../Graphs/LineGraph";

function Dashboard() {
  const [gameMostPlayed, setGameMostPlayed] = React.useState({labels:[],data:[]});
  const [eachMatchProfit,setEachMatcProfit]=React.useState({
    dates:[],data:[]
  });
  const [user,setuser]=React.useState({
    date:[],count:[]
  });
  const [stats,setStats] = React.useState({profit:0,creditAmount:0,debitAmount:0,profit:0});

  React.useEffect(async () => {
    const response = await fetchData("/getMostPlayedGames", { method: "GET" });
    console.log(response);
    setGameMostPlayed(response);
  }, []);

  React.useEffect(async ()=> {
    const response = await fetchData('/getMetaTransaction',{method:'GET'});
    console.log(response);
    setStats(response)
    const prresponse = await fetchData('/profit',{method:'GET'});
    console.log(prresponse);
    setEachMatcProfit(prresponse);
    const userData = await fetchData('/user',{method:'GET'});
    console.log(userData);
    setuser(userData)
  },[])

  let today = new Date().toISOString().slice(0, 10);

  console.log(today);
  return (
    <div className="dashboard_container">
      <h1>Dashboard</h1>
      <div className="match">
        <h2>Statistics</h2>
        <h2>{new Date().toLocaleDateString()}</h2>
      </div>
      <div className="box">
        <div className="sub_box">
          <div>Profit</div>
          <h2>{stats.profit}</h2>
        </div>
        <div className="sub_box">
          <div style={{textAlign:'center'}}>Amount Credited</div>
          <h2>{stats.creditAmount}</h2>
        </div>

        <div className="sub_box">
          <div>Amount Debited</div>
          <h2>{stats.debitAmount}</h2>
        </div>
        <div className="sub_box">
          <div>Games Played</div>
          <h2>{stats.totalGame}</h2>
        </div>
      </div>
      <div className="graph">
          
        <div ><LineGraph eachMatchProfit={eachMatchProfit}/></div>
        <div ><Graphs gameData={gameMostPlayed} /></div>
        
      </div>
      {/* <div ><BarGraph userData={user}/></div> */}


    
    </div>
  );
}

export default Dashboard;
