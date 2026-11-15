import logo from '../../assets/logoCompleto.png';
import styles from './Logo.module.css';

function Logo({ grande = false }) {
    return (
        <img
            src={logo}
            alt="Picado"
            className={`${styles.logo} ${grande ? styles.grande : ''}`}
        />
    );
}

export default Logo;