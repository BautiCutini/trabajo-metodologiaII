import { Link } from 'react-router-dom';

function ProximaReserva() {
    const reserva = {
        complejo: 'Complejo Deportivo Norte',
        cancha: 'Cancha 2 · Fútbol 5',
        fecha: 'Viernes 15 de noviembre',
        horario: '19:00 - 20:00',
        direccion: 'Bahía Blanca, Buenos Aires',
        imagen: '/images/complejo-norte.jpg',
    };
    
    return (
        <section className="proxima-reserva">
            <div className="proxima-reserva__encabezado">
                <div>
                    <span className="proxima-reserva__etiqueta">
                        TU PRÓXIMO PARTIDO
                    </span>
                        <h2>Próxima reserva</h2>
                </div>
                
                <span className="proxima-reserva__estado">
                    Confirmada
                </span>
            </div>
            
            <div className="proxima-reserva__contenido">
                <img
                    className="proxima-reserva__imagen"
                    src={reserva.imagen}
                    alt={`Cancha de ${reserva.complejo}`}
                />
                
                <div className="proxima-reserva__datos">
                    <h3>{reserva.complejo}</h3>
                        <p>{reserva.cancha}</p>
                    
                    <div className="proxima-reserva__detalle">
                        <span>📅 {reserva.fecha}</span>
                        <span>🕒 {reserva.horario}</span>
                        <span>📍 {reserva.direccion}</span>
                    </div>
                    
                    <Link
                        to="/reservas"
                        className="proxima-reserva__boton"
                    >
                        Ver reserva <span>→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default ProximaReserva;