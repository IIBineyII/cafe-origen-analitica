// Los tiempos dependen de tu equipo y carga del sistema: no son constantes universales.
const { performance } = require('node:perf_hooks');
const { generarVentas } = require('./generador');
const { clientesRecurrentes, clientesRecurrentesSet, clientesRecurrentesMap,
    totalVendido, ventaMayor, totalPorCiudad, primeraVenta,
    totalCiudadCadena, totalCiudadUnaPasada } = require('./analitica');
const funciones = { clientesRecurrentes, clientesRecurrentesSet, clientesRecurrentesMap,
    totalVendido, ventaMayor, totalPorCiudad, primeraVenta, totalCiudadCadena, totalCiudadUnaPasada };
function medir(funcion, ventas, ...args) {
    const inicio = performance.now();
    funcion(ventas, ...args);
    return +(performance.now() - inicio).toFixed(3);
}
const filas = [];
for (const n of [1000, 2000, 4000, 8000, 16000]) {
    const ventas = generarVentas(n);
    const fila = { n };
    console.time(`original ${n}`);
    fila.original_ms = medir(clientesRecurrentes, ventas);
    console.timeEnd(`original ${n}`);
    fila.set_ms = medir(clientesRecurrentesSet, ventas);
    fila.map_ms = medir(clientesRecurrentesMap, ventas);
    filas.push(fila);
}
console.table(filas);
const base = filas[filas.length - 1];
for (const n of [100000, 1000000]) {
    const estimado = base.original_ms * (n / base.n) ** 2;
    console.log(`Proyección original ${n.toLocaleString('es-CO')}: ${estimado.toFixed(1)} ms (${(estimado / 1000).toFixed(2)} s)`);
}
console.log('100.000 original NO se ejecuta automáticamente: la estimación puede variar y la prueba sería costosa.');
const extra = [];
for (const n of [1000, 10000, 100000]) {
    const ventas = generarVentas(n);
    const fila = { n };
    for (const [nombre, funcion] of Object.entries(funciones)) {
        if (nombre === 'clientesRecurrentes') continue; // O(n²) se mide arriba
        const args = nombre.startsWith('totalCiudad') ? ['Bogotá'] : [];
        fila[nombre + '_ms'] = medir(funcion, ventas, ...args);
    }
    extra.push(fila);
}
console.table(extra);
module.exports = { filas, extra };
