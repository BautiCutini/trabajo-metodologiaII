import {
    MapPin,
    ChevronDown,
    SlidersHorizontal,
    Goal,
} 

from 'lucide-react';

import LayoutJugador from '../../components/jugador/LayoutJugador';
import './reservas.css';

function Reservas() {
    return (
        <LayoutJugador>
            <section className="reservas">
            
                {/* Encabezado */}
                <header className="reservas__encabezado">
                    <h1>
                        <span className="reservas__decoracion">///</span>
                        Complejos
                    </h1>
                    
                    <p>Encontrá canchas cerca de vos.</p>
                </header>
                
                {/* Buscador y filtros */}
                <div className="reservas__busqueda">
                
                    <button
                        type="button"
                        className="reservas__selector-ciudad"
                    >
                        <MapPin className="reservas__icono-ubicacion" />
                        
                        <span>Seleccioná tu ciudad</span>
                        
                        <ChevronDown className="reservas__flecha" />
                    </button>
                    
                    <button
                        type="button"
                        className="reservas__boton-filtros"
                    >
                        <SlidersHorizontal />
                        <span>Filtrar por</span>
                    </button>
                
                </div>
                
                {/* Estado inicial */}
                <div className="reservas__estado-vacio">
                
                    <div className="reservas__icono-cancha">
                        <Goal />
                    </div>
                    
                    <p>
                        Elegí una ciudad y aplicá filtros
                        <br />
                        para descubrir complejos.
                    </p>
                    
                    <span className="reservas__acento" />
                
                </div>
            
            </section>
        </LayoutJugador>
    );
}

export default Reservas;