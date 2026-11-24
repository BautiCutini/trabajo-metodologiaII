import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Users, Building2, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NOMBRE_ROL } from '../../utils/roles';
import Logo from '../ui/Logo';
import styles from './LayoutPanel.module.css';

// Qué secciones ve cada rol en el panel.
// Las del encargado y el administrador de complejo se suman cuando existan sus pantallas.
const MENU_POR_ROL = {
    ADMIN_PLATAFORMA: [
        { nombre: 'Usuarios', Icono: Users, ruta: '/plataforma/usuarios' },
        { nombre: 'Complejos', Icono: Building2, ruta: '/plataforma/complejos' },
    ],
};

function LayoutPanel() {
    const { usuario, cerrarSesion } = useAuth();
    const navigate = useNavigate();

    const opciones = MENU_POR_ROL[usuario.rol] ?? [];

    function salir() {
        cerrarSesion();
        navigate('/login', { replace: true });
    }

    return (
        <div className={styles.panel}>
            <aside className={styles.lateral}>
                <div className={styles.marca}>
                    <Logo />
                </div>

                <nav className={styles.menu} aria-label="Secciones del panel">
                    {opciones.map(({ nombre, Icono, ruta }) => (
                        <NavLink
                            key={ruta}
                            to={ruta}
                            className={({ isActive }) =>
                                `${styles.enlace} ${isActive ? styles.activo : ''}`
                            }
                        >
                            <Icono size={20} aria-hidden="true" />
                            {nombre}
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.cuenta}>
                    <div className={styles.persona}>
                        <span className={styles.nombre}>
                            {usuario.nombre} {usuario.apellido}
                        </span>
                        <span className={styles.rol}>{NOMBRE_ROL[usuario.rol]}</span>
                    </div>

                    <button type="button" className={styles.enlace} onClick={salir}>
                        <LogOut size={20} aria-hidden="true" />
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            <main className={styles.contenido}>
                <Outlet />
            </main>
        </div>
    );
}

export default LayoutPanel;