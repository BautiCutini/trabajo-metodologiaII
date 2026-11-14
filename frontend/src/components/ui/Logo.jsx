import styles from './Logo.module.css';

// Provisorio: cuando tengamos el SVG del logo, se reemplaza solo este componente.
function Logo({ grande = false }) {
    return (
        <span className={`${styles.logo} ${grande ? styles.grande : ''}`}>
            Picado
        </span>
    );
}

export default Logo;