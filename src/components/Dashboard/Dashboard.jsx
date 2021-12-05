    import React from 'react';
    import './Dashboard.css';
    import UserTable from '../Table/UserTable';
    import Graphs from '../Graphs/Graphs'

    function Dashboard() {
        let today = new Date().toISOString().slice(0, 10)

console.log(today)
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

           <div className="today_match_user_table">
               <h2>Today Active Match User</h2>
               <UserTable/>
            
                  </div>
                  <div className="graph">
                      <h2>Last 7 Days Matches</h2>
                  <Graphs/>
                  </div>
                 
          
            </div>
        )
    }

    export default Dashboard
