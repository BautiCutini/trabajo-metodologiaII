import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

// Ventana emergente basada en <dialog>: el navegador ya resuelve el foco,
// el fondo oscuro y el cierre con Escape.
function Modal({ abierto, titulo, onCerrar, children }) {
    const dialogo = useRef(null);
    const idTitulo = useId();

    useEffect(() => {
        const elemento = dialogo.current;
        if (abierto && !elemento.open) elemento.showModal();
        if (!abierto && elemento.open) elemento.close();
    }, [abierto]);

    // Escape: en vez de que el navegador lo cierre solo, avisamos al componente padre
    function alCancelar(evento) {
        evento.preventDefault();
        onCerrar();
    }

    // Un clic en el fondo oscuro cae sobre el propio <dialog>, no sobre su contenido
    function alHacerClic(evento) {
        if (evento.target === dialogo.current) onCerrar();
    }

    return (
        <dialog
            ref={dialogo}
            className={styles.modal}
            aria-labelledby={idTitulo}
            onCancel={alCancelar}
            onClick={alHacerClic}
        >
            <div className={styles.contenido}>
                <header className={styles.encabezado}>
                    <h2 id={idTitulo} className={styles.titulo}>{titulo}</h2>
                    <button type="button" className={styles.cerrar} onClick={onCerrar} aria-label="Cerrar">
                        <X size={20} />
                    </button>
                </header>

                {/* El contenido se monta al abrir: así cada apertura arranca de cero */}
                {abierto && children}
            </div>
        </dialog>
    );
}

export default Modal;