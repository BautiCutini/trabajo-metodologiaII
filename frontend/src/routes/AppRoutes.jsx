import { Routes, Route, Navigate } from 'react-router-dom';
import RutaProtegida from './RutaProtegida';
import Login from '../pages/auth/Login';
import Registro from '../pages/auth/Registro';
import Inicio from '../pages/jugador/Inicio';
import Perfil from '../pages/jugador/Perfil';
import Mapa from '../pages/jugador/Mapa';
import Reservas from '../pages/jugador/Reservas';
import Dashboard from '../pages/admin/Dashboard';
import LayoutPanel from '../components/panel/LayoutPanel';
import Usuarios from '../pages/plataforma/Usuarios';
import Complejos from '../pages/plataforma/Complejos';

function AppRoutes() {
    return (
        <Routes>
            {/* Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            {/* Jugadores, y por ahora también el personal de los complejos.
            El administrador de la plataforma no entra acá: RutaProtegida lo manda a su panel */}
            <Route element={<RutaProtegida roles={['JUGADOR', 'ENCARGADO', 'ADMIN_COMPLEJO']} />}>
                <Route path="/" element={<Inicio />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/mapa" element={<Mapa />} />
                <Route path="/reservar" element={<Reservas />} />
            </Route>

            {/* Panel del complejo: encargado y administrador del complejo */}
            <Route element={<RutaProtegida roles={['ENCARGADO', 'ADMIN_COMPLEJO']} />}>
                <Route path="/admin" element={<Dashboard />} />
            </Route>

            {/* Administrador de la plataforma */}
            <Route element={<RutaProtegida roles={['ADMIN_PLATAFORMA']} />}>
                <Route element={<LayoutPanel />}>
                    <Route path="/plataforma/usuarios" element={<Usuarios />} />
                    <Route path="/plataforma/complejos" element={<Complejos />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;