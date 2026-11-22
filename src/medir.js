const { generarVentas } = require('./generador');
const {
    totalVendidoInstrumentado, ventaMayorInstrumentada,
    totalPorCiudadInstrumentado, primeraVentaInstrumentada
} = require('./analitica');
const funciones = [totalVendidoInstrumentado, ventaMayorInstrumentada,
    totalPorCiudadInstrumentado, primeraVentaInstrumentada];
const filas = [];
for (const n of [100, 1000, 10000, 100000]) {
    const ventas = generarVentas(n);
    const conteos = funciones.map(funcion => {
        const contador = { operaciones: 0 };
        funcion(ventas, contador);
        return contador.operaciones;
    });
    filas.push({ n, totalVendido: conteos[0], ventaMayor: conteos[1],
        totalPorCiudad: conteos[2], primeraVenta: conteos[3] });
}
console.table(filas);
module.exports = { filas };
