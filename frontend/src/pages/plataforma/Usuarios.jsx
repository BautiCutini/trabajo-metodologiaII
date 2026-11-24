import { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Plus, Pencil } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import FormularioUsuario from './FormularioUsuario';
import { useAuth } from '../../context/AuthContext';
import { listarUsuarios } from '../../services/usuario.service';
import { listarComplejos } from '../../services/complejo.service';
import { NOMBRE_ROL, ROLES } from '../../utils/roles';
import styles from './Usuarios.module.css';

const POR_PAGINA = 10;

function Usuarios() {
    const { usuario: usuarioActual } = useAuth();

    // Lo que el usuario está escribiendo en el buscador
    const [busqueda, setBusqueda] = useState('');
    // Los filtros que realmente se mandan al back
    const [filtros, setFiltros] = useState({ nombre: '', rol: '', estado: '' });
    const [pagina, setPagina] = useState(1);
    // Se incrementa para volver a pedir la misma página después de guardar
    const [recarga, setRecarga] = useState(0);

    // Modal de alta o edición: usuario null significa "nuevo"
    const [modal, setModal] = useState({ abierto: false, usuario: null });
    const [aviso, setAviso] = useState('');
    const [complejos, setComplejos] = useState([]);
    // La última respuesta del back, junto con la consulta que la pidió
    const [respuesta, setRespuesta] = useState({
        consulta: null,
        data: [],
        total: 0,
        totalPages: 0,
        error: '',
    });

    // Identifica la consulta actual: si cambia un filtro o la página, es otra consulta
    const consulta = JSON.stringify({ ...filtros, pagina, recarga });
    // Está cargando mientras la respuesta que tenemos sea de una consulta anterior
    const cargando = respuesta.consulta !== consulta;

    // Busca 400 ms después de la última tecla, no en cada una
    useEffect(() => {
        const espera = setTimeout(() => {
            setFiltros((previos) => ({ ...previos, nombre: busqueda.trim() }));
            setPagina(1);
        }, 400);
        return () => clearTimeout(espera);
    }, [busqueda]);

    // Pide la página cada vez que cambia la consulta
    useEffect(() => {
        let vigente = true;
        const { nombre, rol, estado, pagina: page } = JSON.parse(consulta);

        listarUsuarios({ nombre, rol, estado, page, limit: POR_PAGINA, sortBy: 'apellido' })
            .then((datos) => {
                if (vigente) setRespuesta({ consulta, ...datos, error: '' });
            })
            .catch((e) => {
                if (vigente) setRespuesta((previa) => ({ ...previa, consulta, error: e.message }));
            });

        // Si llega otra consulta antes de que responda esta, esta respuesta se descarta
        return () => {
            vigente = false;
        };
    }, [consulta]);

    // Los complejos activos, para el selector del formulario. Se piden una sola vez
    useEffect(() => {
        listarComplejos()
            .then(setComplejos)
            .catch(() => setComplejos([]));
    }, []);

    function abrirAlta() {
        setModal({ abierto: true, usuario: null });
    }

    function abrirEdicion(usuario) {
        setModal({ abierto: true, usuario });
    }

    function cerrarModal() {
        setModal({ abierto: false, usuario: null });
    }

    function alGuardar(mensaje) {
        cerrarModal();
        setRecarga((valor) => valor + 1);
        setAviso(mensaje);
        setTimeout(() => setAviso(''), 4000);
    }

    function cambiarFiltro(evento) {
        const { name, value } = evento.target;
        setFiltros((previos) => ({ ...previos, [name]: value }));
        setPagina(1);
    }

    const { data: usuarios, total, totalPages, error } = respuesta;
    const desde = total === 0 ? 0 : (pagina - 1) * POR_PAGINA + 1;
    const hasta = Math.min(pagina * POR_PAGINA, total);

    return (
        <section className={styles.pagina}>
            <header className={styles.encabezado}>
                <div>
                    <h1 className={styles.titulo}>Usuarios</h1>
                    <p className={styles.subtitulo}>
                        Gestioná las cuentas de jugadores, encargados y administradores.
                    </p>
                </div>
                <Button iconoIzquierda={<Plus size={20} />} onClick={abrirAlta}>
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
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <label className={styles.campo}>
                    <span className={styles.etiqueta}>Rol</span>
                    <select name="rol" value={filtros.rol} onChange={cambiarFiltro} className={styles.select}>
                        <option value="">Todos</option>
                        {ROLES.map((rol) => (
                            <option key={rol} value={rol}>{NOMBRE_ROL[rol]}</option>
                        ))}
                    </select>
                </label>

                <label className={styles.campo}>
                    <span className={styles.etiqueta}>Estado</span>
                    <select name="estado" value={filtros.estado} onChange={cambiarFiltro} className={styles.select}>
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
                                    <span className={styles.email}>{usuario.email}</span>
                                </td>
                                <td>{NOMBRE_ROL[usuario.rol]}</td>
                                <td>{usuario.Complejo?.nombre ?? '—'}</td>
                                <td>
                                    <span className={usuario.estado === 'ACTIVO' ? styles.activo : styles.inactivo}>
                                        {usuario.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className={styles.celdaAcciones}>
                                    <button
                                        type="button"
                                        className={styles.accion}
                                        onClick={() => abrirEdicion(usuario)}
                                        aria-label={`Editar a ${usuario.nombre} ${usuario.apellido}`}
                                    >
                                        <Pencil size={18} />
                                    </button>
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
                        onClick={() => setPagina(pagina - 1)}
                    >
                        Anterior
                    </Button>
                    <Button
                        variante="secundario"
                        iconoDerecha={<ChevronRight size={18} />}
                        disabled={pagina >= totalPages || cargando}
                        onClick={() => setPagina(pagina + 1)}
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
        </section>
    );
}

export default Usuarios;