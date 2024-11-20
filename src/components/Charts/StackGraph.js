import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import AxiosInstance from "../AxiosInstance";
import { useCounter } from "../context/ContextAPI";

function StackGraph() {
  const { user } = useCounter();
  const [seriesData, setSeriesData] = useState([]);
  const [categories, setCategories] = useState([]);

  const getDataForStackGraph = async () => {
    try {
      const res = await AxiosInstance.get(`getdashboards/${user._id}`);
      console.log(res);

      const formattedData = {};
      const typeSet = new Set(); // To store unique types

      // Format the data for the chart
      res.data.data.forEach(item => {
        const year = item._id.year.toString();
        const type = item._id.type[0];
        const points = item.points;
        // Create a new year entry if it doesn't exist
        if (!formattedData[year]) {
          formattedData[year] = {};
        }
        // Set the points for the specific type and year
        formattedData[year][type] = points;
        typeSet.add(type); // Add type to the set of categories
      });
      // Prepare series for the chart
      const series = Object.keys(formattedData).map(year => ({
        name: `Sum Of ${year}`,
        data: Array.from(typeSet).map(type => formattedData[year][type] || 0), // Fill missing types with 0
      }));
      setSeriesData(series);
      setCategories(Array.from(typeSet)); // Convert the Set to an array for categories
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataForStackGraph();
  }, []);

  const state = {
    series: seriesData,
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: '13px',
                fontWeight: 900,
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      title: {
        text: 'Professor Points',
      },
      xaxis: {
        categories: categories, // Use dynamic categories
        labels: {
          formatter: function (val) {
            return val; // Customize if needed
          },
        },
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val; // Customize if needed
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
      },
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default StackGraph;
