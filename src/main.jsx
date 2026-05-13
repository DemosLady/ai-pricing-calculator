import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import BlogIndex from './pages/BlogIndex.jsx'
import BlogPost from './pages/BlogPost.jsx'
import Layout from './components/Layout.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
