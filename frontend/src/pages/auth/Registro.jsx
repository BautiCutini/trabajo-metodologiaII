import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Mail, Lock, Phone, User, ArrowRight, AlertCircle } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { registrar } from '../../services/auth.service';
import { rutaSegunRol } from '../../utils/rutaSegunRol';
import styles from './Auth.module.css';

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DATOS_INICIALES = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmarPassword: '',
};

function validar(datos) {
    const errores = {};

    if (!datos.nombre.trim()) errores.nombre = 'Ingresá tu nombre.';
    if (!datos.apellido.trim()) errores.apellido = 'Ingresá tu apellido.';

    if (!datos.email.trim()) {
        errores.email = 'Ingresá tu correo electrónico.';
    } else if (!EMAIL_VALIDO.test(datos.email.trim())) {
        errores.email = 'Ingresá un correo válido.';
    }

    const digitosTelefono = datos.telefono.replace(/\D/g, '');
    if (!datos.telefono.trim()) {
        errores.telefono = 'Ingresá tu teléfono.';
    } else if (digitosTelefono.length < 8 || digitosTelefono.length > 15) {
        errores.telefono = 'Ingresá un teléfono válido, con característica.';
    }

    if (!datos.password) {
        errores.password = 'Creá una contraseña.';
    } else if (datos.password.length < 8) {
        errores.password = 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (!datos.confirmarPassword) {
        errores.confirmarPassword = 'Repetí la contraseña.';
    } else if (datos.confirmarPassword !== datos.password) {
        errores.confirmarPassword = 'Las contraseñas no coinciden.';
    }

    return errores;
}

function Registro() {
    const { usuario, verificando, iniciarSesion } = useAuth();

    const [datos, setDatos] = useState(DATOS_INICIALES);
    const [errores, setErrores] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');
    const [cargando, setCargando] = useState(false);

    if (usuario) {
        return <Navigate to={rutaSegunRol(usuario.rol)} replace />;
    }

    if (verificando) return null;

    function manejarCambio(evento) {
        const { name, value } = evento.target;
        setDatos((previos) => ({ ...previos, [name]: value }));
        setErrores((previos) => ({ ...previos, [name]: undefined }));
        setErrorGeneral('');
    }

    async function manejarEnvio(evento) {
        evento.preventDefault();

        const nuevosErrores = validar(datos);
        setErrores(nuevosErrores);
        if (Object.keys(nuevosErrores).length > 0) return;

        const email = datos.email.trim();

        setCargando(true);
        try {
            await registrar({
                nombre: datos.nombre.trim(),
                apellido: datos.apellido.trim(),
                email,
                telefono: datos.telefono.trim(),
                password: datos.password,
            });

            // Recién registrado: entra directo, sin pasar otra vez por el login
            await iniciarSesion(email, datos.password);
        } catch (error) {
            if (error.status === 409) {
                setErrores({ email: 'Ya existe una cuenta con ese correo.' });
            } else {
                setErrorGeneral(error.message);
            }
        } finally {
            setCargando(false);
        }
    }

    return (
        <AuthLayout
            titulo="Crear cuenta"
            subtitulo="Registrate gratis y reservá tu primera cancha."
        >
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
                        placeholder="Juan"
                        autoComplete="given-name"
                        value={datos.nombre}
                        onChange={manejarCambio}
                        error={errores.nombre}
                    />

                    <Input
                        etiqueta="Apellido"
                        name="apellido"
                        placeholder="Pérez"
                        autoComplete="family-name"
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
                    placeholder="tu@email.com"
                    autoComplete="email"
                    value={datos.email}
                    onChange={manejarCambio}
                    error={errores.email}
                />

                <Input
                    etiqueta="Teléfono"
                    icono={<Phone size={20} />}
                    type="tel"
                    name="telefono"
                    placeholder="291 123 4567"
                    autoComplete="tel"
                    value={datos.telefono}
                    onChange={manejarCambio}
                    error={errores.telefono}
                    ayuda="Lo usa el complejo si necesita contactarte."
                />

                <Input
                    etiqueta="Contraseña"
                    icono={<Lock size={20} />}
                    type="password"
                    name="password"
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    value={datos.password}
                    onChange={manejarCambio}
                    error={errores.password}
                />

                <Input
                    etiqueta="Repetir contraseña"
                    icono={<Lock size={20} />}
                    type="password"
                    name="confirmarPassword"
                    placeholder="Repetí la contraseña"
                    autoComplete="new-password"
                    value={datos.confirmarPassword}
                    onChange={manejarCambio}
                    error={errores.confirmarPassword}
                />

                <Button
                    type="submit"
                    anchoCompleto
                    cargando={cargando}
                    iconoDerecha={<ArrowRight size={20} />}
                >
                    Crear cuenta
                </Button>
            </form>

            <p className={styles.pie}>
                ¿Ya tenés cuenta?{' '}
                <Link to="/login" className={styles.enlace}>
                    Iniciá sesión
                </Link>
            </p>
        </AuthLayout>
    );
}

export default Registro;