import { CalendarCheck, MapPin, Users } from 'lucide-react';
import Logo from '../ui/Logo';
import styles from './AuthLayout.module.css';

const BENEFICIOS = [
    { icono: CalendarCheck, texto: 'Reservas rápidas' },
    { icono: MapPin, texto: 'Complejos de tu ciudad' },
    { icono: Users, texto: 'Organizá tus partidos' },
];

function AuthLayout({ titulo, subtitulo, children }) {
    return (
        <div className={styles.pantalla}>
            <section className={styles.hero}>
                <Logo grande />

                <span className={styles.chip}>Reserva de canchas</span>

                <h1 className={styles.titulo}>
                    Jugá cuando quieras, <span className={styles.resaltado}>donde quieras</span>
                </h1>

                <p className={styles.bajada}>
                    Encontrá complejos, revisá disponibilidad y reservá tu cancha en segundos.
                </p>

                <ul className={styles.beneficios}>
                    {BENEFICIOS.map(({ icono: Icono, texto }) => (
                        <li key={texto} className={styles.beneficio}>
                            <Icono size={28} aria-hidden="true" />
                            <span>{texto}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <main className={styles.panel}>
                <header className={styles.encabezado}>
                    <Logo grande />
                    <h2 className={styles.tituloPanel}>{titulo}</h2>
                    {subtitulo && <p className={styles.subtitulo}>{subtitulo}</p>}
                </header>

                {children}
            </main>
        </div>
    );
}

export default AuthLayout;