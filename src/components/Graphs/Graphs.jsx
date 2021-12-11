import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {Chart, ArcElement} from 'chart.js'

import { MDBContainer } from "mdbreact";
Chart.register(ArcElement);
// class Graphs extends React.Component {
  
//   state = {
//     dataPie: {
//       labels: ["Red", "Green", "Yellow", "Grey", "Dark Grey"],
//       datasets: [
//         {
//           data: [300, 50, 100, 40, 120],
//           backgroundColor: [
//             "#F7464A",
//             "#46BFBD",
//             "#FDB45C",
//             "#949FB1",
//             "#4D5360",
//             "#AC64AD"
//           ],
//           hoverBackgroundColor: [
//             "#FF5A5E",
//             "#5AD3D1",
//             "#FFC870",
//             "#A8B3C5",
//             "#616774",
//             "#DA92DB"
//           ]
//         }
//       ]
//     }
//   }

//   render() {
//     return (
//       <MDBContainer>
//         <h3 className="mt-5">Pie chart</h3>
//         <Pie data={this.state.dataPie} options={{ responsive: true }} />
//       </MDBContainer>
//     );
//   }
// }

// export default Graphs;


function Graphs({gameData}) {
const [gameLabels,setGameLabels]=React.useState([gameData.labels])
const [gData,setGameData]=React.useState([gameData.data])

useEffect(()=>{
  console.log(gameLabels,gData)
  setGameData(gameData.data);
  setGameLabels(gameData.labels)
},[gameData])

console.log(gameLabels)
console.log(gData)
console.log(gameData)
console.log(gameData.labels)

  let data={
    labels: gameLabels,
    datasets: [
      {
        data:gData,
        backgroundColor: [
          "tomato",
          "#4d5bf9",
          "#FDB45C",
          "#949FB1",
          "#4D5360",
          "#AC64AD"
        ],
        hoverBackgroundColor: [
          "#FF5A5E",
          "#4d5bf9",
          "#FFC870",
          "#A8B3C5",
          "#616774",
          "#DA92DB"
        ]
      }
    ]
  }
  // console.log(data);
  return (
    
        <MDBContainer>
       <h2 className="mt-5">Mostly Played Game</h2>
       <Pie height={200} data={data} options={{ responsive: true }} />
       </MDBContainer>
  
  )
}

export default Graphs
