import { UserRound, ArrowRight, Lightbulb, CalendarCheck } from 'lucide-react';
import './inicio.css';

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
                    
                    <button
                        className="inicio__perfil"
                        aria-label="Mi perfil"
                    >
                        <UserRound size={24} />
                    </button>
                </header>
                
                <AccesosRapidos />
                
                <section className="inicio__contenido">
                
                    <div className="inicio__principal">
                        <ProximaReserva />
                        
                        <section className="inicio__recomendadas">
                            <div className="inicio__titulo-seccion">
                                <h2>Canchas recomendadas</h2>
                                <a href="/complejos">
                                    Ver más <ArrowRight size={17} />
                                </a>
                            </div>
                            
                            <div className="inicio__grid-canchas">
                                <CanchaCard />
                                <CanchaCard />
                                <CanchaCard />
                            </div>
                        </section>
                    </div>
                    
                    <section className="inicio__promocional">
                        <div className="inicio__promo-texto">
                            <h2>
                                Encontrá, reservá
                                <br />
                                y <span>jugá</span>
                            </h2>
                            
                            <p>
                                Canchas, complejos y tus reservas
                                en un solo lugar.
                            </p>
                        </div>
                    </section>
                    
                    <aside className="inicio__lateral">
                        <ActividadReciente />
                        
                        <section className="inicio__tip">
                            <div className="inicio__tip-titulo">
                                <Lightbulb size={25} />
                                <h3>Tip de Picado</h3>
                            </div>
                            
                            <p>
                                Podés buscar complejos por fecha
                                y horario para ver disponibilidad
                                al instante.
                            </p>
                            
                            
                        </section>
                    </aside>
                    
                </section>
            </main>
            
            <BottomNav />
        </div>
    );
}

export default Inicio;
