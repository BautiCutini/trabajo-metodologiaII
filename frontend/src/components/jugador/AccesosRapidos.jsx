import { Link } from 'react-router-dom';
import {
    CalendarPlus,
    MapPin,
    List,
    Heart,
    ArrowRight,
} from 'lucide-react';

function AccesosRapidos() {
    return (
        <section className="accesos-rapidos">
            <Link to="/reservar" className="accesos-rapidos__principal">
                <CalendarPlus className="accesos-rapidos__icono" size={28} />
                    <span>Reservar cancha</span>
                <ArrowRight className="accesos-rapidos__flecha" size={26} />
            </Link>
            
            <div className="accesos-rapidos__grupo">
                <Link to="/mapa" className="accesos-rapidos__secundario">
                    <MapPin className="accesos-rapidos__icono" size={26} />
                    <span>Buscar en el mapa</span>
                </Link>
                
                <Link to="/complejos" className="accesos-rapidos__secundario">
                    <List className="accesos-rapidos__icono" size={26} />
                    <span>Ver todos los complejos</span>
                </Link>
                
                <Link to="/favoritos" className="accesos-rapidos__secundario">
                    <Heart className="accesos-rapidos__icono" size={26} />
                    <span>Mis favoritos</span>
                </Link>
            </div>
        </section>
    );
}

export default AccesosRapidos;