import { Link } from 'react-router-dom';

function AccesosRapidos() {
    return (
        
        <section className="accesos-rapidos">
            
            <Link to="/reservar" className="accesos-rapidos__principal">
                <span className="accesos-rapidos__icono">▦</span>
                <span>Reservar cancha</span>
                <span className="accesos-rapidos__flecha">›</span>
            </Link>
            
            <Link to="/complejos" className="accesos-rapidos__secundario">
                <span className="accesos-rapidos__icono">⌖</span>
                <span>Buscar en el mapa</span>
            </Link>
            
            <Link to="/complejos" className="accesos-rapidos__secundario">
                <span className="accesos-rapidos__icono">☷</span>
                <span>Ver todos los complejos</span>
            </Link>
            
            <Link to="/favoritos" className="accesos-rapidos__secundario">
                <span className="accesos-rapidos__icono">♡</span>
                <span>Mis favoritos</span>
            </Link>

        </section>
    );
}

export default AccesosRapidos;