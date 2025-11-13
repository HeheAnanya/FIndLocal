import React from "react";
// import "./App.css";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  // const [shift, setShift] = useState(true);

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/">
This Page is underconstruction, please move to either /login or /singup route      
      </Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/signup" element={<SignUp/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
