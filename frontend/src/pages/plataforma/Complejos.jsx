import { useRef, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Plus, Pencil, Ban, RotateCcw } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmarCambioEstado from '../../components/panel/ConfirmarCambioEstado';
import FormularioComplejo from './FormularioComplejo';
import { useListado } from '../../hooks/useListado';
import {
    listarTodosLosComplejos,
    darDeBajaComplejo,
    actualizarComplejo,
} from '../../services/complejo.service';
import styles from './Gestion.module.css';

function Complejos() {
    const listado = useListado(listarTodosLosComplejos, { filtrosIniciales: { estado: '' } });

    // Modal de alta o edición: complejo null significa "nuevo"
    const [modal, setModal] = useState({ abierto: false, complejo: null });
    // Complejo al que se le va a dar de baja o reactivar
    const [aConfirmar, setAConfirmar] = useState(null);
    const [aviso, setAviso] = useState('');
    // Temporizador que borra el aviso: se guarda para poder reiniciarlo
    const temporizadorAviso = useRef(null);

    function cerrarModal() {
        setModal({ abierto: false, complejo: null });
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

    const { items: complejos, cargando, error, pagina, totalPages, total, desde, hasta } = listado;

    return (
        <section className={styles.pagina}>
            <header className={styles.encabezado}>
                <div>
                    <h1 className={styles.titulo}>Complejos</h1>
                    <p className={styles.subtitulo}>
                        Sumá complejos a la plataforma y administrá su ubicación y sus datos de contacto.
                    </p>
                </div>
                <Button iconoIzquierda={<Plus size={20} />} onClick={() => setModal({ abierto: true, complejo: null })}>
                    Nuevo complejo
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
                    placeholder="Nombre o dirección"
                    value={listado.busqueda}
                    onChange={(e) => listado.setBusqueda(e.target.value)}
                />

                <label className={styles.campo}>
                    <span className={styles.etiqueta}>Estado</span>
                    <select name="estado" value={listado.filtros.estado} onChange={listado.cambiarFiltro} className={styles.select}>
                        <option value="">Todos</option>
                        <option value="ACTIVO">Activos</option>
                        <option value="INACTIVO">Dados de baja</option>
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
                    <caption className={styles.oculto}>Listado de complejos</caption>
                    <thead>
                        <tr>
                            <th scope="col">Complejo</th>
                            <th scope="col">Teléfono</th>
                            <th scope="col">Mapa</th>
                            <th scope="col">Estado</th>
                            <th scope="col"><span className={styles.oculto}>Acciones</span></th>
                        </tr>
                    </thead>
                    <tbody className={cargando ? styles.cargando : ''}>
                        {complejos.map((complejo) => {
                            const activo = complejo.estado === 'ACTIVO';
                            const ubicado = complejo.latitud != null && complejo.longitud != null;

                            return (
                                <tr key={complejo.id}>
                                    <td>
                                        <span className={styles.nombre}>{complejo.nombre}</span>
                                        <span className={styles.secundario}>{complejo.direccion}</span>
                                    </td>
                                    <td>{complejo.telefono}</td>
                                    <td className={ubicado ? '' : styles.secundario}>
                                        {ubicado ? 'Ubicado' : 'Sin ubicar'}
                                    </td>
                                    <td>
                                        <span className={activo ? styles.activo : styles.inactivo}>
                                            {activo ? 'Activo' : 'Dado de baja'}
                                        </span>
                                    </td>
                                    <td className={styles.celdaAcciones}>
                                        <div className={styles.grupoAcciones}>
                                            <button
                                                type="button"
                                                className={styles.accion}
                                                onClick={() => setModal({ abierto: true, complejo })}
                                                aria-label={`Editar ${complejo.nombre}`}
                                                title="Editar"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                type="button"
                                                className={`${styles.accion} ${activo ? styles.accionPeligro : ''}`}
                                                onClick={() => setAConfirmar(complejo)}
                                                aria-label={`${activo ? 'Dar de baja' : 'Reactivar'} ${complejo.nombre}`}
                                                title={activo ? 'Dar de baja' : 'Reactivar'}
                                            >
                                                {activo ? <Ban size={18} /> : <RotateCcw size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {!cargando && complejos.length === 0 && (
                            <tr>
                                <td colSpan={5} className={styles.vacio}>
                                    No hay complejos que coincidan con la búsqueda.
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
                titulo={modal.complejo ? 'Editar complejo' : 'Nuevo complejo'}
                onCerrar={cerrarModal}
            >
                <FormularioComplejo
                    complejo={modal.complejo}
                    onGuardado={alGuardar}
                    onCancelar={cerrarModal}
                />
            </Modal>

            <Modal
                abierto={aConfirmar !== null}
                titulo={aConfirmar?.estado === 'ACTIVO' ? '¿Dar de baja este complejo?' : '¿Reactivar este complejo?'}
                onCerrar={() => setAConfirmar(null)}
            >
                {aConfirmar && (
                    <ConfirmarCambioEstado
                        nombre={aConfirmar.nombre}
                        activo={aConfirmar.estado === 'ACTIVO'}
                        consecuenciaBaja="deja de mostrarse a los jugadores en el listado y en el mapa. Sus canchas, su personal y su historial se conservan, y se puede reactivar cuando quieras."
                        consecuenciaReactivacion="vuelve a mostrarse a los jugadores en el listado y en el mapa."
                        darDeBaja={() => darDeBajaComplejo(aConfirmar.id)}
                        reactivar={() => actualizarComplejo(aConfirmar.id, { estado: 'ACTIVO' })}
                        onConfirmado={alGuardar}
                        onCancelar={() => setAConfirmar(null)}
                    />
                )}
            </Modal>
        </section>
    );
}

export default Complejos;