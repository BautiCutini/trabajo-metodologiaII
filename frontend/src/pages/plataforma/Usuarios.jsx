import { useEffect, useRef, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Plus, Pencil, UserX, UserCheck } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmarCambioEstado from '../../components/panel/ConfirmarCambioEstado';
import FormularioUsuario from './FormularioUsuario';
import { useAuth } from '../../context/AuthContext';
import { useListado } from '../../hooks/useListado';
import { listarUsuarios, darDeBajaUsuario, actualizarUsuario } from '../../services/usuario.service';
import { listarComplejos } from '../../services/complejo.service';
import { NOMBRE_ROL, ROLES } from '../../utils/roles';
import styles from './Gestion.module.css';

// Fuera del componente: así es siempre la misma función y el hook no vuelve a pedir de más
const listarPorApellido = (parametros) => listarUsuarios({ ...parametros, sortBy: 'apellido' });

function Usuarios() {
    const { usuario: usuarioActual } = useAuth();
    const listado = useListado(listarPorApellido, { filtrosIniciales: { rol: '', estado: '' } });

    // Modal de alta o edición: usuario null significa "nuevo"
    const [modal, setModal] = useState({ abierto: false, usuario: null });
    // Usuario al que se le va a dar de baja o reactivar (null = sin confirmación abierta)
    const [aConfirmar, setAConfirmar] = useState(null);
    const [aviso, setAviso] = useState('');
    // Temporizador que borra el aviso: se guarda para poder reiniciarlo
    const temporizadorAviso = useRef(null);
    const [complejos, setComplejos] = useState([]);

    // Los complejos activos, para el selector del formulario. Se piden una sola vez
    useEffect(() => {
        listarComplejos()
            .then(setComplejos)
            .catch(() => setComplejos([]));
    }, []);

    function cerrarModal() {
        setModal({ abierto: false, usuario: null });
    }

    function alGuardar(mensaje) {
        cerrarModal();
        setAConfirmar(null);
        listado.recargar();
        mostrarAviso(mensaje);
    }

    // Si llega un aviso nuevo antes de que se borre el anterior, se reinicia la cuenta
    function mostrarAviso(mensaje) {
        clearTimeout(temporizadorAviso.current);
        setAviso(mensaje);
        temporizadorAviso.current = setTimeout(() => setAviso(''), 4000);
    }

    const { items: usuarios, cargando, error, pagina, totalPages, total, desde, hasta } = listado;

    return (
        <section className={styles.pagina}>
            <header className={styles.encabezado}>
                <div>
                    <h1 className={styles.titulo}>Usuarios</h1>
                    <p className={styles.subtitulo}>
                        Gestioná las cuentas de jugadores, encargados y administradores.
                    </p>
                </div>
                <Button iconoIzquierda={<Plus size={20} />} onClick={() => setModal({ abierto: true, usuario: null })}>
                    Nuevo usuario
                </Button>
            </header>

            {aviso && (
                <div className={styles.aviso} role="status">
                    <CheckCircle2 size={18} aria-hidden="true" />
                    <span>{aviso}</span>
                </div>
            )}

            <div className={styles.filtros}>
                <Input
                    etiqueta="Buscar"
                    icono={<Search size={20} />}
                    type="search"
                    placeholder="Nombre o apellido"
                    value={listado.busqueda}
                    onChange={(e) => listado.setBusqueda(e.target.value)}
                />

                <label className={styles.campo}>
                    <span className={styles.etiqueta}>Rol</span>
                    <select name="rol" value={listado.filtros.rol} onChange={listado.cambiarFiltro} className={styles.select}>
                        <option value="">Todos</option>
                        {ROLES.map((rol) => (
                            <option key={rol} value={rol}>{NOMBRE_ROL[rol]}</option>
                        ))}
                    </select>
                </label>

                <label className={styles.campo}>
                    <span className={styles.etiqueta}>Estado</span>
                    <select name="estado" value={listado.filtros.estado} onChange={listado.cambiarFiltro} className={styles.select}>
                        <option value="">Todos</option>
                        <option value="ACTIVO">Activos</option>
                        <option value="INACTIVO">Inactivos</option>
                    </select>
                </label>
            </div>

            {error && (
                <div className={styles.alerta} role="alert">
                    <AlertCircle size={18} aria-hidden="true" />
                    <span>{error}</span>
                </div>
            )}

            <div className={styles.tablaContenedor}>
                <table className={styles.tabla} aria-busy={cargando}>
                    <caption className={styles.oculto}>Listado de usuarios</caption>
                    <thead>
                        <tr>
                            <th scope="col">Usuario</th>
                            <th scope="col">Rol</th>
                            <th scope="col">Complejo</th>
                            <th scope="col">Estado</th>
                            <th scope="col"><span className={styles.oculto}>Acciones</span></th>
                        </tr>
                    </thead>
                    <tbody className={cargando ? styles.cargando : ''}>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>
                                    <span className={styles.nombre}>
                                        {usuario.apellido}, {usuario.nombre}
                                    </span>
                                    <span className={styles.secundario}>{usuario.email}</span>
                                </td>
                                <td>{NOMBRE_ROL[usuario.rol]}</td>
                                <td>{usuario.Complejo?.nombre ?? '—'}</td>
                                <td>
                                    <span className={usuario.estado === 'ACTIVO' ? styles.activo : styles.inactivo}>
                                        {usuario.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className={styles.celdaAcciones}>
                                    <div className={styles.grupoAcciones}>
                                        <button
                                            type="button"
                                            className={styles.accion}
                                            onClick={() => setModal({ abierto: true, usuario })}
                                            aria-label={`Editar a ${usuario.nombre} ${usuario.apellido}`}
                                            title="Editar"
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        {/* Nadie puede darse de baja a sí mismo: el back lo rechaza */}
                                        {usuario.id !== usuarioActual.id && (
                                            usuario.estado === 'ACTIVO' ? (
                                                <button
                                                    type="button"
                                                    className={`${styles.accion} ${styles.accionPeligro}`}
                                                    onClick={() => setAConfirmar(usuario)}
                                                    aria-label={`Dar de baja a ${usuario.nombre} ${usuario.apellido}`}
                                                    title="Dar de baja"
                                                >
                                                    <UserX size={18} />
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className={styles.accion}
                                                    onClick={() => setAConfirmar(usuario)}
                                                    aria-label={`Reactivar a ${usuario.nombre} ${usuario.apellido}`}
                                                    title="Reactivar"
                                                >
                                                    <UserCheck size={18} />
                                                </button>
                                            )
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {!cargando && usuarios.length === 0 && (
                            <tr>
                                <td colSpan={5} className={styles.vacio}>
                                    No hay usuarios que coincidan con la búsqueda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <footer className={styles.paginacion}>
                <span className={styles.conteo}>
                    {total > 0 ? `Mostrando ${desde}–${hasta} de ${total}` : ''}
                </span>

                <div className={styles.botones}>
                    <Button
                        variante="secundario"
                        iconoIzquierda={<ChevronLeft size={18} />}
                        disabled={pagina <= 1 || cargando}
                        onClick={() => listado.setPagina(pagina - 1)}
                    >
                        Anterior
                    </Button>
                    <Button
                        variante="secundario"
                        iconoDerecha={<ChevronRight size={18} />}
                        disabled={pagina >= totalPages || cargando}
                        onClick={() => listado.setPagina(pagina + 1)}
                    >
                        Siguiente
                    </Button>
                </div>
            </footer>

            <Modal
                abierto={modal.abierto}
                titulo={modal.usuario ? 'Editar usuario' : 'Nuevo usuario'}
                onCerrar={cerrarModal}
            >
                <FormularioUsuario
                    usuario={modal.usuario}
                    esUnoMismo={modal.usuario?.id === usuarioActual.id}
                    complejos={complejos}
                    onGuardado={alGuardar}
                    onCancelar={cerrarModal}
                />
            </Modal>

            <Modal
                abierto={aConfirmar !== null}
                titulo={aConfirmar?.estado === 'ACTIVO' ? '¿Dar de baja este usuario?' : '¿Reactivar este usuario?'}
                onCerrar={() => setAConfirmar(null)}
            >
                {aConfirmar && (
                    <ConfirmarCambioEstado
                        nombre={`${aConfirmar.nombre} ${aConfirmar.apellido}`}
                        activo={aConfirmar.estado === 'ACTIVO'}
                        consecuenciaBaja="no va a poder iniciar sesión. Sus reservas y su historial se conservan, y la cuenta se puede reactivar cuando quieras."
                        consecuenciaReactivacion="va a poder volver a iniciar sesión con su contraseña de siempre."
                        darDeBaja={() => darDeBajaUsuario(aConfirmar.id)}
                        reactivar={() => actualizarUsuario(aConfirmar.id, { estado: 'ACTIVO' })}
                        onConfirmado={alGuardar}
                        onCancelar={() => setAConfirmar(null)}
                    />
                )}
            </Modal>
        </section>
    );
}

export default Usuarios;