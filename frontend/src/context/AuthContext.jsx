import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/auth.service';
import { guardarToken, leerToken, borrarToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    // Si hay un token guardado, hay que preguntarle al back si sigue siendo válido
    const [verificando, setVerificando] = useState(() => Boolean(leerToken()));

    useEffect(() => {
        if (!leerToken()) return;

        authService.obtenerPerfil()
            .then(setUsuario)
            .catch(() => borrarToken())
            .finally(() => setVerificando(false));
    }, []);

    async function iniciarSesion(email, password) {
        const { token, usuario } = await authService.login(email, password);
        guardarToken(token);
        setUsuario(usuario);
        return usuario;
    }

    function cerrarSesion() {
        borrarToken();
        setUsuario(null);
    }

    const valor = { usuario, verificando, iniciarSesion, cerrarSesion };

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const contexto = useContext(AuthContext);
    if (!contexto) {
        throw new Error('useAuth tiene que usarse dentro de <AuthProvider>');
    }
    return contexto;
}