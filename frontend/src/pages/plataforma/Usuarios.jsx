import { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { listarUsuarios } from '../../services/usuario.service';
import { NOMBRE_ROL, ROLES } from '../../utils/roles';
import styles from './Usuarios.module.css';

const POR_PAGINA = 10;

function Usuarios() {
    // Lo que el usuario está escribiendo en el buscador
    const [busqueda, setBusqueda] = useState('');
    // Los filtros que realmente se mandan al back
    const [filtros, setFiltros] = useState({ nombre: '', rol: '', estado: '' });
    const [pagina, setPagina] = useState(1);
    // La última respuesta del back, junto con la consulta que la pidió
    const [respuesta, setRespuesta] = useState({
        consulta: null,
        data: [],
        total: 0,
        totalPages: 0,
        error: '',
    });

    // Identifica la consulta actual: si cambia un filtro o la página, es otra consulta
    const consulta = JSON.stringify({ ...filtros, pagina });
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
                <h1 className={styles.titulo}>Usuarios</h1>
                <p className={styles.subtitulo}>
                    Gestioná las cuentas de jugadores, encargados y administradores.
                </p>
            </header>

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
                            </tr>
                        ))}

                        {!cargando && usuarios.length === 0 && (
                            <tr>
                                <td colSpan={4} className={styles.vacio}>
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
        </section>
    );
}

export default Usuarios;