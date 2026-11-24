import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { darDeBajaUsuario, actualizarUsuario } from '../../services/usuario.service';
import styles from './ConfirmarCambioEstado.module.css';

// Confirmación antes de dar de baja o reactivar una cuenta
function ConfirmarCambioEstado({ usuario, onConfirmado, onCancelar }) {
    const esBaja = usuario.estado === 'ACTIVO';
    const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`;

    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState('');

    async function confirmar() {
        setProcesando(true);
        setError('');
        try {
            if (esBaja) {
                await darDeBajaUsuario(usuario.id);
                onConfirmado(`${nombreCompleto} fue dado de baja.`);
            } else {
                await actualizarUsuario(usuario.id, { estado: 'ACTIVO' });
                onConfirmado(`${nombreCompleto} fue reactivado.`);
            }
        } catch (e) {
            setError(e.message);
            setProcesando(false);
        }
    }

    return (
        <div className={styles.confirmacion}>
            {esBaja ? (
                <p className={styles.texto}>
                    <strong>{nombreCompleto}</strong> no va a poder iniciar sesión.
                    Sus reservas y su historial se conservan, y la cuenta se puede reactivar cuando quieras.
                </p>
            ) : (
                <p className={styles.texto}>
                    <strong>{nombreCompleto}</strong> va a poder volver a iniciar sesión con su contraseña de siempre.
                </p>
            )}

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
                    variante={esBaja ? 'peligro' : 'primario'}
                    cargando={procesando}
                    onClick={confirmar}
                >
                    {esBaja ? 'Dar de baja' : 'Reactivar'}
                </Button>
            </div>
        </div>
    );
}

export default ConfirmarCambioEstado;