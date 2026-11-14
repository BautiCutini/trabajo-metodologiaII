import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.css';

function Input({ etiqueta, icono, error, ayuda, type = 'text', id, ...resto }) {
    const idGenerado = useId();
    const idInput = id || idGenerado;
    const idMensaje = `${idInput}-mensaje`;

    const [mostrarPassword, setMostrarPassword] = useState(false);

    const esPassword = type === 'password';
    const tipoReal = esPassword && mostrarPassword ? 'text' : type;
    const mensaje = error || ayuda;

    return (
        <div className={styles.campo}>
            {etiqueta && (
                <label htmlFor={idInput} className={styles.etiqueta}>
                    {etiqueta}
                </label>
            )}

            <div className={`${styles.contenedor} ${error ? styles.conError : ''}`}>
                {icono && (
                    <span className={styles.icono} aria-hidden="true">
                        {icono}
                    </span>
                )}

                <input
                    id={idInput}
                    type={tipoReal}
                    className={styles.input}
                    aria-invalid={Boolean(error)}
                    aria-describedby={mensaje ? idMensaje : undefined}
                    {...resto}
                />

                {esPassword && (
                    <button
                        type="button"
                        className={styles.botonOjo}
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                        aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>

            {mensaje && (
                <p id={idMensaje} className={error ? styles.error : styles.ayuda}>
                    {mensaje}
                </p>
            )}
        </div>
    );
}

export default Input;