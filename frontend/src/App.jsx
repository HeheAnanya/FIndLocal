import React, { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [shift, setShift] = useState(true);

  return (
    <BrowserRouter>
      <div className="auth-wrapper">
        <div className="buttons">
          <button
            onClick={() => setShift(false)}
            className={shift ? "" : "active"}
          >
            SignUp
          </button>
          <button
            onClick={() => setShift(true)}
            className={shift ? "active" : ""}
          >
            Login
          </button>
        </div>

        <div className="auth-card">
          {shift ? <Login /> : <SignUp />}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
