import { NavLink } from 'react-router-dom';

function BottomNav() {
    const opciones = [
        { nombre: 'Inicio', icono: '⌂', ruta: '/' },
        { nombre: 'Reservar', icono: '▦', ruta: '/reservar' },
        { nombre: 'Reservas', icono: '▤', ruta: '/reservas' },
        { nombre: 'Favoritos', icono: '♡', ruta: '/favoritos' },
        { nombre: 'Perfil', icono: '♙', ruta: '/perfil' },
    ];
    
    return (
        <nav className="bottom-nav">
            {opciones.map((opcion) => (
                <NavLink
                    key={opcion.nombre}
                    to={opcion.ruta}
                        className={({ isActive }) =>
                            `bottom-nav__link ${isActive ? 'active' : ''}`
                        }
                >
                    <span className="bottom-nav__icono">{opcion.icono}</span>
                    <span className="bottom-nav__nombre">{opcion.nombre}</span>
                </NavLink>
            ))}
        </nav>
    );
}

export default BottomNav;