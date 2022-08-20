import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/header";
import Home from "./pages/home/";
import Signup from "./pages/signup";

const App = () => {
  return (
    <div id="main">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};

export default App;
