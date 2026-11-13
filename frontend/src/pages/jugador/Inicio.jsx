import './Inicio.css';

import Sidebar from '../../components/jugador/Sidebar';
import BottomNav from '../../components/jugador/BottomNav';
import AccesosRapidos from '../../components/jugador/AccesosRapidos';
import ProximaReserva from '../../components/jugador/ProximaReserva';
import CanchaCard from '../../components/jugador/CanchaCard';
import ActividadReciente from '../../components/jugador/ActividadReciente';

function Inicio() {
    return (
        <div className="inicio-layout">
            <Sidebar />
            
            <main className="inicio">
                <header className="inicio__header">
                    <div>
                        <h1>Hola, Jugador 👋</h1>
                        <p>¿Listo para jugar?</p>
                    </div>
                    
                    <button className="inicio__perfil" aria-label="Mi perfil">
                        <span>👤</span>
                        </button>
                </header>
                
                <AccesosRapidos />
                
                <section className="inicio__contenido">
                        <div className="inicio__principal">
                        <ProximaReserva />
                        
                        <section className="inicio__recomendadas">
                            <h2>Canchas recomendadas</h2>
                            
                            <div className="inicio__grid-canchas">
                                <CanchaCard />
                                <CanchaCard />
                                <CanchaCard />
                            </div>
                        </section>
                    </div>
                    
                    <aside className="inicio__lateral">
                        <ActividadReciente />
                    </aside>
                </section>
            </main>
            
            <BottomNav />
        </div>
    );
}

export default Inicio;