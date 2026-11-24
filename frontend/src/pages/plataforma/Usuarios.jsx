import styles from './Usuarios.module.css';

function Usuarios() {
    return (
        <section className={styles.pagina}>
            <header className={styles.encabezado}>
                <h1 className={styles.titulo}>Usuarios</h1>
                <p className={styles.subtitulo}>
                    Gestioná las cuentas de jugadores, encargados y administradores.
                </p>
            </header>
        </section>
    );
}

export default Usuarios;