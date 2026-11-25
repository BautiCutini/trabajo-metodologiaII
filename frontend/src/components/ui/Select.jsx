import { useId } from 'react';
import styles from './Select.module.css';

// Lista desplegable con el mismo aspecto que Input
function Select({ etiqueta, error, ayuda, id, children, ...resto }) {
    const idGenerado = useId();
    const idSelect = id || idGenerado;
    const idMensaje = `${idSelect}-mensaje`;
    const mensaje = error || ayuda;

    return (
        <div className={styles.campo}>
            {etiqueta && (
                <label htmlFor={idSelect} className={styles.etiqueta}>
                    {etiqueta}
                </label>
            )}

            <select
                id={idSelect}
                className={`${styles.select} ${error ? styles.conError : ''}`}
                aria-invalid={Boolean(error)}
                aria-describedby={mensaje ? idMensaje : undefined}
                {...resto}
            >
                {children}
            </select>

            {mensaje && (
                <p id={idMensaje} className={error ? styles.error : styles.ayuda}>
                    {mensaje}
                </p>
            )}
        </div>
    );
}

export default Select;