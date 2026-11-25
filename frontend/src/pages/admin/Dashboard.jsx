
import { Link } from 'react-router-dom';
import { CalendarDays, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LayoutAdmin from '../../components/admin/LayoutAdmin';
import './GestionAdmin.css';

function Dashboard() {
    const { usuario } = useAuth();
    const esDueno = usuario.rol === 'ADMIN_COMPLEJO';

    return (
        <LayoutAdmin
            titulo={`Hola, ${usuario.nombre}`}
            subtitulo={esDueno ? 'Administrá tu complejo deportivo' : 'Gestioná los horarios de tu complejo'}
        >
            <section className="admin-resumen">
                <article className="admin-acceso">
                    <div className="admin-acceso__icono"><CalendarDays size={24} /></div>
                    <div className="admin-acceso__contenido">
                        <h2>Gestión de horarios</h2>
                        <p>Consultá los horarios de tus canchas y dales de baja cuando sea necesario.</p>
                        <Link to="/admin/horarios">Ver horarios <ArrowRight size={16} /></Link>
                    </div>
                </article>

                {esDueno && (
                    <article className="admin-acceso">
                        <div className="admin-acceso__icono"><Users size={24} /></div>
                        <div className="admin-acceso__contenido">
                            <h2>Gestión de gerentes</h2>
                            <p>Consultá el personal del complejo, agregá gerentes o dales de baja.</p>
                            <Link to="/admin/empleados">Administrar gerentes <ArrowRight size={16} /></Link>
                        </div>
                    </article>
                )}
            </section>
        </LayoutAdmin>
    );
}

export default Dashboard;
