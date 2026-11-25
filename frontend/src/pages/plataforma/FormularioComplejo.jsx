import { useState } from 'react';
import { Building2, MapPin, Phone, Image, Navigation, AlertCircle } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { crearComplejo, actualizarComplejo } from '../../services/complejo.service';
import styles from './Formulario.module.css';

function datosIniciales(complejo) {
    const tieneUbicacion = complejo?.latitud != null && complejo?.longitud != null;
    return {
        nombre: complejo?.nombre ?? '',
        direccion: complejo?.direccion ?? '',
        telefono: complejo?.telefono ?? '',
        descripcion: complejo?.descripcion ?? '',
        imagen_url: complejo?.imagen_url ?? '',
        // Un solo campo, en el formato que copia Google Maps: "-38.7183, -62.2663"
        ubicacion: tieneUbicacion ? `${complejo.latitud}, ${complejo.longitud}` : '',
    };
}

// "-38.7183, -62.2663" → { latitud: -38.7183, longitud: -62.2663 }. Vacío → nulls. Inválido → null
function leerUbicacion(texto) {
    if (!texto.trim()) return { latitud: null, longitud: null };

    const partes = texto.split(',').map((parte) => Number(parte.trim()));
    if (partes.length !== 2 || partes.some(Number.isNaN)) return null;

    const [latitud, longitud] = partes;
    if (latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) return null;

    return { latitud, longitud };
}

function validar(datos) {
    const errores = {};

    if (!datos.nombre.trim()) errores.nombre = 'Ingresá el nombre del complejo.';
    if (!datos.direccion.trim()) errores.direccion = 'Ingresá la dirección.';
    if (!datos.telefono.trim()) errores.telefono = 'Ingresá un teléfono de contacto.';
    if (!datos.descripcion.trim()) errores.descripcion = 'Escribí una descripción breve.';

    if (leerUbicacion(datos.ubicacion) === null) {
        errores.ubicacion = 'Escribí latitud y longitud separadas por coma, por ejemplo: -38.7183, -62.2663';
    }

    return errores;
}

function FormularioComplejo({ complejo, onGuardado, onCancelar }) {
    const esAlta = !complejo;

    const [datos, setDatos] = useState(() => datosIniciales(complejo));
    const [errores, setErrores] = useState({});
    const [errorGeneral, setErrorGeneral] = useState('');
    const [guardando, setGuardando] = useState(false);

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

        const { latitud, longitud } = leerUbicacion(datos.ubicacion);
        const cuerpo = {
            nombre: datos.nombre.trim(),
            direccion: datos.direccion.trim(),
            telefono: datos.telefono.trim(),
            descripcion: datos.descripcion.trim(),
            imagen_url: datos.imagen_url.trim() || null,
            latitud,
            longitud,
        };

        setGuardando(true);
        try {
            if (esAlta) {
                await crearComplejo(cuerpo);
                onGuardado('Complejo creado.');
            } else {
                await actualizarComplejo(complejo.id, cuerpo);
                onGuardado('Cambios guardados.');
            }
        } catch (error) {
            setErrorGeneral(error.message);
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

            <Input
                etiqueta="Nombre"
                icono={<Building2 size={20} />}
                name="nombre"
                value={datos.nombre}
                onChange={manejarCambio}
                error={errores.nombre}
            />

            <div className={styles.fila}>
                <Input
                    etiqueta="Dirección"
                    icono={<MapPin size={20} />}
                    name="direccion"
                    value={datos.direccion}
                    onChange={manejarCambio}
                    error={errores.direccion}
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
            </div>

            <div className={styles.campo}>
                <label htmlFor="descripcion-complejo" className={styles.etiqueta}>Descripción</label>
                <textarea
                    id="descripcion-complejo"
                    name="descripcion"
                    className={`${styles.areaTexto} ${errores.descripcion ? styles.conError : ''}`}
                    value={datos.descripcion}
                    onChange={manejarCambio}
                    aria-invalid={Boolean(errores.descripcion)}
                />
                {errores.descripcion && <p className={styles.error}>{errores.descripcion}</p>}
            </div>

            <Input
                etiqueta="Ubicación en el mapa (opcional)"
                icono={<Navigation size={20} />}
                name="ubicacion"
                placeholder="-38.7183, -62.2663"
                value={datos.ubicacion}
                onChange={manejarCambio}
                error={errores.ubicacion}
                ayuda="En Google Maps, clic derecho sobre el complejo y copiá los dos números."
            />

            <Input
                etiqueta="Foto (opcional)"
                icono={<Image size={20} />}
                type="url"
                name="imagen_url"
                placeholder="https://…"
                value={datos.imagen_url}
                onChange={manejarCambio}
            />

            <div className={styles.acciones}>
                <Button variante="secundario" onClick={onCancelar} disabled={guardando}>
                    Cancelar
                </Button>
                <Button type="submit" cargando={guardando}>
                    {esAlta ? 'Crear complejo' : 'Guardar cambios'}
                </Button>
            </div>
        </form>
    );
}

export default FormularioComplejo;