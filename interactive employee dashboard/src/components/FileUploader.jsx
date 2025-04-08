import React from "react";

export default function FileUploader({ setData }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        setData(Array.isArray(parsed) ? parsed : [parsed]);
      } catch (error) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mb-6">
      <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Upload JSON
        <input type="file" accept="application/json" className="hidden" onChange={handleFileUpload} />
      </label>
    </div>
  );
}