import { NavLink } from 'react-router-dom';
import {
    House,
    CalendarPlus,
    CalendarCheck,
    Heart,
    UserRound,
} from 'lucide-react';

function BottomNav() {
    const opciones = [
        { nombre: 'Inicio', Icono: House, ruta: '/' },
        { nombre: 'Reservar', Icono: CalendarPlus, ruta: '/reservar' },
        { nombre: 'Reservas', Icono: CalendarCheck, ruta: '/reservas' },
        { nombre: 'Favoritos', Icono: Heart, ruta: '/favoritos' },
        { nombre: 'Perfil', Icono: UserRound, ruta: '/perfil' },
    ];
    
    return (
        <nav className="bottom-nav">
            {opciones.map(({ nombre, Icono, ruta }) => (
                <NavLink
                    key={nombre}
                    to={ruta}
                    className={({ isActive }) =>
                        `bottom-nav__link ${isActive ? 'active' : ''}`
                    }
                >
                    <Icono className="bottom-nav__icono" size={22} />
                    <span className="bottom-nav__nombre">{nombre}</span>
                </NavLink>
            ))}
        </nav>
    );
}

export default BottomNav;