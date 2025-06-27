import React, { useState } from 'react';
import AudioUploader from './components/AudioUploader.jsx';
import ResultDisplay from './components/ResultDisplay.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import AnimatedBackground from './components/AnimatedBackground.jsx';
import './App.css';

function App() {
  const [emotion, setEmotion] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="container">
      <AnimatedBackground />
      <header className="header">
        <h1>Speech Emotion Recognition</h1>
        <ThemeToggle />
      </header>
      <main>
        {/* About Section */}
        <section className="about-section">
          <h2>About Speech Emotion Recognition</h2>
          <p>
            Speech Emotion Recognition (SER) is an advanced technology that analyzes human speech to detect and classify emotional states such as happiness, sadness, anger, or neutrality. It leverages machine learning and deep learning models to process audio signals, extracting features like pitch, tone, and speech rate to infer emotions.
          </p>
          <p>
            <strong>How It Works:</strong> The process begins with audio preprocessing, where noise is removed, and features are extracted using techniques like Mel-frequency cepstral coefficients (MFCCs). These features are then fed into a trained model (e.g., neural networks or support vector machines) to predict the emotion. Our models, like Model 1 and Model 2, are trained on diverse datasets to ensure accuracy across various accents and contexts.
          </p>
          <div className="image-gallery">
            <img src={require('./waveform.png')} alt="Waveform" className="about-image" />
            <img src={require('./brain.png')} alt="Brain" className="about-image" />
            <img src={require('./audio-analysis.jpg')} alt="Audio Analysis" className="about-image" />
          </div>
        </section>

        {/* Upload Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AudioUploader setEmotion={setEmotion} setError={setError} setLoading={setLoading} loading={loading} />
          <ResultDisplay emotion={emotion} error={error} loading={loading} />
        </div>
      </main>
    </div>
  );
}

export default App;