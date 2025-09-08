import DebugPath from "../components/debug-path";
import Navbar from "../components/navbar";
import { Outlet } from "react-router-dom";
import React from "react";

const MODE = import.meta.env.VITE_NODE_ENV === "development";

const App = () => {
  return (
    <div className="min-h-screen h-screen max-w-screen">
      {MODE && <DebugPath />}
      <Navbar />
      <main className="h-full w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
