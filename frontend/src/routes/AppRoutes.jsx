import { Routes, Route, Navigate } from 'react-router-dom';
import RutaProtegida from './RutaProtegida';
import Inicio from '../pages/jugador/Inicio';
import Login from '../pages/auth/Login';
import Registro from '../pages/auth/Registro';
import Perfil from '../pages/jugador/Perfil';
import Mapa from '../pages/jugador/Mapa'; 

function AppRoutes() {
    return (
        <Routes>
            {/* Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            {/* Cualquier usuario logueado */}
            <Route element={<RutaProtegida />}>
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/" element={<Inicio />} />
            </Route>

            <Route element={<RutaProtegida />}>
                <Route path="/" element={<Inicio />} />
                <Route path="/mapa" element={<Mapa />} />
            </Route>

            {/* Cuando existan los paneles, se agregan así:
            <Route element={<RutaProtegida roles={['ADMIN_PLATAFORMA']} />}>
                <Route path="/plataforma/usuarios" element={<GestionUsuarios />} />
            </Route>
            */}

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;