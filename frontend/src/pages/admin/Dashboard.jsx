import { useAuth } from '../../context/AuthContext';
import LayoutAdmin from '../../components/admin/LayoutAdmin';

function Dashboard() {
    const { usuario } = useAuth();

    return (
        <LayoutAdmin
            titulo={`Hola, ${usuario.nombre}`}
            subtitulo="Resumen de tu complejo"
        >
            <p>Acá van a ir las métricas del día.</p>
        </LayoutAdmin>
    );
}

export default Dashboard;