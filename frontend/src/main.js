import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      BrowserRouter,
      null,
      React.createElement(
        ThemeProvider,
        null,
        React.createElement(
          AuthProvider,
          null,
          React.createElement(
            ToastProvider,
            null,
            React.createElement(App, null)
          )
        )
      )
    )
  )
)
