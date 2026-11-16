// Acepta "HH:MM" o "HH:MM:SS", de 00:00 a 24:00, y devuelve "HH:MM:00".
// Devuelve null si el formato es inválido.
const REGEX_HORA = /^(?:([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?|24:00(?::00)?)$/;

function normalizarHora(valor) {
    if (typeof valor !== 'string' || !REGEX_HORA.test(valor)) {
        return null;
    }
    const [horas, minutos] = valor.split(':');
    return `${horas}:${minutos}:00`;
}

// "18:30:00" → 1110
function aMinutos(hora) {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
}

// 1110 → "18:30:00"; 1440 → "24:00:00"
function aHora(minutos) {
    const horas = String(Math.floor(minutos / 60)).padStart(2, '0');
    const resto = String(minutos % 60).padStart(2, '0');
    return `${horas}:${resto}:00`;
}

module.exports = { normalizarHora, aMinutos, aHora };