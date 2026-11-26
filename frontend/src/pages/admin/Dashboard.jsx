
import { Link } from 'react-router-dom';
import {
    CalendarDays,
    Users,
    ArrowUpRight,
    Clock3,
    Building2,
    Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LayoutAdmin from '../../components/admin/LayoutAdmin';
import './GestionAdmin.css';

function Dashboard() {
    const { usuario } = useAuth();
    const esDueno = usuario?.rol === 'ADMIN_COMPLEJO';
    const nombre = usuario?.nombre || 'Usuario';

    return (
        <LayoutAdmin
            titulo={`¡Hola, ${nombre}!`}
            subtitulo="Gestioná tu complejo deportivo desde un solo lugar."
        >
            <section className="dashboard-hero">
                <div className="dashboard-hero__contenido">
                    <div className="dashboard-hero__etiqueta">
                        <Sparkles size={15} />
                        <span>BIENVENIDO A PICADO</span>
                    </div>

                    <h2>
                        {esDueno
                            ? 'Tu complejo funciona mejor cuando tenés todo organizado.'
                            : 'Organizá tus horarios. Simplificá tu gestión.'}
                    </h2>

                    <p>
                        {esDueno
                            ? 'Administrá tus canchas, coordiná a tu equipo y mantené todo bajo control.'
                            : 'Accedé rápidamente a los horarios y mantené actualizada la disponibilidad de las canchas.'}
                    </p>

                    <Link
                        to="/admin/horarios"
                        className="dashboard-hero__boton"
                    >
                        Ir a horarios
                        <ArrowUpRight size={18} />
                    </Link>
                </div>

                <div className="dashboard-hero__decoracion">
                    <div className="dashboard-hero__circulo">
                        <Building2 size={76} strokeWidth={1.3} />
                    </div>
                    <span className="dashboard-hero__detalle">PICADO</span>
                </div>
            </section>

            <section className="dashboard-seccion">
                <div className="dashboard-seccion__encabezado">
                    <div>
                        <span className="dashboard-seccion__eyebrow">
                            TU ESPACIO DE TRABAJO
                        </span>
                        <h2>¿Qué necesitás gestionar?</h2>
                    </div>
                    <p>Accesos directos</p>
                </div>

                <div className="dashboard-grid">
                    <Link
                        to="/admin/horarios"
                        className="dashboard-card"
                    >
                        <div className="dashboard-card__top">
                            <div className="dashboard-card__icono dashboard-card__icono--horarios">
                                <CalendarDays size={27} />
                            </div>
                            <ArrowUpRight
                                className="dashboard-card__flecha"
                                size={21}
                            />
                        </div>

                        <span className="dashboard-card__categoria">
                            DISPONIBILIDAD
                        </span>

                        <h3>Gestión de horarios</h3>

                        <p>
                            Consultá los horarios de tus canchas y administrá
                            su disponibilidad cuando lo necesites.
                        </p>

                        <div className="dashboard-card__pie">
                            <span>Ingresar a la sección</span>
                            <span>01</span>
                        </div>
                    </Link>

                    {esDueno && (
                        <Link
                            to="/admin/empleados"
                            className="dashboard-card"
                        >
                            <div className="dashboard-card__top">
                                <div className="dashboard-card__icono dashboard-card__icono--gerentes">
                                    <Users size={27} />
                                </div>
                                <ArrowUpRight
                                    className="dashboard-card__flecha"
                                    size={21}
                                />
                            </div>

                            <span className="dashboard-card__categoria">
                                EQUIPO DE TRABAJO
                            </span>

                            <h3>Gestión de gerentes</h3>

                            <p>
                                Administrá los encargados de tu complejo,
                                incorporá personal y gestioná sus accesos.
                            </p>

                            <div className="dashboard-card__pie">
                                <span>Ingresar a la sección</span>
                                <span>02</span>
                            </div>
                        </Link>
                    )}
                </div>
            </section>

            <section className="dashboard-info">
                <div className="dashboard-info__icono">
                    <Clock3 size={23} />
                </div>
                <div>
                    <h3>Tu gestión, más simple</h3>
                    <p>
                        Desde este panel podés acceder a las herramientas
                        necesarias para administrar tu complejo.
                    </p>
                </div>
            </section>
        </LayoutAdmin>
    );
}

export default Dashboard;
