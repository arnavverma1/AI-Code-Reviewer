import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFeedback("");
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError("");
    setFeedback("");

    try {
      const response = await fetch("http://localhost:8000/analyze/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🚀 AI Code Reviewer</h1>
      <p>Upload your code file and get AI-powered feedback instantly!</p>

      <div className="upload-section">
        <input type="file" accept=".py,.js,.java,.cpp,.c,.ts" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </div>

      {error && <div className="error-message">❌ {error}</div>}

      {feedback && (
        <div className="feedback-section">
          <h2>🔍 AI Feedback:</h2>
          <pre>{feedback}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
