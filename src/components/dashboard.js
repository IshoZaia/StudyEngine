import "../index.css";
import React, { useState } from "react";

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [frequency, setFrequency] = useState("daily");
  const [numQuestions, setNumQuestions] = useState(5);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileSubmit = (event) => {
    const formData = new FormData();
    formData.append("file", file);
    event.preventDefault();
    console.log(file);
    fetch("http://localhost:8000/api/uploadFile", {
      method: "POST",
      body: formData
    }).then((response) => {
      console.log(response);
    });

  };

  const handleSettingsSubmit = (event) => {
    event.preventDefault();
    // Handle settings update
    console.log(frequency, numQuestions);
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-12 md:pt-24">
      {/* Profile Bubble */}
      <div className="absolute top-0 right-0 m-4">
        <button className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50">
          Profile
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Upload Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Upload Textbook Chapter
            </h3>
            <form onSubmit={handleFileSubmit}>
              <div>
                <label
                  htmlFor="file-upload"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload chapter (PDF):
                </label>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={handleFileChange}
                />
              </div>
              <button
                type="submit"
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Upload
              </button>
            </form>
          </div>

          {/* Settings Section */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Configuration Settings
            </h3>
            <form onSubmit={handleSettingsSubmit}>
              <div>
                <label
                  htmlFor="frequency"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Frequency:
                </label>
                <select
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="numQuestions"
                  className="block text-sm font-medium text-gray-700"
                >
                  Number of Questions:
                </label>
                <input
                  type="number"
                  id="numQuestions"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  min="1" // Ensure the number of questions is at least 1
                  className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Settings
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
