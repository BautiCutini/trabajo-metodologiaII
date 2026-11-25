import { useEffect, useState } from 'react';

// Lógica compartida de los listados del panel: búsqueda con espera,
// filtros, paginación, recarga y descarte de respuestas viejas.
// `listar` recibe { nombre, ...filtros, page, limit } y devuelve la respuesta paginada del back.
export function useListado(listar, { filtrosIniciales = {}, porPagina = 10 } = {}) {
    // Lo que se está escribiendo en el buscador
    const [busqueda, setBusqueda] = useState('');
    // Los filtros que realmente se mandan al back
    const [filtros, setFiltros] = useState({ nombre: '', ...filtrosIniciales });
    const [pagina, setPagina] = useState(1);
    // Se incrementa para volver a pedir la misma página, por ejemplo después de guardar
    const [recarga, setRecarga] = useState(0);
    // La última respuesta del back, junto con la consulta que la pidió
    const [respuesta, setRespuesta] = useState({
        consulta: null,
        data: [],
        total: 0,
        totalPages: 0,
        error: '',
    });

    // Identifica la consulta actual: si cambia un filtro o la página, es otra consulta
    const consulta = JSON.stringify({ filtros, pagina, recarga });
    // Está cargando mientras la respuesta que tenemos sea de una consulta anterior
    const cargando = respuesta.consulta !== consulta;

    // Busca 400 ms después de la última tecla, no en cada una
    useEffect(() => {
        const espera = setTimeout(() => {
            setFiltros((previos) => ({ ...previos, nombre: busqueda.trim() }));
            setPagina(1);
        }, 400);
        return () => clearTimeout(espera);
    }, [busqueda]);

    // Pide la página cada vez que cambia la consulta
    useEffect(() => {
        let vigente = true;
        const { filtros: filtrosConsulta, pagina: page } = JSON.parse(consulta);

        listar({ ...filtrosConsulta, page, limit: porPagina })
            .then((datos) => {
                if (vigente) setRespuesta({ consulta, ...datos, error: '' });
            })
            .catch((e) => {
                if (vigente) setRespuesta((previa) => ({ ...previa, consulta, error: e.message }));
            });

        // Si llega otra consulta antes de que responda esta, esta respuesta se descarta
        return () => {
            vigente = false;
        };
    }, [consulta, listar, porPagina]);

    // Para los <select> de filtros: usa el name del control como nombre del filtro
    function cambiarFiltro(evento) {
        const { name, value } = evento.target;
        setFiltros((previos) => ({ ...previos, [name]: value }));
        setPagina(1);
    }

    function recargar() {
        setRecarga((valor) => valor + 1);
    }

    const { data, total, totalPages, error } = respuesta;

    return {
        busqueda,
        setBusqueda,
        filtros,
        cambiarFiltro,
        pagina,
        setPagina,
        recargar,
        cargando,
        error,
        items: data,
        total,
        totalPages,
        desde: total === 0 ? 0 : (pagina - 1) * porPagina + 1,
        hasta: Math.min(pagina * porPagina, total),
    };
}