import { useRef, useState } from 'react';
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
import { actualizarPerfil } from '../../services/auth.service';
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


function reducirImagen(archivo, lado = 256) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(archivo);
        const img = new Image();

        img.onload = () => {
            const corte = Math.min(img.width, img.height);
            const canvas = document.createElement('canvas');
            canvas.width = lado;
            canvas.height = lado;
            canvas.getContext('2d').drawImage(
                img,
                (img.width - corte) / 2, (img.height - corte) / 2, corte, corte,
                0, 0, lado, lado
            );
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('No se pudo leer la imagen'));
        };
        img.src = url;
    });
}

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
    const { usuario, cerrarSesion, actualizarUsuario } = useAuth();
    const navigate = useNavigate();
    const inputFoto = useRef(null);
    const [subiendoFoto, setSubiendoFoto] = useState(false);
    const [errorFoto, setErrorFoto] = useState('');
    const [notificaciones, setNotificaciones] = useState(
        () => localStorage.getItem(CLAVE_NOTIFICACIONES) !== 'false'
    );

    async function cambiarFoto(e) {
        const archivo = e.target.files[0];
        e.target.value = '';
        if (!archivo) return;

        if (!archivo.type.startsWith('image/')) {
            setErrorFoto('Elegí un archivo de imagen');
            return;
        }

        setErrorFoto('');
        setSubiendoFoto(true);
        try {
            const imagen = await reducirImagen(archivo);
            const actualizado = await actualizarPerfil({ imagen_url: imagen });
            actualizarUsuario(actualizado);
        } catch (error) {
            setErrorFoto(error.message);
        } finally {
            setSubiendoFoto(false);
        }
    }

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
                        <input
                            ref={inputFoto}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={cambiarFoto}
                        />
                        <button
                            type="button"
                            className="perfil__editar-foto"
                            aria-label="Cambiar foto de perfil"
                            disabled={subiendoFoto}
                            onClick={() => inputFoto.current.click()}
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

                {errorFoto && <p className="perfil__error" role="alert">{errorFoto}</p>}

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