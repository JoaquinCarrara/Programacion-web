import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TiendaHome from './components/TiendaHome';
import Login from './components/Login';
import './index.css';

export default function App() {
  return (
    <Routes>
      {/* Ruta para el catálogo y home principal */}
      <Route path="/" element={<TiendaHome />} />

      {/* Ruta para la pantalla de inicio de sesión */}
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}