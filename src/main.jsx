import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

window.onerror = (msg, src, line, col, err) => {
  document.getElementById('root').innerHTML =
    `<div style="padding:32px;font-family:monospace;color:#ff6b6b;background:#080808;min-height:100vh">
      <h2>Crash: ${msg}</h2>
      <p>${src}:${line}</p>
      <pre style="font-size:0.75rem;white-space:pre-wrap">${err?.stack ?? ''}</pre>
    </div>`
}

window.onunhandledrejection = (e) => {
  document.getElementById('root').innerHTML =
    `<div style="padding:32px;font-family:monospace;color:#ff6b6b;background:#080808;min-height:100vh">
      <h2>Unhandled Promise Rejection</h2>
      <pre style="font-size:0.75rem;white-space:pre-wrap">${e.reason?.stack ?? e.reason}</pre>
    </div>`
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
