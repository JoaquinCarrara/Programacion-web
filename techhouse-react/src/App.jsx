import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TiendaHome from './components/TiendaHome';
import Login from './components/Login';
import './index.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TiendaHome />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}