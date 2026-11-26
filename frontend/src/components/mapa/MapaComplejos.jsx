import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './MapaComplejos.module.css';

const CENTRO_BAHIA_BLANCA = [-38.7183, -62.2663];

function crearPin(estado) {
    return L.divIcon({
        // Sin className, Leaflet le pone un cuadrado blanco de fondo
        className: '',
        html: `<span class="${styles.pin} ${styles[estado]}"><span class="${styles.pinCentro}"></span></span>`,
        iconSize: [32, 32],
        // La punta de la gota, que es el punto exacto de la ubicación
        iconAnchor: [16, 39],
        popupAnchor: [0, -36],
    });
}

// Se crean una sola vez, no en cada render
const PINES = {
    neutro: crearPin('neutro'),
    disponible: crearPin('disponible'),
    ocupado: crearPin('ocupado'),
};

function MapaComplejos({ complejos }) {
    return (
        <MapContainer
            center={CENTRO_BAHIA_BLANCA}
            zoom={13}
            className={styles.mapa}
        >
            <TileLayer
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                maxZoom={19}
            />

            {complejos.map((complejo) => (
                <Marker
                    key={complejo.id}
                    position={[complejo.latitud, complejo.longitud]}
                    icon={PINES.neutro}
                >
                    <Popup>
                        <strong>{complejo.nombre}</strong>
                        <br />
                        {complejo.direccion}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default MapaComplejos;