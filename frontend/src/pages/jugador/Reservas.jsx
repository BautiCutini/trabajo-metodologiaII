import { useState } from 'react';
import {
    MapPin,
    ChevronDown,
    SlidersHorizontal,
    Goal,
    X,
    CalendarDays,
    Clock,
    RotateCcw,
    ArrowRight,
} 

from 'lucide-react';

import LayoutJugador from '../../components/jugador/LayoutJugador';
import './reservas.css';

function Reservas() {
    
    const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
    const [fechaSeleccionada, setFechaSeleccionada] = useState('');
    const [filtrosAplicados, setFiltrosAplicados] = useState(null);
    
    const limpiarFiltros = () => {
        setFechaSeleccionada('');
        setHorariosSeleccionados([]);
        setTiposSeleccionados([]);
        setFiltrosAplicados(null);
    };
    
    const aplicarFiltros = () => {
        setFiltrosAplicados({
            fecha: fechaSeleccionada,
            horarios: [...horariosSeleccionados],
            tipos: [...tiposSeleccionados],
        });
    
        setFiltrosAbiertos(false);
    };
    
    const [horariosSeleccionados, setHorariosSeleccionados] = useState([]);
    const horarios = [
        '07:00hs', '08:00hs', '09:00hs', '10:00hs',
        '11:00hs', '12:00hs', '13:00hs', '14:00hs',
        '15:00hs', '16:00hs', '17:00hs', '18:00hs',
        '19:00hs', '20:00hs', '21:00hs', '22:00hs', 
        '23:00hs', '24:00hs', '01:00hs',
    ];
    const seleccionarHorario = (horario) => {
        setHorariosSeleccionados((previos) =>
            previos.includes(horario)
                ? previos.filter((h) => h !== horario)
                : [...previos, horario]
        );
    };
    
    const [tiposSeleccionados, setTiposSeleccionados] = useState([]);
    
    const tiposCancha = ['Fútbol 5', 'Fútbol 7', 'Fútbol 9', 'Fútbol 11'];
    
    const seleccionarTipo = (tipo) => {
        setTiposSeleccionados((previos) =>
            previos.includes(tipo)
                ? previos.filter((t) => t !== tipo)
                : [...previos, tipo]
            );
        };
    
    
    
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
                        onClick={() => setFiltrosAbiertos(true)}
                    >
                        <SlidersHorizontal />
                        <span>Filtrar por</span>
                    </button>
                </div>
                
                {/* Modal de filtros */}
                {filtrosAbiertos && (
                    <div className="reservas__overlay">
                        <div className="reservas__modal">
                            {/* Encabezado del modal */}
                            <header className="reservas__modal-encabezado">
                                <div className="reservas__modal-titulo">
                                    <SlidersHorizontal />
                                    <h2>Filtrar por</h2>
                                </div>
                                
                                <button
                                    type="button"
                                    className="reservas__modal-cerrar"
                                    onClick={() => setFiltrosAbiertos(false)}
                                >
                                    <X />
                                </button>
                            </header>
                            {/* Contenido del modal */}
                            <div className="reservas__modal-contenido">
                                {/* Fecha */}
                                <section className="reservas__modal-seccion">
                                    <h3>
                                        <CalendarDays />
                                        Fecha
                                    </h3>
                                    <input
                                        type="date"
                                        className="reservas__modal-fecha"
                                        onChange={(e) => setFechaSeleccionada(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </section>
                                
                                {/* Horarios deseados */}
                                <section className="reservas__modal-seccion reservas__modal-horarios">
                                    <h3>
                                        <Clock />
                                        Horarios deseados
                                    </h3>
                                    <div className="reservas__horarios-lista">
                                        {horarios.map((horario) => (
                                            <button
                                                key={horario}
                                                type="button"
                                                className={`reservas__horario ${
                                                    horariosSeleccionados.includes(horario)
                                                    ? 'reservas__horario--activo'
                                                    : ''
                                                }`}
                                                onClick={() => seleccionarHorario(horario)}
                                            >
                                                {horario}
                                            </button>
                                        ))}
                                    </div>
                                </section>
                                {/* Tipo de cancha */}
                                <section className="reservas__modal-seccion">
                                    <div className="reservas__modal-subtitulo">
                                        <Goal />
                                        <h3>Tipo de cancha</h3>
                                    </div>
                                    <div className="reservas__tipos-cancha">
                                        {tiposCancha.map((tipo) => (
                                            <button
                                                key={tipo}
                                                type="button"
                                                className={`reservas__tipo-cancha ${
                                                    tiposSeleccionados.includes(tipo)
                                                        ? 'reservas__tipo-cancha--activo'
                                                        : ''
                                                }`}
                                                onClick={() => seleccionarTipo(tipo)}
                                            >
                                                ⚽ {tipo}
                                            </button>
                                        ))}
                                    </div>
                                </section>
                                {/* Acciones de filtros */}
                                <div className="reservas__modal-acciones">
                                    <button
                                        type="button"
                                        className="reservas__limpiar-filtros"
                                        onClick={limpiarFiltros}
                                    >        
                                        <RotateCcw />
                                        Limpiar filtros
                                    </button>
                                    <button
                                        type="button"
                                        className="reservas__aplicar-filtros"
                                        onClick={aplicarFiltros}
                                    >
                                        Aplicar filtros
                                        <ArrowRight />
                                    </button>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                )}
                
            </section>
        </LayoutJugador>
    );
}

export default Reservas;