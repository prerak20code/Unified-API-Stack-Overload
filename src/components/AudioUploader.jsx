import React, { useState } from 'react';
import axios from 'axios';

function AudioUploader({ setEmotion, setError, setLoading, loading }) { // Add loading to props
  const [file, setFile] = useState(null);
  const [model, setModel] = useState('model1');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setEmotion(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an audio file.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', model);

    try {
      const response = await axios.post('http://127.0.0.1:8000/predict/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEmotion(response.data.emotion);
    } catch (err) {
      setError('Error predicting emotion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: '700', 
        marginBottom: '2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Upload Audio File
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="form-group">
          <label>Select Audio File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className="form-group">
          <label>Select Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="model1">Model 1 (Speech Emotion Recognition)</option>
            <option value="model2">Model 2 (Speech Emorec Nbtest)</option>
          </select>
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" style={{ marginRight: '0.5rem', width: '1rem', height: '1rem' }}></span>
              Processing...
            </>
          ) : (
            'Predict Emotion'
          )}
        </button>
      </form>
    </div>
  );
}

export default AudioUploader;