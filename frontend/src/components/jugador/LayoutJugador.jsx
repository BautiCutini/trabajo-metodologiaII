import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import './LayoutJugador.css';


function LayoutJugador({ children }) {
    return (
        <div className="layout-jugador">
            <Sidebar />

            <main className="layout-jugador__contenido">
                {/* El logo de la barra lateral no se ve en móvil, así que se repite acá */}
                <div className="sidebar__logo layout-jugador__marca">
                    <h2>Picado<span>⚽</span></h2>
                </div>

                {children}
            </main>

            <BottomNav />
        </div>
    );
}

export default LayoutJugador;