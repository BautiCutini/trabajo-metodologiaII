import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { rutaSegunRol } from '../../utils/rutaSegunRol';
import styles from './Auth.module.css';

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validar({ email, password }) {
    const errores = {};

    if (!email.trim()) {
        errores.email = 'Ingresá tu correo electrónico.';
    } else if (!EMAIL_VALIDO.test(email.trim())) {
        errores.email = 'Ingresá un correo válido.';
    }

    if (!password) {
        errores.password = 'Ingresá tu contraseña.';
    }

    return errores;
}

function mensajeDeError(error) {
    if (error.status === 401) return 'El correo o la contraseña son incorrectos.';
    return error.message;
}

function Login() {
    const { usuario, verificando, iniciarSesion } = useAuth();

    const [datos, setDatos] = useState({ email: '', password: '' });
    const [errores, setErrores] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');
    const [cargando, setCargando] = useState(false);

    // Si ya hay sesión (recién logueado o entró a /login estando logueado), se va a su inicio
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

        setCargando(true);
        try {
            await iniciarSesion(datos.email.trim(), datos.password);
            // No hace falta redirigir acá: al cambiar el usuario, el <Navigate> de arriba lo hace
        } catch (error) {
            setErrorGeneral(mensajeDeError(error));
        } finally {
            setCargando(false);
        }
    }

    return (
        <AuthLayout
            titulo="Iniciar sesión"
            subtitulo="Accedé a tu cuenta y reservá tu próxima cancha."
        >
            <form className={styles.formulario} onSubmit={manejarEnvio} noValidate>
                {errorGeneral && (
                    <div className={styles.alerta} role="alert">
                        <AlertCircle size={18} aria-hidden="true" />
                        <span>{errorGeneral}</span>
                    </div>
                )}

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
                    etiqueta="Contraseña"
                    icono={<Lock size={20} />}
                    type="password"
                    name="password"
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                    value={datos.password}
                    onChange={manejarCambio}
                    error={errores.password}
                />

                <Button
                    type="submit"
                    anchoCompleto
                    cargando={cargando}
                    iconoDerecha={<ArrowRight size={20} />}
                >
                    Iniciar sesión
                </Button>
            </form>

            <p className={styles.pie}>
                ¿No tenés cuenta?{' '}
                <Link to="/registro" className={styles.enlace}>
                    Crear una cuenta
                </Link>
            </p>
        </AuthLayout>
    );
}

export default Login;