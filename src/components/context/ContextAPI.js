import React, { createContext, useState, useContext, useEffect } from "react";
import AxiosInstance from "../AxiosInstance";
import moment from "moment";

// Create a Context
const CounterContext = createContext();

// Create a provider component
const CounterProvider = ({ children }) => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
    console.log(count);
  };

  const decrement = () => {
    setCount(count - 1);
  };
  const [userTypes, setUserTypes] = useState();
  const user = JSON.parse(localStorage.getItem("user"));

  const getallTypes = async () => {
    try {
      const res = await AxiosInstance.get(`gettype/${user._id}`);
      setUserTypes(res.data.data);
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const [frequency, setFrequency] = useState("2024");
  const [selectedYear, setSelecteYear] = useState();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDate, setSelectedate] = useState([]);
  const [allPoints, setAllPoints] = useState([]);
  const [pointsData, setpointsData] = useState([]);
  const [typesData, setTypesData] = useState([]);
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const getPointsByYearAndTypes = async () => {
    let endPoint = `getpoints/${user._id}`;
    const queryParams = [];
// console.log(selectedDate);
    // Handle year
    if (selectedYear && selectedYear !== "custom") {
      queryParams.push(`year=${selectedYear}`);
    }

    // Handle types
    if (selectedTypes.length > 0) {
      if (selectedYear === "custom") {
        // If year is custom, we add types directly
        queryParams.push(`types=${selectedTypes.join(",")}`);
      } else if (selectedTypes[0] !== "all") {
        // If not "all", append selected types
        queryParams.push(`types=${selectedTypes.join(",")}`);
      }
    }

    // Handle date range for custom year
    if (selectedDate && selectedYear === "custom") {
      const startDate = selectedDate[0]
        ? moment(selectedDate[0]).format("YYYY-MM-DD")
        : null;
      const endDate = selectedDate[1]
        ? moment(selectedDate[1]).format("YYYY-MM-DD")
        : null;
      if (startDate && endDate) {
        queryParams.push(`startdate=${startDate}&enddate=${endDate}`);
      }
    }
    if (selectedDate && selectedDate.length === 2) {
      const startDate = selectedDate[0].format("YYYY-MM-DD");
      const endDate = selectedDate[1].format("YYYY-MM-DD");
      queryParams.push(`startdate=${startDate}&enddate=${endDate}`);
    }
    
    // Append query parameters to endpoint if any exist
    if (queryParams.length > 0) {
      endPoint += "?" + queryParams.join("&");
    }

    try {
      const response = await AxiosInstance.get(endPoint);
      console.log(response);
      response.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAllPoints(response.data.data);
      const points = response.data.data.map((item) => item.points);

      const types = response.data.data.map((item) => item.types.types);
      const aggregatedData = {};

      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        const point = points[i];

        // Sum points for repeated types
        if (aggregatedData[type]) {
          aggregatedData[type] += point;
        } else {
          aggregatedData[type] = point;
        }
      }

      // Convert aggregated data to arrays if needed
      const finalTypes = Object.keys(aggregatedData); // Types (activities)
      const finalPoints = Object.values(aggregatedData); // Points (counts)

      // Set the aggregated data to state
      setTypesData(finalTypes);
      setpointsData(finalPoints);
      const years = response.data.data.map((item) =>
        new Date(item.date).getFullYear()
      ); // Extract years
      const aggregatedYear = {};
      for (let i = 0; i < years.length; i++) {
        const year = years[i];
        const point = points[i];
        if (aggregatedYear[year]) {
          aggregatedYear[year] += point;
        } else {
          aggregatedYear[year] = point;
        }
      }
      // Convert aggregated data to arrays if needed
      const finalYears = Object.keys(aggregatedYear); // Years
      const finalPoints2 = Object.values(aggregatedYear); // Years
// Aggregate data by academic years
const academicYearData = {};
response.data.data.forEach((item) => {
  const date = new Date(item.date);
  const startYear = date.getMonth() >= 7 ? date.getFullYear() : date.getFullYear() - 1;
  const endYear = startYear + 1;
  const academicYear = `${startYear}-${endYear}`;
  if (academicYearData[academicYear]) {
    academicYearData[academicYear] += item.points;
  } else {
    academicYearData[academicYear] = item.points;
  }
});

const finalAcademicYears = Object.keys(academicYearData); // Academic years
const finalPointsByYear = Object.values(academicYearData); // Points by academic year

// Set data to state for the chart
setCategories(finalAcademicYears); // Academic years on x-axis
setSeries([
  {
    name: "Points",
    data: finalPointsByYear, // Points on y-axis
  },
]);
      // Set data to state for the chart
      // setCategories(finalYears); // Years on x-axis
      // setSeries([
      //   {
      //     name: "Points",
      //     data: finalPoints2, // Points on y-axis
      //   },
      // ]);
      // setpointsData(points)
      // setTypesData(types)
    } catch (error) {
      console.error(error);
      setAllPoints([]);
      setCategories([]);
      setSeries([]);
      setpointsData([]);
      setTypesData([])
    }
  };

  useEffect(() => {
    getPointsByYearAndTypes();
  }, [selectedYear, selectedTypes, selectedDate]);
  const getPoints = async () => {
    try {
      const res = await AxiosInstance.get(`getpoints/${user._id}`);
    } catch (error) {
      console.log();
    }
  };
  useEffect(() => {
    // getPoints()
  }, []);
  return (
    <CounterContext.Provider
      value={{
        count,
        increment,
        decrement,
        userTypes,
        setUserTypes,
        getallTypes,
        user,
        frequency,
        setFrequency,
        selectedYear,
        setSelecteYear,
        selectedTypes,
        setSelectedTypes,
        selectedDate,
        setSelectedate,
        allPoints,
        setAllPoints,
        typesData,
        setTypesData,
        pointsData,
        setpointsData,
        getPointsByYearAndTypes,
        categories,
        setCategories,
        series,
        setSeries,
      }}
    >
      {children}
    </CounterContext.Provider>
  );
};

// Create a custom hook for easier access to the context
export const useCounter = () => {
  return useContext(CounterContext);
};

// Main component
// const CounterApp = () => {
//     return (

//             <Counter />

//     );
// };

// Counter component that consumes the context
const Counter = () => {
  const { count, increment, decrement } = useCounter();

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Counter: {count}</h1>
      <button onClick={increment} style={{ margin: "5px" }}>
        Increment
      </button>
      <button onClick={decrement} style={{ margin: "5px" }}>
        Decrement
      </button>
    </div>
  );
};

// Export the main component
export default CounterProvider;
