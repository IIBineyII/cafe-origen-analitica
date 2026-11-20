const ventas = require("./datos");

const {
    totalVendido,
    unidadesVendidas,
    ventasPorCiudad,
    totalVendidoM,
    unidadesVendidasM,
    ventasPorCiudadM,
    valorVenta
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

function totalPorCiudad(ventas) {
    return ventas.reduce((totales, venta)=>{
        const ciudad =venta.ciudad.trim().tolowerCae();

        if  (totales[ciudad] === undefined) {
            totales[ciudad] = 0;
        }

        totales[ciudad]+= valorVenta(venta);

        return totales;
    }, {});
}