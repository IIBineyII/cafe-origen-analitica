const ventas = require('./datos');
const {
    totalVendido, unidadesVendidas, ventaMayor, ticketPromedio,
    totalPorCiudad, unidadesPorProducto, topProductosPorValor, ventasDelDia
} = require('./analitica');
const pesos = numero => '$' + numero.toLocaleString('es-CO', { maximumFractionDigits: 2 });
const linea = () => console.log('='.repeat(64));
function resumen(nombre, registros) {
    console.log(`\n${nombre}`);
    console.log('-'.repeat(64));
    console.log(`Registros:          ${registros.length}`);
    console.log(`Total vendido:      ${pesos(totalVendido(registros))}`);
    console.log(`Unidades vendidas:  ${unidadesVendidas(registros)}`);
    console.log(`Ticket promedio:    ${pesos(ticketPromedio(registros))}`);
    const mayor = ventaMayor(registros);
    console.log(`Venta mayor:        ${mayor ? `#${mayor.id} (${pesos(mayor.cantidad * mayor.precio)})` : 'Sin ventas'}`);
}
linea();
console.log('              CAFÉ ORIGEN · REPORTE v0.1');
linea();
resumen('1. RESUMEN GENERAL', ventas);
console.log('\n2. VENTAS POR CIUDAD');
console.table(Object.entries(totalPorCiudad(ventas)).map(([Ciudad, Total]) => ({ Ciudad, 'Total (COP)': pesos(Total) })));
console.log('3. UNIDADES POR PRODUCTO');
console.table(Object.entries(unidadesPorProducto(ventas)).map(([Producto, Unidades]) => ({ Producto, Unidades })));
console.log('4. TOP 3 PRODUCTOS POR VALOR');
console.table(topProductosPorValor(ventas, 3).map(([Producto, Total], i) => ({ Posición: i + 1, Producto, 'Total (COP)': pesos(Total) })));
console.log('5. RESUMEN POR DÍA');
resumen('Día con ventas: 2026-09-01', ventasDelDia(ventas, '2026-09-01'));
resumen('Día sin ventas: 2026-10-01', ventasDelDia(ventas, '2026-10-01'));
linea();
