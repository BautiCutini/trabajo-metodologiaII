import {
    Layers,
    Bell,
    RefreshCw,
    CalendarDays,
    CalendarX,
    MessageCircle,
    ChevronRight,
} from 'lucide-react';

function ActividadReciente() {
    const opciones = [
        {
            id: 1,
            Icono: Bell,
            titulo: 'Notificaciones',
            descripcion: 'Enterate de confirmaciones, cambios y novedades.',
        },
        {
            id: 2,
            Icono: RefreshCw,
            titulo: 'Repetir reserva',
            descripcion: 'Volvé a reservar una cancha con tus datos anteriores.',
        },
        {
            id: 3,
            Icono: CalendarDays,
            titulo: 'Historial de reservas',
            descripcion: 'Consultá todas tus reservas, pasadas y futuras.',
        },
        {
            id: 4,
            Icono: CalendarX,
            titulo: 'Cancelaciones',
            descripcion: 'Revisá tus reservas canceladas y sus motivos.',
        },
        {
            id: 5,
            Icono: MessageCircle,
            titulo: 'Reclamos y consultas',
            descripcion: 'Realizá consultas o reclamos y seguí su estado.',
        },
    ];

    return (
        <section className="centro-actividad">
            <header className="centro-actividad__encabezado">
                <span className="centro-actividad__icono-principal">
                    <Layers size={34} />
                </span>

                <div>
                    <h2>Centro de actividad</h2>
                    <p>Gestioná tus reservas y consultas en un solo lugar.</p>
                </div>
            </header>

            <div className="centro-actividad__lista">
                {opciones.map(({ id, Icono, titulo, descripcion }) => (
                    <article
                        key={id}
                        className="centro-actividad__item"
                    >
                        <span className="centro-actividad__icono">
                            <Icono size={30} />
                        </span>

                        <div className="centro-actividad__datos">
                            <h3>{titulo}</h3>
                            <p>{descripcion}</p>
                        </div>

                        <ChevronRight
                            className="centro-actividad__flecha"
                            size={28}
                        />
                    </article>
                ))}
            </div>
        </section>
    );
}

export default ActividadReciente;