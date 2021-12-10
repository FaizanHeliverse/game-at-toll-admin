import React from "react";
import "./Dashboard.css";
import GameTable from "../GameTable/GameTable";
import Graphs from "../Graphs/Graphs";
import BarGraph from "../Graphs/BarGraph"
import { fetchData } from "../../middleware/RequestHandler";

function Dashboard() {
  const [gameMostPlayed, setGameMostPlayed] = React.useState([]);

  React.useEffect(async () => {
    const response = await fetchData("/getMostPlayedGames", { method: "GET" });
    console.log(response);

 
    setGameMostPlayed(response);
    
  }, []);

  let today = new Date().toISOString().slice(0, 10);

  console.log(today);
  return (
    <div className="dashboard_container">
      <h1>Dashboard</h1>
      <div className="match">
        <h2>Today Match</h2>
        <h2>{today}</h2>
      </div>
      <div className="box">
        <div className="sub_box">
          <div>Total Matches</div>
          <h2>23</h2>
        </div>
        <div className="sub_box">
          <div>Game Name</div>
          <h2>PupG</h2>
        </div>

        <div className="sub_box">
          <div>Match Start</div>
          <h2>2:40 P.M</h2>
        </div>
        <div className="sub_box">
          <div>Match fees Today</div>
          <h2>$10</h2>
        </div>
      </div>
      <div className="graph">
          
        <BarGraph/>
        <Graphs gameData={gameMostPlayed} />
        
      </div>

      <div className="today_match_user_table">
        <h2>Today Active Match User</h2>
        <GameTable data={[]} />
      </div>
      
    </div>
  );
}

export default Dashboard;
