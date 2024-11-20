import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useCounter } from "../context/ContextAPI";
import AxiosInstance from "../AxiosInstance";

function LineChart() {
  const { user,series, setSeries, categories, setCategories } = useCounter();
  // const [series, setSeries] = useState([]);
  // const [categories, setCategories] = useState([]);

  // const getDataForLineChart = async () => {
  //   try {
  //     const res = await AxiosInstance.get(`getdashboard/${user._id}`);
  //     console.log(res);

  //     // Extracting years and points
  //     const years = res.data.data.map(item => item._id);
  //     const points = res.data.data.map(item => item.poins);

  //     // Update state for series and categories
  //     // setCategories(years);
  //     // setSeries([{
  //     //   name: "Points",
  //     //   data: points
  //     // }]);
  //     setCategories(points);
  //     setSeries([{
  //       name: "Year",
  //       data: years
  //     }]);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   getDataForLineChart();
  // }, []);

  const options = {
    chart: {
      id: "basic-bar"
    },
    xaxis: {
      categories: categories // Use dynamic categories
    }
  };

  return (
    <div className="app container">
      <div className="row p-3">
        <div className="mixed-chart col">
          <Chart
            options={options}
            series={series}
            type="bar"
            width="60%"
          />
        </div>
      </div>
    </div>
  );
}

export default LineChart;
