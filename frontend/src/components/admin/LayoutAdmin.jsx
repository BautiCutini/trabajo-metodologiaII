import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './LayoutAdmin.css';

const ENCARGADO = 'ENCARGADO';
const ADMIN = 'ADMIN_COMPLEJO';

// Cada opción dice qué roles la ven. Más adelante se suman acá:
// Reservas, Canchas y Horarios.
const OPCIONES = [
    { nombre: 'Inicio', Icono: LayoutDashboard, ruta: '/admin', roles: [ENCARGADO, ADMIN], fin: true },
];

const ETIQUETA_ROL = {
    [ENCARGADO]: 'Empleado',
    [ADMIN]: 'Administrador',
};

function LayoutAdmin({ titulo, subtitulo, children }) {
    const { usuario, cerrarSesion } = useAuth();
    const navigate = useNavigate();

    const opciones = OPCIONES.filter((o) => o.roles.includes(usuario.rol));

    function salir() {
        cerrarSesion();
        navigate('/login', { replace: true });
    }

    return (
        <div className="panel">
            <aside className="panel__lateral">
                <img className="panel__logo" src="/images/logo-picado.png" alt="Picado" />

                <nav className="panel__nav">
                    {opciones.map(({ nombre, Icono, ruta, fin }) => (
                        <NavLink
                            key={ruta}
                            to={ruta}
                            end={fin}
                            className={({ isActive }) => `panel__link ${isActive ? 'activo' : ''}`}
                        >
                            <Icono size={20} />
                            <span>{nombre}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="panel__usuario">
                    <div>
                        <strong>{usuario.nombre} {usuario.apellido}</strong>
                        <small>{ETIQUETA_ROL[usuario.rol]}</small>
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

            {/* En el celular el menú pasa abajo */}
            <nav className="panel__inferior">
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