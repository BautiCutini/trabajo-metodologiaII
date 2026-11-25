import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './LayoutAdmin.css';

const ENCARGADO = 'ENCARGADO';
const ADMIN = 'ADMIN_COMPLEJO';

const OPCIONES = [
    { nombre: 'Inicio', Icono: LayoutDashboard, ruta: '/admin', roles: [ENCARGADO, ADMIN], fin: true },
    { nombre: 'Horarios', Icono: CalendarDays, ruta: '/admin/horarios', roles: [ENCARGADO, ADMIN] },
    { nombre: 'Gerentes', Icono: Users, ruta: '/admin/empleados', roles: [ADMIN] },
];

const ETIQUETA_ROL = {
    [ENCARGADO]: 'Gerente',
    [ADMIN]: 'Dueño del complejo',
};

function LayoutAdmin({ titulo, subtitulo, children }) {
    const { usuario, cerrarSesion } = useAuth();
    const navigate = useNavigate();
    const opciones = OPCIONES.filter((opcion) => opcion.roles.includes(usuario.rol));

    function salir() {
        cerrarSesion();
        navigate('/login', { replace: true });
    }

    return (
        <div className="panel">
            <aside className="panel__lateral">
                <img className="panel__logo" src="/images/logo-picado.png" alt="Picado" />
                <nav className="panel__nav" aria-label="Menú principal">
                    {opciones.map(({ nombre, Icono, ruta, fin }) => (
                        <NavLink
                            key={ruta}
                            to={ruta}
                            end={fin}
                            className={({ isActive }) => `panel__link ${isActive ? 'activo' : ''}`}
                        >
                            <Icono size={20} aria-hidden="true" />
                            <span>{nombre}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="panel__usuario">
                    <div>
                        <strong>{usuario.nombre} {usuario.apellido}</strong>
                        <small>{ETIQUETA_ROL[usuario.rol] ?? usuario.rol}</small>
                    </div>
                    <button type="button" onClick={salir} aria-label="Cerrar sesión">
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>

            <main className="panel__contenido">
                <header className="panel__encabezado">
                    <h1>{titulo}</h1>
                    {subtitulo && <p>{subtitulo}</p>}
                </header>
                {children}
            </main>

            <nav className="panel__inferior" aria-label="Navegación móvil">
                {opciones.map(({ nombre, Icono, ruta, fin }) => (
                    <NavLink
                        key={ruta}
                        to={ruta}
                        end={fin}
                        className={({ isActive }) => `panel__link-inf ${isActive ? 'activo' : ''}`}
                    >
                        <Icono size={22} />
                        <span>{nombre}</span>
                    </NavLink>
                ))}
                <button type="button" className="panel__link-inf" onClick={salir}>
                    <LogOut size={22} />
                    <span>Salir</span>
                </button>
            </nav>
        </div>
    );
}

export default LayoutAdmin;
