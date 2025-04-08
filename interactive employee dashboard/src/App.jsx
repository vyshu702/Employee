import React, { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [data, setData] = useState([]);

  // Automatically load JSON file from public folder
  useEffect(() => {
    fetch("/csvjson.json")
      .then((res) => res.json())
      .then((data)=>setData(data))
      .catch((err) => console.error("Failed to load default JSON:", err));
  }, []);

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4" style={{textAlign:"center"}}>Employee Performance Dashboard</h1>

      {data.length > 0 ? (
        <Dashboard data={data} />
      ) : (
        <p className="text-gray-500">Loading employee data...</p>
      )}
    </div>
  );
}
