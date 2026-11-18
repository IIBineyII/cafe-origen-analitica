
function valorVenta(venta) {
    return venta.cantidad * venta.precio;
}

function totalVendido(ventas) {
    let total = 0;

    for (const venta of ventas) {
    total = total + valorVenta(venta);
    }

    return total;
}

function unidadesVendidas(ventas){
    let unidades = 0;

    for(const venta of ventas) {
        unidades = unidades + venta.cantidad;
    }
    return unidades;
}

function ventaMayor(ventas) {
    let mayor = null;

    for (const venta of ventas) {
        if (mayor === null) {
            mayor = venta;
        } else if (valorVenta(venta) >valorVenta(mayor)) {
            mayor = venta;
        }
    }
    return mayor;
}

function ticketPromedio(ventas) {
    let total = 0;
    let contador = 0;

    for (const venta of ventas) {
        if (venta.cantidad > 0) {
            total = total + valorVenta(venta);
            contador++;
        }
    }

    if (contador === 0) {
        return 0;
    }

    return total / contador;
}

function ventasPorCiudad(ventas, ciudad) {
    let total = 0;

    const ciudadBuscada = ciudad.trim().toLowerCase();

    for (const venta of ventas) {
        const ciudadActual = venta.ciudad.trim().toLowerCase();

        if (ciudadActual === ciudadBuscada) {
            total = total + valorVenta(venta);
        }
    }

    return total;
}

module.exports = {
    valorVenta,
    totalVendido,
    unidadesVendidas,
    ventaMayor,
    ticketPromedio,
    ventasPorCiudad
};