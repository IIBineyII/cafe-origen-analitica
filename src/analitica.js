
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

function totalVendidoM(ventas) {
    return ventas.reduce((total, venta) => {
        return total + valorVenta(venta);
    }, 0);
}

function unidadesVendidasM(ventas) {
    return ventas.reduce((total, venta) => {
        return total + venta.cantidad;
    }, 0);
}

function ventasPorCiudadM(ventas, ciudad) {
    const ciudadBuscada = ciudad.trim().toLowerCase();

    return ventas
        .filter(venta =>
            venta.ciudad.trim().toLowerCase() === ciudadBuscada
        )
        .map(venta => valorVenta(venta))
        .reduce((total, valor) => total + valor, 0);
}


// Un diccionario garantiza que variantes de escritura compartan la misma clave.
const NOMBRES_CIUDADES = {
    'medellín': 'Medellín', 'bogotá': 'Bogotá', 'cali': 'Cali', 'pereira': 'Pereira'
};
function normalizarCiudad(ciudad) {
    const clave = ciudad.trim().toLocaleLowerCase('es-CO');
    return NOMBRES_CIUDADES[clave] || clave;
}
function totalPorCiudad(ventas) {
    return ventas.reduce((grupos, venta) => {
        const ciudad = normalizarCiudad(venta.ciudad);
        grupos[ciudad] = (grupos[ciudad] || 0) + valorVenta(venta);
        return grupos;
    }, {});
}
function unidadesPorProducto(ventas) {
    return ventas.reduce((grupos, venta) => {
        grupos[venta.producto] = (grupos[venta.producto] || 0) + venta.cantidad;
        return grupos;
    }, {});
}
function topProductosPorValor(ventas, k) {
    const grupos = ventas.reduce((acumulado, venta) => {
        acumulado[venta.producto] = (acumulado[venta.producto] || 0) + valorVenta(venta);
        return acumulado;
    }, {});
    const copia = [...Object.entries(grupos)];
    copia.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'es'));
    return copia.slice(0, Math.max(0, Math.trunc(k) || 0));
}
function ventasDelDia(ventas, fecha) {
    return ventas.filter(venta => venta.fecha === fecha);
}
// Se instrumentan visitas y comparaciones de manera explícita; no son milisegundos.
function totalVendidoInstrumentado(ventas, contador) {
    let total = 0;
    for (const venta of ventas) { contador.operaciones++; total += valorVenta(venta); }
    return total;
}
function ventaMayorInstrumentada(ventas, contador) {
    let mayor = null;
    for (const venta of ventas) {
        contador.operaciones++; // visita
        if (mayor !== null) {
            contador.operaciones++; // comparación entre valores
            if (valorVenta(venta) > valorVenta(mayor)) mayor = venta;
        } else mayor = venta;
    }
    return mayor;
}
function totalPorCiudadInstrumentado(ventas, contador) {
    const grupos = {};
    for (const venta of ventas) {
        contador.operaciones++;
        const ciudad = normalizarCiudad(venta.ciudad);
        grupos[ciudad] = (grupos[ciudad] || 0) + valorVenta(venta);
    }
    return grupos;
}
function primeraVenta(ventas) { return ventas.length ? ventas[0] : null; }
function primeraVentaInstrumentada(ventas, contador) {
    contador.operaciones++;
    return primeraVenta(ventas);
}
// Versión original de fuerza bruta: compara todos los pares i < j.
function clientesRecurrentes(ventas) {
    const recurrentes = [];
    for (let i = 0; i < ventas.length; i++) {
        for (let j = i + 1; j < ventas.length; j++) {
            if (ventas[i].cliente === ventas[j].cliente &&
                !recurrentes.includes(ventas[i].cliente)) {
                recurrentes.push(ventas[i].cliente);
            }
        }
    }
    return recurrentes;
}
function clientesRecurrentesSet(ventas) {
    const vistos = new Set();
    const repetidos = new Set();
    for (const venta of ventas) {
        if (vistos.has(venta.cliente)) repetidos.add(venta.cliente);
        else vistos.add(venta.cliente);
    }
    return [...repetidos];
}
function comprasPorCliente(ventas) {
    const conteos = new Map();
    for (const venta of ventas) {
        conteos.set(venta.cliente, (conteos.get(venta.cliente) || 0) + 1);
    }
    return conteos;
}
function clientesRecurrentesMap(ventas) {
    return [...comprasPorCliente(ventas)]
        .filter(([, cantidad]) => cantidad > 1)
        .map(([cliente]) => cliente);
}
function totalCiudadCadena(ventas, ciudad) {
    const buscada = normalizarCiudad(ciudad);
    return ventas
        .map(venta => ({ ...venta, ciudad: normalizarCiudad(venta.ciudad) }))
        .filter(venta => venta.ciudad === buscada)
        .map(venta => valorVenta(venta))
        .reduce((suma, valor) => suma + valor, 0);
}
function totalCiudadUnaPasada(ventas, ciudad) {
    const buscada = normalizarCiudad(ciudad);
    let total = 0;
    for (const venta of ventas) {
        if (normalizarCiudad(venta.ciudad) === buscada) total += valorVenta(venta);
    }
    return total;
}
module.exports = {
    valorVenta, totalVendido, unidadesVendidas, ventaMayor, ticketPromedio,
    ventasPorCiudad, totalVendidoM, unidadesVendidasM, ventasPorCiudadM,
    normalizarCiudad, totalPorCiudad, unidadesPorProducto, topProductosPorValor,
    ventasDelDia, totalVendidoInstrumentado, ventaMayorInstrumentada,
    totalPorCiudadInstrumentado, primeraVenta, primeraVentaInstrumentada,
    clientesRecurrentes, clientesRecurrentesSet, comprasPorCliente,
    clientesRecurrentesMap, totalCiudadCadena, totalCiudadUnaPasada
};
