import React, { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setShowResponse(false);

    try {
      const apiResponse = await fetch('https://nrkg7cmta3.execute-api.ap-south-1.amazonaws.com/dev/name-agent-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: {
            name: name.trim()
          }
        })
      });

      const data = await apiResponse.json();
      const parsedBody = JSON.parse(data.body);
      setResponse(parsedBody.response);
      setShowResponse(true);
    } catch (error) {
      setResponse('Sorry, something went wrong. Please try again.');
      setShowResponse(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setResponse('');
    setShowResponse(false);
  };

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1 className="title">AI Name Agent</h1>
          <p className="subtitle">Discover the meaning and significance of your name</p>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="name-input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading || !name.trim()}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                'Discover'
              )}
            </button>
          </div>
        </form>

        {showResponse && (
          <div className="response-container">
            <div className="response-header">
              <h3>About "{name}"</h3>
              <button onClick={handleReset} className="reset-btn">
                Try Another Name
              </button>
            </div>
            <div className="response-content">
              {response.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;