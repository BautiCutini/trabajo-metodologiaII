import { Routes, Route, Navigate } from 'react-router-dom';
import Inicio from '../pages/jugador/Inicio';
import Login from '../pages/auth/Login';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<h1>Crear cuenta</h1>} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;