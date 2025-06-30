import React from 'react';

function ResultDisplay({ emotion, error, loading }) {
  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ marginTop: '0.5rem' }}>Analyzing audio...</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {emotion && !loading && (
        <div className="card result-card">
          <h3>Predicted Emotion</h3>
          <p>{emotion}</p>
        </div>
      )}
    </div>
  );
}

export default ResultDisplay;
