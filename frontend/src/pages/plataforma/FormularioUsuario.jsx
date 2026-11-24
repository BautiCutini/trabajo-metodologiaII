import { useState } from 'react';
import { Mail, Lock, Phone, User, AlertCircle } from 'lucide-react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { crearUsuario, actualizarUsuario } from '../../services/usuario.service';
import { NOMBRE_ROL, ROLES, ROLES_CON_COMPLEJO } from '../../utils/roles';
import styles from './Formulario.module.css';

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function datosIniciales(usuario) {
    return {
        nombre: usuario?.nombre ?? '',
        apellido: usuario?.apellido ?? '',
        email: usuario?.email ?? '',
        telefono: usuario?.telefono ?? '',
        rol: usuario?.rol ?? 'JUGADOR',
        complejo_id: usuario?.complejo_id ? String(usuario.complejo_id) : '',
        password: '',
    };
}

function validar(datos, esAlta) {
    const errores = {};

    if (!datos.nombre.trim()) errores.nombre = 'Ingresá el nombre.';
    if (!datos.apellido.trim()) errores.apellido = 'Ingresá el apellido.';

    if (!datos.email.trim()) {
        errores.email = 'Ingresá el correo electrónico.';
    } else if (!EMAIL_VALIDO.test(datos.email.trim())) {
        errores.email = 'Ingresá un correo válido.';
    }

    if (!datos.telefono.trim()) errores.telefono = 'Ingresá el teléfono.';

    if (ROLES_CON_COMPLEJO.includes(datos.rol) && !datos.complejo_id) {
        errores.complejo_id = 'Este rol tiene que pertenecer a un complejo.';
    }

    // En el alta la contraseña es obligatoria; al editar, vacía significa "no cambiarla"
    if (esAlta && !datos.password) {
        errores.password = 'Definí una contraseña inicial.';
    } else if (datos.password && datos.password.length < 8) {
        errores.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    return errores;
}

function FormularioUsuario({ usuario, esUnoMismo, complejos, onGuardado, onCancelar }) {
    const esAlta = !usuario;

    const [datos, setDatos] = useState(() => datosIniciales(usuario));
    const [errores, setErrores] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');
    const [guardando, setGuardando] = useState(false);

    const requiereComplejo = ROLES_CON_COMPLEJO.includes(datos.rol);

    function manejarCambio(evento) {
        const { name, value } = evento.target;
        setDatos((previos) => {
            const nuevos = { ...previos, [name]: value };
            // Si el rol nuevo no lleva complejo, se borra el que estaba elegido
            if (name === 'rol' && !ROLES_CON_COMPLEJO.includes(value)) {
                nuevos.complejo_id = '';
            }
            return nuevos;
        });
        setErrores((previos) => ({ ...previos, [name]: undefined }));
        setErrorGeneral('');
    }

    async function manejarEnvio(evento) {
        evento.preventDefault();

        const nuevosErrores = validar(datos, esAlta);
        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length > 0) return;

        const cuerpo = {
            nombre: datos.nombre.trim(),
            apellido: datos.apellido.trim(),
            email: datos.email.trim(),
            telefono: datos.telefono.trim(),
            complejo_id: requiereComplejo ? Number(datos.complejo_id) : null,
        };
        // El back no deja cambiarse el propio rol: en ese caso ni se manda
        if (!esUnoMismo) cuerpo.rol = datos.rol;
        if (datos.password) cuerpo.password = datos.password;

        setGuardando(true);
        try {
            if (esAlta) {
                await crearUsuario(cuerpo);
                onGuardado('Usuario creado.');
            } else {
                await actualizarUsuario(usuario.id, cuerpo);
                onGuardado('Cambios guardados.');
            }
        } catch (error) {
            if (error.status === 409) {
                setErrores({ email: 'Ya existe una cuenta con ese correo.' });
            } else {
                setErrorGeneral(error.message);
            }
        } finally {
            setGuardando(false);
        }
    }

    return (
        <form className={styles.formulario} onSubmit={manejarEnvio} noValidate>
            {errorGeneral && (
                <div className={styles.alerta} role="alert">
                    <AlertCircle size={18} aria-hidden="true" />
                    <span>{errorGeneral}</span>
                </div>
            )}

            <div className={styles.fila}>
                <Input
                    etiqueta="Nombre"
                    icono={<User size={20} />}
                    name="nombre"
                    value={datos.nombre}
                    onChange={manejarCambio}
                    error={errores.nombre}
                />
                <Input
                    etiqueta="Apellido"
                    name="apellido"
                    value={datos.apellido}
                    onChange={manejarCambio}
                    error={errores.apellido}
                />
            </div>

            <Input
                etiqueta="Correo electrónico"
                icono={<Mail size={20} />}
                type="email"
                name="email"
                autoComplete="off"
                value={datos.email}
                onChange={manejarCambio}
                error={errores.email}
            />

            <Input
                etiqueta="Teléfono"
                icono={<Phone size={20} />}
                type="tel"
                name="telefono"
                value={datos.telefono}
                onChange={manejarCambio}
                error={errores.telefono}
            />

            <Select
                etiqueta="Rol"
                name="rol"
                value={datos.rol}
                onChange={manejarCambio}
                disabled={esUnoMismo}
                ayuda={esUnoMismo ? 'No podés cambiar tu propio rol.' : undefined}
            >
                {ROLES.map((rol) => (
                    <option key={rol} value={rol}>{NOMBRE_ROL[rol]}</option>
                ))}
            </Select>

            {requiereComplejo && (
                <Select
                    etiqueta="Complejo"
                    name="complejo_id"
                    value={datos.complejo_id}
                    onChange={manejarCambio}
                    error={errores.complejo_id}
                    ayuda={complejos.length === 0 ? 'No hay complejos activos para asignar.' : undefined}
                >
                    <option value="">Elegí un complejo</option>
                    {complejos.map((complejo) => (
                        <option key={complejo.id} value={complejo.id}>{complejo.nombre}</option>
                    ))}
                </Select>
            )}

            <Input
                etiqueta={esAlta ? 'Contraseña inicial' : 'Nueva contraseña'}
                icono={<Lock size={20} />}
                type="password"
                name="password"
                autoComplete="new-password"
                value={datos.password}
                onChange={manejarCambio}
                error={errores.password}
                ayuda={esAlta ? 'Mínimo 8 caracteres.' : 'Dejala vacía para no cambiarla.'}
            />

            <div className={styles.acciones}>
                <Button variante="secundario" onClick={onCancelar} disabled={guardando}>
                    Cancelar
                </Button>
                <Button type="submit" cargando={guardando}>
                    {esAlta ? 'Crear usuario' : 'Guardar cambios'}
                </Button>
            </div>
        </form>
    );
}

export default FormularioUsuario;