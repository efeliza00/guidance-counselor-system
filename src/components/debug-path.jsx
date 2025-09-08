import { useLocation } from "react-router-dom";
import React from "react";
const DebugPath = () => {
  const location = useLocation();
  return (
    <div className="bg-black text-green-500 text-xs p-1">
      Current path: {location.pathname}
    </div>
  );
};

export default DebugPath;
