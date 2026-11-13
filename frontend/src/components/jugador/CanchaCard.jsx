import { Link } from 'react-router-dom';

function CanchaCard() {
    const cancha = {
        nombre: 'Complejo Deportivo Norte',
        ubicacion: 'Bahía Blanca, Buenos Aires',
        tipo: 'Fútbol 5',
        precio: '$ 15.000 / hora',
        imagen: '/images/complejo-norte.jpg',
    };
    
    return (
        <article className="cancha-card">
                <div className="cancha-card__imagen-contenedor">
                    <img
                        className="cancha-card__imagen"
                        src={cancha.imagen}
                        alt={`Cancha de ${cancha.nombre}`}
                    />
                    
                    <span className="cancha-card__tipo">{cancha.tipo}</span>
                </div>
                
                <div className="cancha-card__contenido">
                    <h3>{cancha.nombre}</h3>
                        <p className="cancha-card__ubicacion">
                        📍 {cancha.ubicacion}
                        </p>
                    
                    <div className="cancha-card__pie">
                        <span className="cancha-card__precio">
                            {cancha.precio}
                        </span>
                        
                        <Link to="/complejos" className="cancha-card__boton">
                            Ver más →
                        </Link>
                    </div>
                </div>
        </article>
    );
}

export default CanchaCard;