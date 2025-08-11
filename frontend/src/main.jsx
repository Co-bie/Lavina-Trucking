import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import HomePage from './pages/HomePage.jsx';

function AboutPage() {
  return (
    <div style={{
      maxWidth: 600,
      margin: '0 auto',
      padding: 20,
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 10,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#1e40af' }}>About Lavina Trucking</h1>
        <p>We are a professional trucking company providing reliable transportation services.</p>
        <Link 
          to="/" 
          style={{ 
            color: '#1e40af', 
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          ← Go to Home
        </Link>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

