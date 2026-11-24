import { Routes, Route, Navigate } from 'react-router-dom';
import RutaProtegida from './RutaProtegida';
import Login from '../pages/auth/Login';
import Registro from '../pages/auth/Registro';
import Inicio from '../pages/jugador/Inicio';
import Perfil from '../pages/jugador/Perfil';
import Mapa from '../pages/jugador/Mapa';
import Reservas from '../pages/jugador/Reservas';
import LayoutPanel from '../components/panel/LayoutPanel';
import Usuarios from '../pages/plataforma/Usuarios';

function AppRoutes() {
    return (
        <Routes>
            {/* Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            {/* Cualquier usuario logueado */}
            <Route element={<RutaProtegida />}>
                <Route path="/" element={<Inicio />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/mapa" element={<Mapa />} />
                <Route path="/reservar" element={<Reservas />} />
            </Route>

            {/* Administrador de la plataforma */}
            <Route element={<RutaProtegida roles={['ADMIN_PLATAFORMA']} />}>
                <Route element={<LayoutPanel />}>
                    <Route path="/plataforma/usuarios" element={<Usuarios />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;