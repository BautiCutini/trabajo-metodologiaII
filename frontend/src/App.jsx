import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Reserva de Canchas</h1>} />
      <Route path="/login" element={<h1>Iniciar sesión</h1>} />
      <Route path="/registro" element={<h1>Crear cuenta</h1>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App