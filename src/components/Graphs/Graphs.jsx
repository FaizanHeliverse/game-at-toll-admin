import React from 'react'
import { Line } from 'react-chartjs-2';

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
function Graphs() {
  // const dataForWon = (canvas) => {
  //   const ctx = canvas.getContext("2d")
  //   const gradient = ctx.createLinearGradient(0,0,0,400)
   
  //   gradient.addColorStop(0, '#05ff00');
 
  //   gradient.addColorStop(1, 'rgba(0,210,255,0.3)');
  //     return {
        
  //       labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  //         datasets: [
  //           {
  //             label: "Number Of wins",
  //             data: [33, 53, 85, 41, 44, 65],

  //             fill: true,
  //             backgroundColor: gradient,
  //             borderColor: [
  //              "#05ff00"
  //             ],
  //             borderWidth: 1,
  //           },
  //           {
  //                     label: "Second dataset",
  //                     data: [33, 25, 35, 51, 54, 76],
  //                     fill: false,
  //                     borderColor: "#742774",
  //                     backgroundColor: gradient,
  //                   }
  //         ],
          
         
  //     }
  //   }


    const data = {
   
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "First dataset",
            data: [33, 53, 85, 41, 44, 65],
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)",
            backgroundColor:"red"

          },
          {
            label: "Second dataset",
            data: [33, 25, 35, 51, 54, 76],
            fill: true,
            borderColor: "#742774",
            backgroundColor: "green",
          }
        ]
      };
      
    return (
      <>
     
<Line
width="10px"
height="10px"

options={{
  responsive: true,
  radius: 3,
  hoverRadius: 7,
  tension: 0.5,
  scales: {
    x: {
        grid:{
         display:false
             }
       },
    y: 
       {
     grid:{
      display:false
          }
       }
           }
}}
data={data} />

            
     </> 
    )
}

export default Graphs
