import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    House,
    CalendarDays,
    CalendarCheck,
    Heart,
    UserRound,
    Settings,
    LogOut,
} from 'lucide-react';

function Sidebar() {
    const { cerrarSesion } = useAuth();
    const navigate = useNavigate();

    function salir() {
        cerrarSesion();
        navigate('/login', { replace: true });
    }

    const opciones = [
        { nombre: 'Inicio', Icono: House, ruta: '/' },
        { nombre: 'Reservar cancha', Icono: CalendarDays, ruta: '/reservar' },
        { nombre: 'Mis reservas', Icono: CalendarCheck, ruta: '/reservas' },
        { nombre: 'Favoritos', Icono: Heart, ruta: '/favoritos' },
        { nombre: 'Mi perfil', Icono: UserRound, ruta: '/perfil' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar__logo">
                <img src="/images/logo-picado.png" alt="Picado" />
            </div>

            <nav className="sidebar__nav">
                {opciones.map(({ nombre, Icono, ruta }) => (
                    <NavLink
                        key={nombre}
                        to={ruta}
                        className={({ isActive }) =>
                            `sidebar__link ${isActive ? 'active' : ''}`
                        }
                    >
                        <Icono className="sidebar__icono" size={20} />
                        {nombre}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar__inferior">
                <button className="sidebar__link" type="button">
                    <Settings className="sidebar__icono" size={20} />
                    Configuración
                </button>

                <button className="sidebar__link" type="button" onClick={salir}>
                    <LogOut className="sidebar__icono" size={20} />
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;