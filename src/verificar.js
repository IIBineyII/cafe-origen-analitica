const ventas = require("./datos");

const {
    totalVendido,
    unidadesVendidas,
    ventasPorCiudad,
    totalVendidoM,
    unidadesVendidasM,
    ventasPorCiudadM
} = require("./analitica");

function verificar(nombre, resultadoCiclo, resultadoMetodo) {
    if (resultadoCiclo === resultadoMetodo) {
        console.log(nombre + ": OK");
    } else {
        console.log(nombre + ": DIFERENTE");
    }
}

verificar(
    "Total vendido",
    totalVendido(ventas),
    totalVendidoM(ventas)
);

verificar(
    "Unidades vendidas",
    unidadesVendidas(ventas),
    unidadesVendidasM(ventas)
);

verificar(
    "Ventas Medellín",
    ventasPorCiudad(ventas, "Medellín"),
    ventasPorCiudadM(ventas, "Medellín")
);