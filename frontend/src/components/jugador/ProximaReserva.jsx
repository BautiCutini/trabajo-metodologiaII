import { Link } from 'react-router-dom';
import {
    CalendarDays,
    Clock,
    ChevronRight,
} from 'lucide-react';

function ProximaReserva() {
    const reserva = {
        complejo: 'Complejo Deportivo Norte',
        cancha: 'Cancha 2 · Fútbol 5',
        fecha: 'Viernes 15 de noviembre',
        horario: '19:00 - 20:00',
        estado: 'Confirmada',
        imagen: '/images/complejo-norte.jpg',
    };
    
    return (
        <section className="proxima-reserva">
            <div className="proxima-reserva__encabezado">
                <h2>Próxima reserva</h2>
                
                <Link to="/reservas" className="proxima-reserva__ver-todas">
                    Ver todas
                    <ChevronRight size={17} />
                </Link>
            </div>
            
            <Link to="/reservas" className="proxima-reserva__contenido">
                <img
                    className="proxima-reserva__imagen"
                    src={reserva.imagen}
                    alt={`Cancha de ${reserva.complejo}`}
                />
                
                <div className="proxima-reserva__datos">
                    <h3>{reserva.complejo}</h3>
                    
                    <p>{reserva.cancha}</p>
                    
                    <div className="proxima-reserva__detalle">
                        <span>
                            <CalendarDays size={17} />
                            {reserva.fecha}
                        </span>
                        
                        <span>
                            <Clock size={17} />
                            {reserva.horario}
                        </span>
                    </div>
                </div>
                
                <span className="proxima-reserva__estado">
                    {reserva.estado}
                </span>
                
                <ChevronRight
                    className="proxima-reserva__flecha"
                    size={23}
                />
            </Link>
        </section>
    );
}

export default ProximaReserva;