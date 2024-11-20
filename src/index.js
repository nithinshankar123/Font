import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/antd.min.css";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import CounterProvider from "./components/context/ContextAPI";
console.log('%c Professor Performance Points Tracker Application', 'color: white; background-color: black; font-size: 18px; padding: 10px; border-radius: 5px;');

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CounterProvider>
    <BrowserRouter>

      <App />
    </BrowserRouter></CounterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
