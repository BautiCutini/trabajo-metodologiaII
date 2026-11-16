import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Bell,
    CalendarDays,
    ChevronRight,
    CreditCard,
    Heart,
    LogOut,
    Pencil,
    Settings,
    User,
} from 'lucide-react';

import LayoutJugador from '../../components/jugador/LayoutJugador';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import './Perfil.css';

const ROLES = {
    JUGADOR: 'Jugador',
    ENCARGADO: 'Encargado',
    ADMIN_COMPLEJO: 'Administrador de complejo',
    ADMIN_PLATAFORMA: 'Administrador de plataforma',
};


const OPCIONES = [
    { clave: 'datos', Icono: User, titulo: 'Datos personales', detalle: 'Editá tu información de cuenta', ruta: '/perfil/datos' },
    { clave: 'reservas', Icono: CalendarDays, titulo: 'Mis reservas', detalle: 'Gestioná tus reservas y su estado', ruta: '/reservas' },
    { clave: 'favoritos', Icono: Heart, titulo: 'Favoritos', detalle: 'Complejos y canchas guardadas', ruta: '/favoritos' },
    { clave: 'pagos', Icono: CreditCard, titulo: 'Métodos de pago', detalle: 'Administrá tus formas de pago', ruta: '/perfil/pagos' },
    { clave: 'notificaciones', Icono: Bell, titulo: 'Notificaciones', detalle: 'Configurá tus alertas' },
    { clave: 'configuracion', Icono: Settings, titulo: 'Configuración', detalle: 'Preferencias de la aplicación', ruta: '/configuracion' },
];

const CLAVE_NOTIFICACIONES = 'picado_notificaciones';

// Dibujo decorativo de una cancha, de fondo en la tarjeta del usuario.
function LineasDeCancha() {
    return (
        <svg
            className="perfil__cancha"
            viewBox="0 0 400 240"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <rect x="8" y="8" width="384" height="224" rx="4" />
            <path d="M200 8v224" />
            <circle cx="200" cy="120" r="38" />
            <rect x="8" y="64" width="64" height="112" />
            <rect x="328" y="64" width="64" height="112" />
            <rect x="8" y="94" width="26" height="52" />
            <rect x="366" y="94" width="26" height="52" />
        </svg>
    );
}

function Interruptor({ activo, onChange, etiqueta }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={activo}
            aria-label={etiqueta}
            className={`interruptor ${activo ? 'interruptor--activo' : ''}`}
            onClick={() => onChange(!activo)}
        >
            <span className="interruptor__perilla" />
        </button>
    );
}

function ContenidoOpcion({ Icono, titulo, detalle, derecha }) {
    return (
        <>
            <Icono className="opcion__icono" aria-hidden="true" />
            <div className="opcion__texto">
                <h2>{titulo}</h2>
                <p>{detalle}</p>
            </div>
            {derecha}
        </>
    );
}

function Perfil() {
    const { usuario, cerrarSesion } = useAuth();
    const navigate = useNavigate();
    const [notificaciones, setNotificaciones] = useState(
        () => localStorage.getItem(CLAVE_NOTIFICACIONES) !== 'false'
    );

    function cambiarNotificaciones(activas) {
        setNotificaciones(activas);
        localStorage.setItem(CLAVE_NOTIFICACIONES, String(activas));
    }

    function salir() {
        cerrarSesion();
        navigate('/login', { replace: true });
    }

    const iniciales = `${usuario.nombre.charAt(0)}${usuario.apellido.charAt(0)}`.toUpperCase();

    return (
        <LayoutJugador>
            <section className="perfil">
                <header className="perfil__encabezado">
                    <h1>Mi perfil</h1>
                    <p>Gestioná tu información y preferencias</p>
                </header>

                <div className="perfil__usuario">
                    <LineasDeCancha />

                    <div className="perfil__foto">
                        <div className="perfil__avatar">
                            {usuario.imagen_url ? (
                                <img src={usuario.imagen_url} alt={`Foto de ${usuario.nombre} ${usuario.apellido}`} />
                            ) : (
                                <span aria-hidden="true">{iniciales}</span>
                            )}
                        </div>
                        <button
                            type="button"
                            className="perfil__editar-foto"
                            aria-label="Editar foto de perfil"
                            onClick={() => navigate('/perfil/datos')}
                        >
                            <Pencil size={18} />
                        </button>
                    </div>

                    <div className="perfil__datos">
                        <h2>{usuario.nombre} {usuario.apellido}</h2>
                        <p>{usuario.email}</p>
                        <span className="perfil__rol">
                            <User size={16} aria-hidden="true" />
                            {ROLES[usuario.rol] ?? usuario.rol}
                        </span>
                    </div>
                </div>

                <ul className="perfil__opciones">
                    {OPCIONES.map(({ clave, ruta, ...opcion }) => (
                        <li key={clave}>
                            {ruta ? (
                                <Link to={ruta} className="opcion opcion--enlace">
                                    <ContenidoOpcion
                                        {...opcion}
                                        derecha={<ChevronRight className="opcion__flecha" aria-hidden="true" />}
                                    />
                                </Link>
                            ) : (
                                <div className="opcion">
                                    <ContenidoOpcion
                                        {...opcion}
                                        derecha={
                                            <Interruptor
                                                activo={notificaciones}
                                                onChange={cambiarNotificaciones}
                                                etiqueta="Activar notificaciones"
                                            />
                                        }
                                    />
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="perfil__salir">
                    <Button anchoCompleto iconoIzquierda={<LogOut size={22} />} onClick={salir}>
                        Cerrar sesión
                    </Button>
                </div>
            </section>
        </LayoutJugador>
    );
}

export default Perfil;