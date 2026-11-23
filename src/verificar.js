const assert = require('node:assert/strict');
const ventas = require('./datos');
const { generarVentas } = require('./generador');
const A = require('./analitica');
function par(nombre, ciclo, metodo) {
    const iguales = Object.is(ciclo, metodo);
    console.log(`${nombre}: ${iguales ? 'OK' : 'DIFERENTE'}`);
    assert.ok(iguales, `${nombre}: los resultados difieren`);
}
for (const [nombre, datos] of [['12 ventas', ventas], ['una venta', ventas.slice(0, 1)], ['vacío', []]]) {
    par(`${nombre} · total`, A.totalVendido(datos), A.totalVendidoM(datos));
    par(`${nombre} · unidades`, A.unidadesVendidas(datos), A.unidadesVendidasM(datos));
    for (const ciudad of ['Medellín', 'Bogotá ', 'Cali', 'Pereira']) {
        par(`${nombre} · ${ciudad.trim()}`, A.ventasPorCiudad(datos, ciudad), A.ventasPorCiudadM(datos, ciudad));
    }
}
const ciudades = A.totalPorCiudad(ventas);
assert.deepEqual(Object.keys(ciudades).sort(), ['Bogotá', 'Cali', 'Medellín', 'Pereira'].sort());
assert.deepEqual(ciudades, { Medellín: 356000, Bogotá: 276000, Cali: 185000, Pereira: 168000 });
const conEspacios = [...ventas, { ...ventas[1], id: 99, ciudad: 'Bogotá ' }];
assert.equal(Object.keys(A.totalPorCiudad(conEspacios)).length, 4);
assert.equal(A.totalPorCiudad(conEspacios).Bogotá, 302000);
assert.equal(A.ticketPromedio(A.ventasDelDia(ventas, '2026-10-01')), 0);
assert.equal(A.totalVendido(A.ventasDelDia(ventas, '2026-10-01')), 0);
const orden = JSON.stringify(ventas);
const top = A.topProductosPorValor(ventas, 3);
assert.equal(top.length, 3);
assert.deepEqual(top.map(([nombre]) => nombre), ['Origen Huila 500 g', 'Origen Sierra 500 g', 'Prensa francesa']);
assert.equal(JSON.stringify(ventas), orden);
const esperados = ['C01', 'C02', 'C03'];
for (const fn of [A.clientesRecurrentes, A.clientesRecurrentesSet, A.clientesRecurrentesMap]) {
    assert.deepEqual(fn(ventas).sort(), esperados);
}
assert.equal(A.comprasPorCliente(ventas).get('C01'), 3);
const generadas = generarVentas(5000);
assert.equal(generadas.length, 5000);
assert.ok(generadas.every(v => Number.isInteger(v.id) && v.fecha && v.cliente && v.producto && v.ciudad && v.cantidad >= 1 && v.cantidad <= 5 && v.precio > 0));
const esperado = A.clientesRecurrentes(generadas).sort();
assert.deepEqual(A.clientesRecurrentesSet(generadas).sort(), esperado);
assert.deepEqual(A.clientesRecurrentesMap(generadas).sort(), esperado);
const diezMil = generarVentas(10000);
assert.equal(A.totalCiudadCadena(diezMil, 'Bogotá'), A.totalCiudadUnaPasada(diezMil, 'Bogotá'));
console.log('Ciudades, ticket vacío, top 3, orden, 5.000 recurrentes y 10.000 ciudades: OK');
