const ventas = require("./datos")
console.log("Cantidad de registros:", ventas.length);
console.log("Primer registro:", ventas[0]);
console.log("Último registro:", ventas[ventas.length - 1]);
console.log("Prducto en posición 4:", ventas[4].producto);
console.table(ventas);


console.log("Valor primera venta:", valorVenta(ventas[0]));