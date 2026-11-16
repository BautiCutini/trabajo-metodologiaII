import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { rutaSegunRol } from '../utils/rutaSegunRol';

function RutaProtegida({ roles }) {
    const { usuario, verificando } = useAuth();
    const ubicacion = useLocation();

    // Todavía no se sabe si el token guardado es válido: no se decide nada
    if (verificando) return null;

    // Sin sesión: al login, recordando a dónde quería ir
    if (!usuario) {
        return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
    }

    // Con sesión pero sin permiso para esta sección: a su propio inicio
    if (roles && !roles.includes(usuario.rol)) {
        return <Navigate to={rutaSegunRol(usuario.rol)} replace />;
    }

    return <Outlet />;
}

export default RutaProtegida;