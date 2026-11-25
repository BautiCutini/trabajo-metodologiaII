import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock, Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LayoutAdmin from '../../components/admin/LayoutAdmin';
import { listarCanchasDelComplejo } from '../../services/cancha.service';
import { listarHorarios, darDeBajaHorario } from '../../services/horario.service';
import './GestionHorarios.css';

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function horaCorta(hora) {
    return String(hora ?? '').slice(0, 5);
}

function GestionHorarios() {
    const { usuario } = useAuth();
    const [canchas, setCanchas] = useState([]);
    const [horarios, setHorarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState(null);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [canchaSeleccionada, setCanchaSeleccionada] = useState('todas');

    const cargarDatos = useCallback(async () => {
        setCargando(true);
        setError('');
        try {
            const listaCanchas = await listarCanchasDelComplejo(usuario.complejo_id);
            setCanchas(listaCanchas);

            const respuestas = await Promise.all(
                listaCanchas.map((cancha) => listarHorarios({ cancha_id: cancha.id, limit: 100 }))
            );
            setHorarios(respuestas.flatMap((respuesta) => respuesta.data ?? []));
        } catch (err) {
            setError(err.message || 'No se pudieron cargar los horarios.');
        } finally {
            setCargando(false);
        }
    }, [usuario.complejo_id]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const horariosFiltrados = useMemo(() => {
        const lista = canchaSeleccionada === 'todas'
            ? horarios
            : horarios.filter((horario) => String(horario.cancha_id) === canchaSeleccionada);
        return [...lista].sort((a, b) =>
            a.dia_semana - b.dia_semana || horaCorta(a.hora_inicio).localeCompare(horaCorta(b.hora_inicio))
        );
    }, [horarios, canchaSeleccionada]);

    async function confirmarBaja(horario) {
        const cancha = canchas.find((item) => item.id === horario.cancha_id);
        const confirmado = window.confirm(
            `¿Querés dar de baja el horario de ${cancha?.nombre ?? 'la cancha'} del ${DIAS[horario.dia_semana]} de ${horaCorta(horario.hora_inicio)} a ${horaCorta(horario.hora_fin)}?`
        );
        if (!confirmado) return;

        setProcesando(horario.id);
        setError('');
        setMensaje('');
        try {
            await darDeBajaHorario(horario.id);
            setHorarios((actuales) => actuales.filter((item) => item.id !== horario.id));
            setMensaje('El horario se dio de baja correctamente.');
        } catch (err) {
            setError(err.message || 'No se pudo dar de baja el horario.');
        } finally {
            setProcesando(null);
        }
    }

    return (
        <LayoutAdmin titulo="Gestión de horarios" subtitulo="Administrá la disponibilidad de las canchas de tu complejo.">
            <section className="gestion-admin">
                <div className="gestion-admin__barra">
                    <label htmlFor="filtro-cancha">Filtrar por cancha</label>
                    <select id="filtro-cancha" value={canchaSeleccionada} onChange={(e) => setCanchaSeleccionada(e.target.value)}>
                        <option value="todas">Todas las canchas</option>
                        {canchas.map((cancha) => <option key={cancha.id} value={cancha.id}>{cancha.nombre}</option>)}
                    </select>
                    <button type="button" className="gestion-admin__secundario" onClick={cargarDatos} disabled={cargando}>
                        <RefreshCw size={16} /> Actualizar
                    </button>
                </div>

                {error && <p className="gestion-admin__alerta gestion-admin__alerta--error" role="alert">{error}</p>}
                {mensaje && <p className="gestion-admin__alerta gestion-admin__alerta--ok" role="status">{mensaje}</p>}

                {cargando ? (
                    <p className="gestion-admin__vacio">Cargando horarios...</p>
                ) : horariosFiltrados.length === 0 ? (
                    <div className="gestion-admin__vacio">
                        <CalendarDays size={30} />
                        <strong>No hay horarios activos</strong>
                        <span>Cuando las canchas tengan horarios configurados, van a aparecer acá.</span>
                    </div>
                ) : (
                    <div className="gestion-admin__lista">
                        {horariosFiltrados.map((horario) => {
                            const cancha = canchas.find((item) => item.id === horario.cancha_id);
                            return (
                                <article className="horario-item" key={horario.id}>
                                    <div className="horario-item__icono"><Clock size={21} /></div>
                                    <div className="horario-item__datos">
                                        <strong>{cancha?.nombre ?? `Cancha ${horario.cancha_id}`}</strong>
                                        <span>{DIAS[horario.dia_semana]} · {horaCorta(horario.hora_inicio)} a {horaCorta(horario.hora_fin)}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="gestion-admin__peligro"
                                        onClick={() => confirmarBaja(horario)}
                                        disabled={procesando === horario.id}
                                        aria-label={`Dar de baja horario ${horario.id}`}
                                    >
                                        <Trash2 size={17} />
                                        {procesando === horario.id ? 'Procesando...' : 'Dar de baja'}
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </LayoutAdmin>
    );
}

export default GestionHorarios;
