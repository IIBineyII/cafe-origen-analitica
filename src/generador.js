// Generador reproducible en estructura, aleatorio en contenido (no en valores exactos).
const PRODUCTOS = [
    ['Origen Huila 500 g', 42000], ['Origen Nariño 250 g', 26000],
    ['Origen Sierra 500 g', 45000], ['Prensa francesa', 95000],
    ['Molino manual', 120000]
];
const CIUDADES = ['Medellín', 'Bogotá', 'Cali', 'Pereira'];
function aleatorioEntero(minimo, maximo) {
    return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}
function generarVentas(n) {
    if (!Number.isInteger(n) || n < 0) throw new RangeError('n debe ser entero >= 0');
    const ventas = [];
    const numeroClientes = Math.max(1, Math.floor(n / 3));
    for (let i = 0; i < n; i++) {
        const [producto, precio] = PRODUCTOS[aleatorioEntero(0, PRODUCTOS.length - 1)];
        ventas.push({
            id: i + 1,
            fecha: `2026-09-${String(aleatorioEntero(1, 28)).padStart(2, '0')}`,
            cliente: `C${String(aleatorioEntero(1, numeroClientes)).padStart(2, '0')}`,
            producto, ciudad: CIUDADES[aleatorioEntero(0, CIUDADES.length - 1)],
            cantidad: aleatorioEntero(1, 5), precio
        });
    }
    return ventas;
}
module.exports = { generarVentas };
