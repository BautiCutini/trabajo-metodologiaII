
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    LogOut,
    ShieldCheck,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './LayoutAdmin.css';

const ENCARGADO = 'ENCARGADO';
const ADMIN = 'ADMIN_COMPLEJO';

const OPCIONES = [
    {
        nombre: 'Inicio',
        descripcion: 'Resumen general',
        Icono: LayoutDashboard,
        ruta: '/admin',
        roles: [ENCARGADO, ADMIN],
        fin: true
    },
    {
        nombre: 'Horarios',
        descripcion: 'Disponibilidad de canchas',
        Icono: CalendarDays,
        ruta: '/admin/horarios',
        roles: [ENCARGADO, ADMIN]
    },
    {
        nombre: 'Gerentes',
        descripcion: 'Personal del complejo',
        Icono: Users,
        ruta: '/admin/empleados',
        roles: [ADMIN]
    }
];

const ETIQUETA_ROL = {
    [ENCARGADO]: 'Encargado',
    [ADMIN]: 'Administrador'
};

function LayoutAdmin({ titulo, subtitulo, children }) {
    const { usuario, cerrarSesion } = useAuth();
    const navigate = useNavigate();

    const opciones = OPCIONES.filter((opcion) =>
        opcion.roles.includes(usuario?.rol)
    );

    function salir() {
        cerrarSesion();
        navigate('/login', { replace: true });
    }

    return (
        <div className="panel-admin">
            <aside className="panel-admin__sidebar">
                <div className="panel-admin__marca">
                    <img src="/images/logo-picado.png" alt="Picado" />
                    <span>ADMINISTRACIÓN</span>
                </div>

                <div className="panel-admin__separador" />

                <div className="panel-admin__menu-titulo">
                    MENÚ PRINCIPAL
                </div>

                <nav className="panel-admin__nav">
                    {opciones.map(({ nombre, descripcion, Icono, ruta, fin }) => (
                        <NavLink
                            key={ruta}
                            to={ruta}
                            end={fin}
                            className={({ isActive }) =>
                                `panel-admin__link ${isActive ? 'activo' : ''}`
                            }
                        >
                            <span className="panel-admin__link-icono">
                                <Icono size={20} />
                            </span>

                            <span className="panel-admin__link-texto">
                                <strong>{nombre}</strong>
                                <small>{descripcion}</small>
                            </span>

                            <ChevronRight
                                className="panel-admin__link-flecha"
                                size={17}
                            />
                        </NavLink>
                    ))}
                </nav>

                <div className="panel-admin__sidebar-footer">
                    <div className="panel-admin__usuario">
                        <div className="panel-admin__avatar">
                            {usuario?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                        </div>

                        <div className="panel-admin__usuario-info">
                            <strong>
                                {usuario?.nombre} {usuario?.apellido}
                            </strong>
                            <span>{ETIQUETA_ROL[usuario?.rol] || 'Usuario'}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="panel-admin__salir"
                        onClick={salir}
                    >
                        <LogOut size={19} />
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </aside>

            <main className="panel-admin__principal">
                <header className="panel-admin__encabezado">
                    <div>
                        <span className="panel-admin__sobre-titulo">
                            PANEL DE GESTIÓN
                        </span>
                        <h1>{titulo}</h1>
                        {subtitulo && <p>{subtitulo}</p>}
                    </div>

                    <div className="panel-admin__estado">
                        <span className="panel-admin__estado-punto" />
                        <span>Panel administrativo</span>
                    </div>
                </header>

                <div className="panel-admin__contenido">
                    {children}
                </div>

                <footer className="panel-admin__footer">
                    <span>Picado</span>
                    <span>Panel de administración de complejos</span>
                </footer>
            </main>

            <nav className="panel-admin__mobile-nav">
                {opciones.map(({ nombre, Icono, ruta, fin }) => (
                    <NavLink
                        key={ruta}
                        to={ruta}
                        end={fin}
                        className={({ isActive }) =>
                            `panel-admin__mobile-link ${isActive ? 'activo' : ''}`
                        }
                    >
                        <Icono size={21} />
                        <span>{nombre}</span>
                    </NavLink>
                ))}

                <button
                    type="button"
                    className="panel-admin__mobile-link"
                    onClick={salir}
                >
                    <LogOut size={21} />
                    <span>Salir</span>
                </button>
            </nav>
        </div>
    );
}

export default LayoutAdmin;
