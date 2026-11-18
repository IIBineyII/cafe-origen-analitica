const ventas = require("./datos");

const {
    valorVenta,
    totalVendido,
    unidadesVendidas,
    ventaMayor,
    ticketPromedio,
    ventasPorCiudad
} = require("./analitica");

const unaVenta = [ventas[0]];
const sinVentas = [];

function probar(nombre, datos) {
    console.log("---" + nombre + "---");


console.log("Total vendido:", totalVendido(datos));
console.log("Unidades:", unidadesVendidas(datos));
console.log("Venta mayor:", ventaMayor(datos));
console.log("Ticket promedio:", ticketPromedio(datos));
console.log("Ventas Medellín:", ventasPorCiudad(datos, "Medellín"));
}

probar("Todas las ventas:", ventas);
probar("Una venta", unaVenta);
probar("Sin ventas", sinVentas);

console.log("Valor primera venta:", valorVenta(ventas[0]));





