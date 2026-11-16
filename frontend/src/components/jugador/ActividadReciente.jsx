import {
    CircleCheck,
    Trophy,
    CircleX,
    Activity,
    ChevronRight,
} from 'lucide-react';

function ActividadReciente() {
    const actividades = [
        {
            id: 1,
            tipo: 'confirmada',
            Icono: CircleCheck,
            titulo: 'Reserva confirmada',
            descripcion: 'Complejo Deportivo Norte · Cancha 2',
            fecha: 'Hoy · 10:35',
        },
        {
            id: 2,
            tipo: 'realizada',
            Icono: Trophy,
            titulo: 'Partido realizado',
            descripcion: 'Complejo Los Amigos · Cancha 1',
            fecha: 'Ayer · 19:00',
        },
        {
            id: 3,
            tipo: 'cancelada',
            Icono: CircleX,
            titulo: 'Reserva cancelada',
            descripcion: 'Complejo Deportivo Sur · Cancha 3',
            fecha: '12 de noviembre',
        },
    ];
    
    return (
        <section className="actividad-reciente">
            <div className="actividad-reciente__encabezado">
                <Activity size={22} />
                <h2>Actividad reciente</h2>
            </div>
            
            <div className="actividad-reciente__lista">
                {actividades.map(({ id, tipo, Icono, titulo, descripcion, fecha }) => (
                    <article
                        key={id}
                        className="actividad-reciente__item"
                    >
                        <span
                            className={`actividad-reciente__icono actividad-reciente__icono--${tipo}`}
                        >
                            <Icono size={22} />
                        </span>
                        
                        <div className="actividad-reciente__datos">
                            <h3>{titulo}</h3>
                            <p>{descripcion}</p>
                            <span className="actividad-reciente__fecha">
                                {fecha}
                            </span>
                        </div>
                        
                        <ChevronRight
                            className="actividad-reciente__flecha"
                            size={21}
                        />
                    </article>
                ))}
            </div>
        </section>
    );
}

export default ActividadReciente;