function ActividadReciente() {
    const actividades = [
        {
            id: 1,
            tipo: 'confirmada',
            icono: '✓',
            titulo: 'Reserva confirmada',
            descripcion: 'Complejo Deportivo Norte · Cancha 2',
            fecha: 'Hoy · 10:35',
        },
        {
            id: 2,
            tipo: 'realizada',
            icono: '⚽',
            titulo: 'Partido realizado',
            descripcion: 'Complejo Los Amigos · Cancha 1',
            fecha: 'Ayer · 19:00',
        },
        {
            id: 3,
            tipo: 'cancelada',
            icono: '×',
            titulo: 'Reserva cancelada',
            descripcion: 'Complejo Deportivo Sur · Cancha 3',
            fecha: '12 de noviembre',
        },
    ];
    
    return (
        <section className="actividad-reciente">
            <div className="actividad-reciente__encabezado">
                <div>
                    <span className="actividad-reciente__etiqueta">
                        TU MOVIMIENTO
                    </span>
                    <h2>Actividad reciente</h2>
                </div>
            </div>
            
            <div className="actividad-reciente__lista">
                {actividades.map((actividad) => (
                    <article
                            key={actividad.id}
                            className="actividad-reciente__item"
                    >
                        <span
                            className={`actividad-reciente__icono actividad-reciente__icono--${actividad.tipo}`}
                        >
                            {actividad.icono}
                        </span>
                        
                            <div className="actividad-reciente__datos">
                                <h3>{actividad.titulo}</h3>
                                    <p>{actividad.descripcion}</p>
                                    <span className="actividad-reciente__fecha">
                                        {actividad.fecha}
                                    </span>
                            </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default ActividadReciente;