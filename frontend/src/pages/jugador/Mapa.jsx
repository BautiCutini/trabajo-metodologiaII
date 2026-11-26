import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, AlertCircle } from 'lucide-react';
import MapaComplejos from '../../components/mapa/MapaComplejos';
import { listarComplejos } from '../../services/complejo.service';
import styles from './Mapa.module.css';

const IMAGEN_POR_DEFECTO = '/images/complejo-norte.jpg';

function Mapa() {
    const [complejos, setComplejos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        listarComplejos()
            .then(setComplejos)
            .catch((e) => setError(e.message))
            .finally(() => setCargando(false));
    }, []);

    // Solo se pueden dibujar los que tienen coordenadas cargadas
    const ubicados = complejos.filter((c) => c.latitud != null && c.longitud != null);

    return (
        <div className={styles.pagina}>
            <header className={styles.encabezado}>
                <Link to="/" className={styles.volver} aria-label="Volver al inicio">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className={styles.titulo}>Buscar en el mapa</h1>
            </header>

            {error && (
                <div className={styles.alerta} role="alert">
                    <AlertCircle size={18} aria-hidden="true" />
                    <span>{error}</span>
                </div>
            )}

            <MapaComplejos complejos={ubicados} />

            <section>
                <h2 className={styles.subtitulo}>
                    Complejos en la zona {!cargando && <span>({ubicados.length})</span>}
                </h2>

                {cargando && <p className={styles.vacio}>Cargando complejos…</p>}

                {!cargando && !error && ubicados.length === 0 && (
                    <p className={styles.vacio}>Todavía no hay complejos ubicados en el mapa.</p>
                )}

                <ul className={styles.lista}>
                    {ubicados.map((complejo) => (
                        <li key={complejo.id} className={styles.tarjeta}>
                            <img
                                src={complejo.imagen_url || IMAGEN_POR_DEFECTO}
                                alt=""
                                className={styles.foto}
                            />
                            <div className={styles.datos}>
                                <h3 className={styles.nombre}>{complejo.nombre}</h3>
                                <p className={styles.direccion}>
                                    <MapPin size={16} aria-hidden="true" />
                                    {complejo.direccion}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default Mapa;