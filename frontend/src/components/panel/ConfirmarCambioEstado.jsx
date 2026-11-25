import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import styles from './ConfirmarCambioEstado.module.css';

// Confirmación antes de dar de baja o reactivar algo (un usuario, un complejo…).
// Quien la usa decide qué texto mostrar y qué pedido hacer al back en cada caso.
function ConfirmarCambioEstado({
    nombre,
    activo,
    consecuenciaBaja,
    consecuenciaReactivacion,
    darDeBaja,
    reactivar,
    onConfirmado,
    onCancelar,
}) {
    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState('');

    async function confirmar() {
        setProcesando(true);
        setError('');
        try {
            if (activo) {
                await darDeBaja();
                onConfirmado(`${nombre} fue dado de baja.`);
            } else {
                await reactivar();
                onConfirmado(`${nombre} fue reactivado.`);
            }
        } catch (e) {
            setError(e.message);
            setProcesando(false);
        }
    }

    return (
        <div className={styles.confirmacion}>
            <p className={styles.texto}>
                <strong>{nombre}</strong> {activo ? consecuenciaBaja : consecuenciaReactivacion}
            </p>

            {error && (
                <div className={styles.alerta} role="alert">
                    <AlertCircle size={18} aria-hidden="true" />
                    <span>{error}</span>
                </div>
            )}

            <div className={styles.acciones}>
                <Button variante="secundario" onClick={onCancelar} disabled={procesando}>
                    Cancelar
                </Button>
                <Button
                    variante={activo ? 'peligro' : 'primario'}
                    cargando={procesando}
                    onClick={confirmar}
                >
                    {activo ? 'Dar de baja' : 'Reactivar'}
                </Button>
            </div>
        </div>
    );
}

export default ConfirmarCambioEstado;