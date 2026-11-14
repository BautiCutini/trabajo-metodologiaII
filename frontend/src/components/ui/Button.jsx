import styles from './Button.module.css';

function Button({
    children,
    variante = 'primario',
    type = 'button',
    iconoIzquierda,
    iconoDerecha,
    cargando = false,
    anchoCompleto = false,
    disabled = false,
    ...resto
}) {
    const clases = [
        styles.boton,
        styles[variante],
        anchoCompleto ? styles.anchoCompleto : '',
    ].join(' ');

    return (
        <button
            type={type}
            className={clases}
            disabled={disabled || cargando}
            aria-busy={cargando}
            {...resto}
        >
            {cargando ? <span className={styles.spinner} aria-hidden="true" /> : iconoIzquierda}
            <span>{children}</span>
            {!cargando && iconoDerecha}
        </button>
    );
}

export default Button;