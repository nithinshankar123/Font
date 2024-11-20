import React, { Component, useState } from "react";
import Chart from "react-apexcharts";
import { useCounter } from "../context/ContextAPI";

// class Barchart extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       options: {
//         chart: {
//           id: "basic-bar"
//         },
//         xaxis: {
//           categories: ["fields",2013,2014,2015,2016,2017,2018,2019]
//         }
//       },
//       series: [
//         {
//           name: "Points",
//           data: [30, 40, 45, 50, 49, 60, 70, 91]
//         }
//       ]
//     };
//   }
const Barchart=()=>{
  const { typesData, setTypesData, pointsData, setpointsData, selectedYear}=useCounter()
  console.log(typesData,pointsData );
 const options= {
    chart: {
      id: "basic-bar"
    },
    xaxis: {
      categories:typesData
      //  ["types",2013,2014,2015,2016,2017,2018,2019]
    }
  }
 const series= [
    {
      name: "Points",
      data: pointsData
      // [30, 40, 45, 50, 49, 60, 70, 91]
    }
  ]
  return(
     <div className="app container">
    <h3>{selectedYear}</h3>
        <div className="row p-3">
          <div className="mixed-chart col">
            <Chart
              options={options}
              series={series}
              type="bar"
              width="50%"
            />
            
          </div>
          {/* <div className="mixed-chart col">
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="line"
              width="500"
            />
            
          </div> */}
        </div>
      </div>
  )
}
  // render() {
  //   return (
     
  //   );
  // }}


export default Barchart;