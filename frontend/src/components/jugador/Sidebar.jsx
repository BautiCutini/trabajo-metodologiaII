import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

function Sidebar() {

      const { cerrarSesion } = useAuth();
    const navigate = useNavigate();

    function salir() {
        cerrarSesion();
        navigate('/login', { replace: true });
    }
    
    const opciones = [
        { nombre: 'Inicio', icono: '⌂', ruta: '/' },
        { nombre: 'Reservar cancha', icono: '▦', ruta: '/reservar' },
        { nombre: 'Mis reservas', icono: '▦', ruta: '/reservas' },
        { nombre: 'Favoritos', icono: '♡', ruta: '/favoritos' },
        { nombre: 'Mi perfil', icono: '♙', ruta: '/perfil' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar__logo">
                <h2>Picado<span>⚽</span></h2>
            </div>
            
            <nav className="sidebar__nav">
                {opciones.map((opcion) => (
                    <NavLink
                        key={opcion.nombre}
                        to={opcion.ruta}
                        className={({ isActive }) =>
                            `sidebar__link ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="sidebar__icono">{opcion.icono}</span>
                            {opcion.nombre}
                    </NavLink>
                ))}
            </nav>
            
            <div className="sidebar__inferior">
                <button className="sidebar__link">
                    <span className="sidebar__icono">⚙</span>
                        Configuración
                </button>
                
                <button className="sidebar__link" onClick={salir}>
                    <span className="sidebar__icono">⇥</span>
                        Cerrar sesión
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;