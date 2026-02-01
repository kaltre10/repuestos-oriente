// import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GOOGLE_CLIENT_ID } from './utils/utils.ts'
import { HelmetProvider } from 'react-helmet-async'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </GoogleOAuthProvider>
  )
}


