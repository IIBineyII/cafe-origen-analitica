const { performance } = require('node:perf_hooks');
const { generarVentas } = require('./generador');
const A = require('./analitica');
const ventas = generarVentas(10000);
const tareas = [
 ['valorVenta', () => A.valorVenta(ventas[0])],
 ['totalVendido', () => A.totalVendido(ventas)],
 ['unidadesVendidas', () => A.unidadesVendidas(ventas)],
 ['ventaMayor', () => A.ventaMayor(ventas)],
 ['ticketPromedio', () => A.ticketPromedio(ventas)],
 ['ventasPorCiudad', () => A.ventasPorCiudad(ventas, 'Bogotá')],
 ['totalVendidoM', () => A.totalVendidoM(ventas)],
 ['unidadesVendidasM', () => A.unidadesVendidasM(ventas)],
 ['ventasPorCiudadM', () => A.ventasPorCiudadM(ventas, 'Bogotá')],
 ['totalPorCiudad', () => A.totalPorCiudad(ventas)],
 ['unidadesPorProducto', () => A.unidadesPorProducto(ventas)],
 ['topProductosPorValor', () => A.topProductosPorValor(ventas, 3)],
 ['ventasDelDia', () => A.ventasDelDia(ventas, '2026-09-01')],
 ['primeraVenta', () => A.primeraVenta(ventas)],
 ['clientesRecurrentes', () => A.clientesRecurrentes(ventas)],
 ['clientesRecurrentesSet', () => A.clientesRecurrentesSet(ventas)],
 ['comprasPorCliente', () => A.comprasPorCliente(ventas)],
 ['clientesRecurrentesMap', () => A.clientesRecurrentesMap(ventas)],
 ['totalCiudadCadena', () => A.totalCiudadCadena(ventas, 'Bogotá')],
 ['totalCiudadUnaPasada', () => A.totalCiudadUnaPasada(ventas, 'Bogotá')],
 ['normalizarCiudad', () => A.normalizarCiudad('Bogotá ')],
];
const tabla = tareas.map(([funcion, ejecutar]) => {
    const inicio = performance.now(); ejecutar();
    return { funcion, ms_10000: +(performance.now() - inicio).toFixed(4) };
});
console.table(tabla);
console.log(JSON.stringify(tabla));
