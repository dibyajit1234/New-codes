import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@/styles/globals.css';

/* Spinner keyframe injected at root so it's available globally */
const style = document.createElement('style');
style.textContent = `
  @keyframes tg-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .tg-spinner {
    width: 32px; height: 32px; border-radius: 50%;
    border: 3px solid rgba(59,130,246,0.2);
    border-top-color: #3b82f6;
    animation: tg-spin 0.8s linear infinite;
  }
  .tg-spin { animation: tg-spin 0.8s linear infinite; display: inline-block; }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
