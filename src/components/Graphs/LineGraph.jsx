



import React from "react";
import { Line } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)






function LineGraph(props) {
  console.log(props.eachMatchProfit)

  let dataLine = {
    // labels: props.eachMatchProfit.dates,
    labels: props.eachMatchProfit.dates.map((v)=>''),
    datasets: [
      {
        label: "Every Day Profit",
        fill: true,
        lineTension: 0.3,
        backgroundColor: "",
        borderColor: "rgb(205, 130, 158)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgb(205, 130,1 58)",
        pointBackgroundColor: "rgb(255, 255, 255)",
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgb(0, 0, 0)",
        pointHoverBorderColor: "rgba(220, 220, 220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: props.eachMatchProfit.pData
      }
    ]
  }
  return (
    <div>
      <MDBContainer>
        <h2 className="mt-5">Profit chart</h2>
        <Line height={400} width={400} data={dataLine } options={{
          fill:true,
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y:
            {
              grid: {
                display: false
              }
            },
            xAxes: [{
              display: false
            }],
            yAxes: [{
              display: false
            }],
          },responsive:true
        }} />
      </MDBContainer>

    </div>
  )
}

export default LineGraph



// import * as React from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { Line } from "react-chartjs-2";
// import { fetchData } from "../../middleware/RequestHandler";
// import Box from '@mui/material/Box';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// // import "./Graph.css";

// // import React from 'react'

// function BarGraph(props) {
//   const [filter, setFilter] = React.useState("week");
//   const [dataLost, setDataLost] = React.useState([]);
//   const [dataWon, setDataWon] = React.useState([]);
//   const [labels, setLables] = React.useState([]);
  
//   const handleChange = (event) => {
//     setFilter(event.target.value);
//   };
 


//   const dataForWon = (canvas) => {
//     const ctx = canvas.getContext("2d")
//     const gradient = ctx.createLinearGradient(0,0,0,400)
   
//     gradient.addColorStop(0, '#05ff00');
 
//     gradient.addColorStop(1, 'rgba(0,210,255,0.3)');
//       return {
        
//           labels:['1','2','3'],
//           datasets: [
//             {
//               label: "Number Of wins",
//               data: [1,2,3,4,5],

//               fill: true,
//               backgroundColor: gradient,
//               borderColor: [
//                "#05ff00"
//               ],
//               borderWidth: 1,
//             },
//           ],
          
         
//       }
//     }


//   return (
//     <>
//       <div style={{display:"flex",justifyContent:"flex-end",width:"100%"}}>
    
//         <div style={{ border:"2px solid whitesmoke",padding:"0px 5px",width:"45%" }}>
//           <Line
//             options={{
//               responsive: true,
//               radius: 3,
//               hoverRadius: 7,
//               tension: 0.5,
//               scales: {
//                 x: {
//                     grid:{
//                      display:false
//                          }
//                    },
//                 y: 
//                    {
//                  grid:{
//                   display:false
//                       }
//                    }
//                        }
//             }}
//             data={dataForWon}
//           />
//         </div>
//       </div>
//     </>
//   );
// }

// export default BarGraph;
