# GUÍA DE ESTUDIO AMPLIADA — Café Origen

**Para quién es:** alguien que empieza a aprender JavaScript. Esta guía explica el código **que realmente está en este proyecto**. La `bitacora.md` documenta las pruebas y decisiones; aquí explicamos las instrucciones y cómo seguirlas en VS Code.

## Nota sobre la organización

Los bloques reproducen el código real de la versión final del ZIP, agrupado por objetivo didáctico. El historial muestra que varias funciones de retos posteriores se incorporaron juntas en el commit del MiniReto 3; por eso esta distribución no pretende ser una reconstrucción literal de cada commit. Los scripts compartidos se muestran completos una vez y sus bloques específicos se explican en el reto correspondiente.

## 0. Mapa de archivos: dónde buscar cada cosa

| MiniReto | Archivo nuevo o actualizado | Qué se agregó |
|---|---|---|
| Base / Día 1 | `src/datos.js`, `src/explorar.js`, `src/analitica.js` | Ventas de ejemplo y funciones con ciclos (`valorVenta`, `totalVendido`, `unidadesVendidas`, `ventaMayor`, `ticketPromedio`, `ventasPorCiudad`). |
| 3: métodos | `src/analitica.js`, `src/verificar.js` | Versiones `totalVendidoM`, `unidadesVendidasM`, `ventasPorCiudadM`; agrupaciones `totalPorCiudad`, `unidadesPorProducto`, ranking `topProductosPorValor`; pruebas. |
| 4: reporte | `src/reporte.js`, `src/analitica.js`, `README.md`, `bitacora.md` | Reporte de consola, `ventasDelDia`, pruebas de Bogotá duplicada y día sin ventas. |
| 5: operaciones | `src/generador.js`, `src/medir.js`, `src/analitica.js` | `generarVentas`, versiones `*Instrumentada` y `primeraVenta`; tabla de operaciones. |
| 6: ciclos anidados | `src/analitica.js`, `src/benchmark.js` | `clientesRecurrentes` original, tiempos y proyecciones. |
| 7: memoria | `src/analitica.js`, `src/comparar-ciudad.js` | `totalCiudadCadena` y `totalCiudadUnaPasada`. |
| 8: documento técnico | `RENDIMIENTO.md`, `src/perfil.js` | Tabla de complejidades, mediciones, riesgos y plan de optimización. |
| 9: optimización final | `src/analitica.js`, `src/verificar.js`, `src/benchmark.js` | `clientesRecurrentesSet`, `comprasPorCliente`, `clientesRecurrentesMap` y pruebas comparativas. |

**Importante:** un mismo archivo, como `analitica.js`, se amplía durante varios retos. No necesitas crear otro `analitica.js` por cada uno.

## 1. Antes de los miniretos: cómo leer una función

```js
function duplicar(numero) {
    const resultado = numero * 2;
    return resultado;
}
const respuesta = duplicar(5);
console.log(respuesta); // 10
```

- `function`: palabra reservada para **declarar** una función. Declararla no significa ejecutarla.
- `duplicar`: nombre elegido por el programador.
- `(numero)`: **parámetro**; es un nombre local que recibirá un valor cuando llamemos a la función.
- `duplicar(5)`: **llamada**; `5` es el **argumento** que se asigna a `numero`.
- `{ ... }`: instrucciones de la función.
- `const`: declara una variable cuyo identificador no se puede reasignar.
- `return resultado`: entrega el valor al **lugar de la llamada**. En este caso `respuesta` recibe `10`. También detiene esa ejecución de la función.
- `console.log`: imprime algo; **no** equivale a devolverlo.
- `//`: comentario para humanos; JavaScript lo ignora.

En `src/analitica.js`, `valorVenta(venta)` recibe **un objeto** de venta; `totalVendido(ventas)` recibe **un arreglo** de muchos objetos. El parámetro `ventas` de la función no tiene que ser la misma variable declarada en `datos.js`: recibe el arreglo que se le pase al llamarla.

### Objetos, arreglos y acceso a propiedades

```js
const persona = { nombre: "Ana", edad: 20 };
console.log(persona.nombre);   // "Ana"
const colores = ["rojo", "azul"];
console.log(colores[0]);       // "rojo"
console.log(colores.length);   // 2
```

- `{ nombre: "Ana" }` es un **objeto** con propiedades.
- `[ ... ]` es un **arreglo**, una lista ordenada.
- `persona.nombre` consulta una propiedad conocida.
- `objeto[clave]` consulta una propiedad cuyo nombre está guardado en una variable.
- `[0]` es la primera posición; los índices empiezan en cero.
- `.length` indica cuántos elementos tiene un arreglo.

### `for...of` frente a `for` clásico

```js
for (const color of colores) {
    console.log(color);
}
for (let i = 0; i < colores.length; i++) {
    console.log(colores[i]);
}
```

`for...of` entrega cada elemento directamente. En el segundo `for`, `let i = 0` inicializa el índice; `i < colores.length` decide si seguimos; `i++` incrementa `i` en uno. Ambos ejemplos imprimen los dos colores.

### `null`, `undefined` y `NaN`

`null` significa «todavía no hay un valor seleccionado», como `let mayor = null` en `ventaMayor`. `undefined` aparece, por ejemplo, al leer una propiedad inexistente o cuando una función no devuelve nada. `NaN` significa «Not a Number»: `0 / 0` devuelve `NaN`. Son tres cosas diferentes.

---

# Día 1 — continuación

## 2. MiniReto 3 — Métodos de arreglos y agrupaciones

**Dónde:** `src/analitica.js` (funciones nuevas) y `src/verificar.js` (comparación). **Objetivo:** obtener los mismos resultados que con ciclos, pero usando métodos.


### Código completo — `src/analitica.js`

```javascript
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
```

**Desglose del código, en orden:**

1. `totalVendidoM`: recibe el arreglo; `reduce` comienza en 0, llama a `valorVenta` y devuelve el acumulador actualizado.
2. `unidadesVendidasM`: repite el mecanismo, pero suma `venta.cantidad`, no dinero.
3. `ventasPorCiudadM`: limpia la ciudad buscada; `filter` compara cada ciudad, `map` convierte cada coincidencia en dinero y `reduce` suma desde cero.
4. `NOMBRES_CIUDADES` relaciona claves minúsculas con nombres de presentación. `normalizarCiudad` limpia espacios y usa `|| clave` si no encuentra una equivalencia.
5. `totalPorCiudad`: comienza con `{}`; `grupos[ciudad]` consulta el total anterior; `|| 0` proporciona el inicial; suma el valor y devuelve el objeto en cada vuelta.
6. `unidadesPorProducto`: usa el producto como clave y suma cantidades; devuelve el diccionario completo.
7. `topProductosPorValor`: agrupa dinero por producto; `Object.entries` crea parejas; `...` copia el arreglo; `sort` compara importes y desempata alfabéticamente; `Math.trunc` elimina decimales, `Math.max` evita negativos y `slice` selecciona los primeros k.

### Código completo — `src/verificar.js (bloque de comparaciones del reto 3)`

```javascript
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
```

**Desglose del código, en orden:**

1. `require` carga el módulo de pruebas, los datos, el generador y las funciones; `A` es el objeto de funciones exportadas. La importación del generador pertenece a la integración posterior.
2. `par` recibe dos resultados, `Object.is` comprueba igualdad, el ternario elige OK o DIFERENTE y `assert.ok` detiene la prueba si falla.
3. El `for` desestructura cada pareja de nombre y datos; `slice(0,1)` crea una muestra de una venta y `[]` representa ninguna.
4. Se comparan totales, unidades y las cuatro ciudades con los mismos datos. `Object.keys` obtiene las claves y `deepEqual` verifica el contenido completo.

### Explicación complementaria y ejemplos pequeños


### `reduce`: acumular paso a paso

Código real simplificado de `totalVendidoM`:

```js
function totalVendidoM(ventas) {
    return ventas.reduce((total, venta) => {
        return total + valorVenta(venta);
    }, 0);
}
```

1. `ventas` es el arreglo recibido por la función.
2. `.reduce(...)` procesa sus elementos y mantiene un **acumulador**.
3. `(total, venta) => { ... }` es una **función flecha**: `total` es el acumulador y `venta` el elemento actual.
4. `valorVenta(venta)` llama a otra función que calcula `cantidad * precio`.
5. El `return` **interno** indica cuál será el acumulador de la siguiente vuelta.
6. El `0` al final es el **valor inicial** del acumulador. Si no hay ventas, el resultado es `0`.
7. El `return` **externo** devuelve el total al código que llamó `totalVendidoM`.

Ejemplo con números: `[10, 20, 30].reduce((suma, n) => suma + n, 0)` hace `0+10=10`, luego `10+20=30`, luego `30+30=60`. No siempre se usa `0`: para construir un objeto se inicia con `{}`, y para un arreglo con `[]`. Es buena práctica indicar un valor inicial; sin él, `reduce` falla con arreglos vacíos.

### `filter`: conservar algunos elementos

```js
const edades = [12, 18, 25];
const mayores = edades.filter(edad => edad >= 18);
// [18, 25]
```

`filter` pregunta para **cada elemento** si la condición es verdadera. Devuelve **otro arreglo** y no modifica el original. En `ventasPorCiudadM`, se usa para quedarse solo con ventas de la ciudad buscada.

### `map`: transformar cada elemento

```js
const numeros = [2, 3, 4];
const dobles = numeros.map(numero => numero * 2);
// [4, 6, 8]
```

`map` transforma cada elemento y crea otro arreglo de igual longitud. En `ventasPorCiudadM`, después de filtrar, transforma objetos de venta en sus valores monetarios.

**Cadena completa en `ventasPorCiudadM`:** `filter` selecciona ventas → `map` obtiene valores → `reduce` suma. Se ejecutan en ese orden, no todos a la vez.

### `trim`, `toLowerCase`, `toLocaleLowerCase` y `===`

```js
" Bogotá ".trim();                // "Bogotá"
"BOGOTÁ".toLowerCase();           // "bogotá"
"BOGOTÁ".toLocaleLowerCase("es-CO"); // "bogotá"
"Bogotá" === "Bogotá ";           // false
```

`trim()` quita espacios **al inicio y final**; `toLowerCase()` convierte letras a minúsculas; `toLocaleLowerCase('es-CO')` aplica reglas regionales. `===` compara estrictamente dos valores. Por eso se normalizan los nombres **antes** de agrupar. En `analitica.js` revisa `NOMBRES_CIUDADES`, `normalizarCiudad` y `totalPorCiudad`.

### Objetos como diccionarios y `reduce(..., {})`

```js
const grupos = {};
grupos["Bogotá"] = (grupos["Bogotá"] || 0) + 26000;
```

`grupos` es un objeto que relaciona una **clave** (`"Bogotá"`) con un total (`26000`). `grupos["Bogotá"] || 0` usa el valor guardado si existe y es verdadero; en caso contrario utiliza cero. `totalPorCiudad` acumula **dinero** por ciudad; `unidadesPorProducto` acumula **cantidades** por nombre de producto. El `return grupos` interno de `reduce` conserva el diccionario entre iteraciones.

### `Object.entries`, `...`, `sort`, `slice` y `localeCompare`

Estos aparecen juntos en `topProductosPorValor`:

```js
const totales = { Cafe: 100, Molino: 250, Taza: 180 };
const pares = Object.entries(totales);
// [["Cafe",100], ["Molino",250], ["Taza",180]]
const copia = [...pares];
copia.sort((a, b) => b[1] - a[1]);
const dosPrimeros = copia.slice(0, 2);
// [["Molino",250], ["Taza",180]]
```

- `Object.entries(objeto)` convierte propiedades en parejas `[clave, valor]`.
- `[...pares]` usa el **operador de propagación** para copiar el arreglo (copia superficial).
- `sort((a,b) => b[1]-a[1])` ordena por el **segundo valor** de cada pareja, de mayor a menor. `sort` **modifica el arreglo al que se aplica**; por eso usamos `copia`.
- `slice(0,2)` obtiene elementos desde el índice `0` hasta **antes** del índice `2`; no modifica el arreglo.
- El código real agrega `a[0].localeCompare(b[0], 'es')` como desempate alfabético cuando los importes son iguales.
- También usa `Math.trunc(k)` para quitar decimales y `Math.max(0, ...)` para impedir una cantidad negativa de productos.

**Qué verificar:** `node src/verificar.js` compara versiones con ciclo y con método para 12 ventas, una venta y cero ventas. `Object.is(a,b)` pregunta si los resultados son iguales y `assert.ok(...)` hace fallar la prueba si no coinciden. Ver «OK» significa que esa comprobación pasó.

---

## 3. MiniReto 4 — Reporte legible y depuración

**Dónde:** nuevo `src/reporte.js`; `ventasDelDia` en `src/analitica.js`; pruebas en `src/verificar.js`; explicación de errores en `bitacora.md`; instrucciones en `README.md`.


### Código completo — `src/analitica.js`

```javascript
function ventasDelDia(ventas, fecha) {
    return ventas.filter(venta => venta.fecha === fecha);
}
```

**Desglose del código, en orden:**

1. `ventas` y `fecha` son parámetros; `filter` recorre los registros y conserva aquellos cuya fecha coincide exactamente mediante `===`.
2. Si no coincide ninguno devuelve `[]`; el ticket promedio existente devuelve 0 cuando su contador es cero.

### Código completo — `src/reporte.js`

```javascript
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
```

**Desglose del código, en orden:**

1. Las primeras líneas importan datos y funciones. `pesos` convierte números en texto colombiano; `maximumFractionDigits: 2` limita decimales.
2. `linea` imprime 64 signos iguales. `resumen` recibe título y registros, imprime cantidad de registros, total, unidades y promedio.
3. `mayor` guarda el objeto de mayor venta o null; el ternario evita acceder a propiedades de null.
4. Las llamadas a `resumen` y `console.log` organizan el informe. `Object.entries` y `map` construyen filas con nombres de columnas para `console.table`.
5. En el top, `i + 1` convierte el índice en posición humana. Las dos llamadas a `ventasDelDia` muestran un día con registros y otro vacío.

### Código completo — `src/verificar.js (pruebas de depuración)`

```javascript
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
```

**Desglose del código, en orden:**

1. `[...ventas, {...ventas[1], ...}]` crea un arreglo con una venta adicional y un espacio en Bogotá sin alterar los datos originales.
2. `assert.equal` comprueba cuatro ciudades, el importe de Bogotá y los ceros del día vacío.
3. `JSON.stringify` guarda una representación del arreglo antes de ordenar; `top.length` comprueba tres productos; `map` extrae nombres y `deepEqual` verifica el orden esperado. La última comparación verifica que el original no cambió.

### Explicación complementaria y ejemplos pequeños


### `require` y `module.exports`: conectar archivos

En `analitica.js` aparece `module.exports = { totalVendido, ... }`. Es la lista de funciones que ese módulo permite importar. En `reporte.js`:

```js
const ventas = require('./datos');
const { totalVendido, ticketPromedio } = require('./analitica');
```

`require('./datos')` carga el archivo `datos.js` de la misma carpeta; `./` significa «desde aquí». Las llaves `{ totalVendido, ticketPromedio }` extraen propiedades del objeto exportado. Si una función no aparece en `module.exports`, al importarla así puede quedar `undefined` y al llamarla verás «is not a function».

### `toLocaleString`, plantillas y consola

```js
const dinero = 1234567;
console.log(`Total: $${dinero.toLocaleString('es-CO')}`);
// Total: $1.234.567
```

- `toLocaleString('es-CO')` formatea números según la convención colombiana.
- Las **comillas invertidas** (`` ` ``) crean una plantilla de texto.
- `${expresión}` inserta el resultado de una expresión dentro del texto.
- `console.log` imprime una línea.
- `console.table([{ ciudad: "Cali", total: 100 }])` muestra filas y columnas.
- `'\n'` inserta un salto de línea.
- `'='.repeat(64)` repite un carácter 64 veces para dibujar separadores.
- El código de `reporte.js` usa `mayor ? textoSiExiste : 'Sin ventas'`: es el **operador ternario**, una condición corta.

### `ventasDelDia` y el problema de `NaN`

```js
function ventasDelDia(ventas, fecha) {
    return ventas.filter(venta => venta.fecha === fecha);
}
```

`fecha` es otro parámetro. Si ninguna venta coincide, `filter` devuelve `[]`, un arreglo vacío. La función `ticketPromedio` **comprueba si el contador es cero** y devuelve `0` antes de dividir; así evita `0/0`, que daría `NaN`.

### Reproducir un error: seis pasos

En `bitacora.md` busca los registros de depuración. Para Bogotá duplicada:
1. **Síntoma:** aparecen `"Bogotá"` y `"Bogotá "` como grupos separados.
2. **Entrada:** una venta con ciudad `"Bogotá "`.
3. **Hipótesis:** el espacio final cambia la clave.
4. **Prueba:** imprimir ambas cadenas o comprobar `"Bogotá" === "Bogotá "`.
5. **Causa:** se agrupaba texto sin normalizar.
6. **Corrección:** `trim()` y normalización antes de usar la ciudad como clave.

Para el promedio vacío, el síntoma es `NaN`; la entrada es `[]`; la causa es dividir `0/0`; la corrección es `if (contador === 0) return 0`.

**Cómo ejecutarlo:** `node src/reporte.js`. `node` inicia Node.js; `src/reporte.js` es la ruta al archivo que quieres ejecutar. Hazlo desde la **raíz del proyecto**, donde está `README.md`.

---

# Día 2

## 4. MiniReto 5 — Generar datos y contar operaciones

**Dónde:** nuevo `src/generador.js`, nuevo `src/medir.js`, funciones `*Instrumentada` y `primeraVenta` en `src/analitica.js`.


### Código completo — `src/generador.js`

```javascript
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
```

**Desglose del código, en orden:**

1. Las constantes PRODUCTOS y CIUDADES son listas fijas; cada pareja de producto contiene nombre y precio.
2. `aleatorioEntero` multiplica un decimal aleatorio por el tamaño del rango, redondea hacia abajo y suma el mínimo.
3. `Number.isInteger` y `n < 0` validan la entrada; `!` niega y `||` significa o; `throw` detiene la ejecución inválida.
4. `ventas = []` inicia la lista; `Math.max` garantiza al menos un cliente posible. El for genera n registros.
5. La desestructuración `[producto, precio]` extrae una pareja aleatoria; `push` agrega un objeto; `id: i+1` genera identificadores consecutivos.
6. Las plantillas de fecha y cliente usan `String` y `padStart` para completar ceros; cantidad y ciudad se eligen al azar. `return` entrega el arreglo y `module.exports` permite importarlo.

### Código completo — `src/analitica.js`

```javascript
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
```

**Desglose del código, en orden:**

1. `contador.operaciones++` incrementa una propiedad del objeto compartido; `+=` suma al valor anterior.
2. `totalVendidoInstrumentado` cuenta una visita por venta. `ventaMayorInstrumentada` cuenta una visita y, salvo la primera, una comparación de importes; `!==` significa distinto estrictamente.
3. `totalPorCiudadInstrumentado` cuenta visitas y agrupa usando la ciudad normalizada.
4. `primeraVenta` usa un ternario: si length es distinto de cero devuelve el índice 0, si no null. Su versión instrumentada cuenta una sola consulta.

### Código completo — `src/medir.js`

```javascript
const { generarVentas } = require('./generador');
const {
    totalVendidoInstrumentado, ventaMayorInstrumentada,
    totalPorCiudadInstrumentado, primeraVentaInstrumentada
} = require('./analitica');
const funciones = [totalVendidoInstrumentado, ventaMayorInstrumentada,
    totalPorCiudadInstrumentado, primeraVentaInstrumentada];
const filas = [];
for (const n of [100, 1000, 10000, 100000]) {
    const ventas = generarVentas(n);
    const conteos = funciones.map(funcion => {
        const contador = { operaciones: 0 };
        funcion(ventas, contador);
        return contador.operaciones;
    });
    filas.push({ n, totalVendido: conteos[0], ventaMayor: conteos[1],
        totalPorCiudad: conteos[2], primeraVenta: conteos[3] });
}
console.table(filas);
module.exports = { filas };
```

**Desglose del código, en orden:**

1. Importa el generador y las cuatro funciones instrumentadas. `funciones` guarda referencias a funciones, no resultados.
2. El for recorre cuatro tamaños y genera datos para cada uno.
3. `map` llama cada función con un contador nuevo; devuelve su número de operaciones.
4. `filas.push` organiza los cuatro conteos por índice; `console.table` muestra la tabla y `module.exports` comparte filas.

### Explicación complementaria y ejemplos pequeños


### `Math.random`, `Math.floor` y rangos

```js
Math.random();           // número desde 0 hasta menos de 1
Math.floor(3.9);         // 3
Math.floor(Math.random() * 5) + 1; // entero entre 1 y 5
```

En `generador.js`, `aleatorioEntero(minimo,maximo)` usa:

```js
return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
```

`maximo - minimo + 1` cuenta las opciones posibles; `Math.floor` redondea hacia abajo y `+ minimo` desplaza el rango. `generarVentas(n)` crea **exactamente n objetos** con `for`, elige productos y ciudades de listas fijas y añade cada venta con `ventas.push({...})`.

Otros elementos nuevos del generador:
- `Number.isInteger(n)` verifica que `n` sea entero.
- `throw new RangeError(...)` detiene la función con un error explicativo si el tamaño es inválido.
- `Math.max(1, ...)` evita que el número de clientes sea menor que 1.
- `String(numero).padStart(2,'0')` convierte, por ejemplo, `3` en `"03"`.
- `const [producto, precio] = ...` es **desestructuración**: extrae dos posiciones de un arreglo.
- `producto, ciudad` dentro de un objeto es una forma corta de escribir `producto: producto, ciudad: ciudad`.

### Contador por referencia

```js
const contador = { operaciones: 0 };
function visitar(c) { c.operaciones++; }
visitar(contador);
console.log(contador.operaciones); // 1
```

`contador` es un objeto; la función recibe una referencia al **mismo objeto**, por lo que modificar `c.operaciones` también modifica el contador original. `++` significa sumar uno. Las versiones instrumentadas cuentan visitas y comparaciones, **no milisegundos**.

`medir.js` usa `[100,1000,10000,100000]`, ejecuta las funciones y muestra `console.table(filas)`. También usa `funciones.map(...)` para producir los conteos. La función `primeraVenta` solo consulta `ventas[0]`, por lo que su trabajo no aumenta con `n`.

### Big O explicado

- **O(1):** trabajo constante. Consultar la primera venta.
- **O(n):** recorrer todas las ventas una vez; duplicar entradas implica aproximadamente duplicar operaciones.
- **O(n²):** comparar cada venta con muchas otras; duplicar entradas implica aproximadamente cuadruplicar comparaciones.

Big O describe cómo crece el trabajo, **no una promesa de milisegundos exactos**. En `bitacora.md` están la predicción y su comparación con los conteos.

---

## 5. MiniReto 6 — Por qué los ciclos anidados son lentos

**Dónde:** `clientesRecurrentes` en `src/analitica.js` y nuevo `src/benchmark.js`.


### Código completo — `src/analitica.js`

```javascript
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
```

**Desglose del código, en orden:**

1. `recurrentes = []` guarda clientes repetidos sin duplicarlos.
2. El ciclo i selecciona una venta; j empieza en i+1 para comparar solo parejas posteriores.
3. `&&` exige dos condiciones: mismo cliente y que `includes` no lo encuentre; `!` invierte el resultado de includes.
4. `push` añade el cliente y `return` devuelve la lista. Hay n(n−1)/2 comparaciones de parejas.

### Código completo — `src/benchmark.js`

```javascript
// Los tiempos dependen de tu equipo y carga del sistema: no son constantes universales.
const { performance } = require('node:perf_hooks');
const { generarVentas } = require('./generador');
const { clientesRecurrentes, clientesRecurrentesSet, clientesRecurrentesMap,
    totalVendido, ventaMayor, totalPorCiudad, primeraVenta,
    totalCiudadCadena, totalCiudadUnaPasada } = require('./analitica');
const funciones = { clientesRecurrentes, clientesRecurrentesSet, clientesRecurrentesMap,
    totalVendido, ventaMayor, totalPorCiudad, primeraVenta, totalCiudadCadena, totalCiudadUnaPasada };
function medir(funcion, ventas, ...args) {
    const inicio = performance.now();
    funcion(ventas, ...args);
    return +(performance.now() - inicio).toFixed(3);
}
const filas = [];
for (const n of [1000, 2000, 4000, 8000, 16000]) {
    const ventas = generarVentas(n);
    const fila = { n };
    console.time(`original ${n}`);
    fila.original_ms = medir(clientesRecurrentes, ventas);
    console.timeEnd(`original ${n}`);
    fila.set_ms = medir(clientesRecurrentesSet, ventas);
    fila.map_ms = medir(clientesRecurrentesMap, ventas);
    filas.push(fila);
}
console.table(filas);
const base = filas[filas.length - 1];
for (const n of [100000, 1000000]) {
    const estimado = base.original_ms * (n / base.n) ** 2;
    console.log(`Proyección original ${n.toLocaleString('es-CO')}: ${estimado.toFixed(1)} ms (${(estimado / 1000).toFixed(2)} s)`);
}
console.log('100.000 original NO se ejecuta automáticamente: la estimación puede variar y la prueba sería costosa.');
const extra = [];
for (const n of [1000, 10000, 100000]) {
    const ventas = generarVentas(n);
    const fila = { n };
    for (const [nombre, funcion] of Object.entries(funciones)) {
        if (nombre === 'clientesRecurrentes') continue; // O(n²) se mide arriba
        const args = nombre.startsWith('totalCiudad') ? ['Bogotá'] : [];
        fila[nombre + '_ms'] = medir(funcion, ventas, ...args);
    }
    extra.push(fila);
}
console.table(extra);
module.exports = { filas, extra };
```

**Desglose del código, en orden:**

1. Importa `performance` de Node, el generador y las funciones. El objeto `funciones` permite recorrer nombres y referencias. Este archivo final incluye también las mediciones de la optimización posterior.
2. `medir` recibe una función y argumentos adicionales (`...args`); registra el inicio, ejecuta la función y resta el tiempo inicial al final. `toFixed` redondea como texto y `+` lo convierte a número.
3. El primer for genera cinco tamaños; `console.time` y `console.timeEnd` miden la versión original con la misma etiqueta; también guarda tiempos Set y Map.
4. `base` toma la última fila; el segundo for proyecta con el cuadrado de la razón de tamaños (`** 2`), y convierte ms a segundos dividiendo entre 1000.
5. El bloque extra recorre tres tamaños; `Object.entries` entrega nombre y función; `continue` omite la versión lenta; `startsWith` decide si necesita ciudad.
6. `fila[nombre + "_ms"]` crea columnas dinámicas; `extra.push` guarda cada fila; `console.table` y `module.exports` muestran y comparten resultados.

### Explicación complementaria y ejemplos pequeños


```js
for (let i = 0; i < ventas.length; i++) {
    for (let j = i + 1; j < ventas.length; j++) {
        if (ventas[i].cliente === ventas[j].cliente) {
            // coincidencia
        }
    }
}
```

El primer `for` elige una venta. El segundo empieza en la **siguiente** (`j = i + 1`) y compara con las posteriores, evitando repetir parejas. Para cinco ventas: `4+3+2+1 = 10` comparaciones. Para `n`: `n * (n-1) / 2`; es O(n²).

En la función original también aparece `recurrentes.includes(cliente)`: busca si un cliente **ya está en el arreglo** para no añadirlo dos veces. `includes` también puede recorrer elementos, de modo que agrega trabajo. La función sigue siendo O(n²) en el peor caso de esta implementación, aunque el costo real puede ser mayor.

### Medir tiempos

```js
console.time("prueba");
// código a medir
console.timeEnd("prueba");
```

Las dos etiquetas `"prueba"` deben coincidir. En `benchmark.js` se usa además `performance.now()` para obtener tiempos de mayor precisión; `toFixed(3)` limita a tres decimales. La función `medir(funcion, ventas, ...args)` acepta una función, un arreglo y **argumentos adicionales**; `...args` aquí reúne los argumentos restantes, y al llamar `funcion(ventas, ...args)` los vuelve a expandir.

El archivo mide 1.000, 2.000, 4.000, 8.000 y 16.000 ventas y proyecta tamaños mayores mediante `(n / base.n) ** 2`: `**` es elevar a una potencia. No ejecuta automáticamente la versión lenta con 100.000 ventas.

**Cuidado:** los tiempos reales varían entre computadoras y ejecuciones. Las proyecciones son estimaciones, no resultados medidos.

---

## 6. MiniReto 7 — Tiempo y memoria

**Dónde:** `totalCiudadCadena` y `totalCiudadUnaPasada` en `src/analitica.js`; nuevo `src/comparar-ciudad.js`.


### Código completo — `src/analitica.js`

```javascript
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
```

**Desglose del código, en orden:**

1. `buscada` normaliza la ciudad solicitada.
2. El primer `map` copia cada objeto con `...venta` y sustituye la ciudad; los paréntesis alrededor del objeto permiten devolverlo implícitamente.
3. `filter` conserva coincidencias; el segundo `map` calcula dinero; `reduce` suma desde cero.
4. La versión de una pasada inicializa total, recorre con for...of, compara la ciudad normalizada y suma solo coincidencias. Devuelve el total sin arreglos intermedios.

### Código completo — `src/comparar-ciudad.js`

```javascript
const assert = require('node:assert/strict');
const { generarVentas } = require('./generador');
const { totalCiudadCadena, totalCiudadUnaPasada } = require('./analitica');
const ventas = generarVentas(10000);
const ciudad = 'Bogotá ';
const cadena = totalCiudadCadena(ventas, ciudad);
const pasada = totalCiudadUnaPasada(ventas, ciudad);
assert.equal(cadena, pasada);
console.log(`OK · 10.000 ventas · ${ciudad.trim()} · $${cadena.toLocaleString('es-CO')}`);
console.log('Cadena: map(n) + filter(n) + map(m) + reduce(m); 3 arreglos nuevos (n, m, m).');
console.log('Una pasada: for...of(n); 0 arreglos intermedios.');
```

**Desglose del código, en orden:**

1. Importa assert, generador y las dos versiones.
2. Genera un único arreglo de 10.000 ventas para que ambas funciones reciban exactamente la misma entrada.
3. `assert.equal` comprueba igualdad; si falla se detiene antes del mensaje OK.
4. Las últimas líneas muestran el resultado formateado y describen recorridos y arreglos.

### Explicación complementaria y ejemplos pequeños


La versión en cadena hace `map → filter → map → reduce`:
- Primer `map`: recorre **n** ventas y crea un arreglo nuevo con ciudades normalizadas.
- `filter`: revisa esas **n** ventas y crea otro arreglo de **m** coincidencias.
- Segundo `map`: revisa **m** coincidencias y crea un arreglo de **m** valores monetarios.
- `reduce`: suma esos **m** valores, sin crear otro arreglo.

Por tanto, realiza **cuatro etapas de recorrido**, pero no cuatro recorridos completos de n si m es menor: el trabajo es `n + n + m + m`, o **O(n)**. Crea **tres arreglos intermedios**, memoria adicional O(n).

`totalCiudadUnaPasada` usa un único `for...of`, acumula en `let total = 0` y no crea arreglos intermedios: tiempo O(n), memoria adicional O(1).

**Un detalle nuevo:** `({ ...venta, ciudad: ... })` crea una **copia superficial de un objeto** y reemplaza su propiedad `ciudad`. No cambia el objeto original. El operador `...` también puede copiar arreglos, pero en este caso copia propiedades de un objeto.

`comparar-ciudad.js` genera 10.000 ventas y usa `assert.equal(cadena, pasada)` para comprobar que ambas versiones calculan lo mismo.

---

## 7. MiniReto 8 — Documentar rendimiento con evidencia

**Dónde:** `RENDIMIENTO.md`, `src/perfil.js`, `bitacora.md`.


### Código completo — `src/perfil.js`

```javascript
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
```

**Desglose del código, en orden:**

1. Importa el reloj, el generador y todas las funciones mediante `A`.
2. `tareas` es un arreglo de parejas: nombre y función flecha sin parámetros. Las flechas permiten aplazar la ejecución hasta medirla.
3. Cada tarea llama al indicador con sus argumentos necesarios: una venta, todas las ventas, una ciudad, fecha o k.
4. `map` desestructura cada pareja, toma el tiempo inicial, ejecuta y devuelve un objeto con nombre y duración en ms.
5. `console.table` muestra las mediciones; `JSON.stringify` produce texto JSON para registrar los datos.

### Explicación complementaria y ejemplos pequeños


El documento `RENDIMIENTO.md` contiene la tabla de funciones, complejidad de tiempo, memoria y justificación. `perfil.js` crea 10.000 ventas y mide funciones individuales; usa `performance.now()` y `console.table()`.

**Cómo leer las complejidades de memoria:**
- O(1): usa unas pocas variables, sin crear estructuras que crezcan con n (ej.: `totalVendido`, `ventaMayor`, `totalCiudadUnaPasada`).
- O(n): crea arreglos o colecciones que pueden crecer con las entradas (ej.: `ventasPorCiudadM`, `totalCiudadCadena`, `clientesRecurrentesSet`).
- O(u): usa memoria según la cantidad de **claves únicas**, como ciudades, productos o clientes. `totalPorCiudad` es O(c) para c ciudades distintas; con solo cuatro ciudades posibles, ese costo queda acotado y se comporta como O(1) respecto a n. `topProductosPorValor` usa O(p) memoria para p productos distintos, además del resultado.

**Proyecciones:** si una función es O(n) y pasar de 10.000 a 1.000.000 multiplica n por 100, una aproximación inicial es multiplicar el tiempo por 100. Para O(n²), el factor aproximado es `100² = 10.000`. No confundas una proyección con una medición real.

**Revisión por compañero:** el requisito de pedir retroalimentación a una persona real no se puede demostrar automáticamente. Revisa en `bitacora.md` el espacio pendiente y completa la observación verdadera cuando la recibas.

---

# Día 3

## 8. MiniReto 9 — Optimización final — `Set` y `Map`

**Dónde:** `clientesRecurrentesSet`, `comprasPorCliente`, `clientesRecurrentesMap` en `src/analitica.js`; comparaciones en `src/verificar.js` y `src/benchmark.js`.


### Código completo — `src/analitica.js`

```javascript
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
```

**Desglose del código, en orden:**

1. `new Set()` crea dos conjuntos vacíos; `has` consulta si el cliente ya apareció; `add` lo guarda sin duplicados.
2. `else` guarda clientes nuevos en vistos; `return [...repetidos]` transforma el conjunto en arreglo.
3. `new Map()` crea un diccionario; `get` recupera el conteo anterior o undefined; `|| 0` inicia en cero; `set` guarda el nuevo conteo.
4. `clientesRecurrentesMap` expande el Map en parejas, filtra cantidades mayores que uno y extrae el cliente con map.

### Código completo — `src/verificar.js (bloque final de integración)`

```javascript
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
```

**Desglose del código, en orden:**

1. `esperados` contiene los tres clientes conocidos; el for ejecuta cada versión y ordena sus resultados antes de compararlos.
2. `get` comprueba las compras de C01; `generarVentas(5000)` crea la muestra.
3. `every` verifica que todos los registros cumplan la estructura; las condiciones con `&&` deben ser verdaderas simultáneamente.
4. Se calcula la respuesta original una vez y se comparan Set y Map contra ella; la prueba final comprueba las versiones por ciudad con 10.000 ventas.

### Código completo — `src/analitica.js (exportaciones finales)`

```javascript
module.exports = {
    valorVenta, totalVendido, unidadesVendidas, ventaMayor, ticketPromedio,
    ventasPorCiudad, totalVendidoM, unidadesVendidasM, ventasPorCiudadM,
    normalizarCiudad, totalPorCiudad, unidadesPorProducto, topProductosPorValor,
    ventasDelDia, totalVendidoInstrumentado, ventaMayorInstrumentada,
    totalPorCiudadInstrumentado, primeraVenta, primeraVentaInstrumentada,
    clientesRecurrentes, clientesRecurrentesSet, comprasPorCliente,
    clientesRecurrentesMap, totalCiudadCadena, totalCiudadUnaPasada
};
```

**Desglose del código, en orden:**

1. `module.exports` publica todas las funciones enumeradas. Cada nombre es una propiedad que apunta a la función del mismo nombre.
2. Los otros archivos pueden usar `require` para obtenerlas. Si agregas una función nueva y quieres importarla, inclúyela aquí.

### Explicación complementaria y ejemplos pequeños


### `Set`: lista de valores únicos

```js
const vistos = new Set();
vistos.add("C01");         // guarda "C01"
vistos.add("C01");         // no lo duplica
vistos.has("C01");         // true
vistos.size;               // 1
```

En `clientesRecurrentesSet` se usan **dos conjuntos**:
- `vistos`: clientes que aparecieron al menos una vez.
- `repetidos`: clientes que aparecieron de nuevo.

En cada venta se pregunta `vistos.has(venta.cliente)`. Si ya apareció, se añade a `repetidos`; si no, se añade a `vistos`. Al final `return [...repetidos]` convierte el `Set` en arreglo.

### `Map`: diccionario especializado

```js
const compras = new Map();
compras.set("C01", 2);      // guardar clave y valor
compras.get("C01");         // 2
compras.has("C01");         // true
compras.size;               // 1
```

`comprasPorCliente` recorre las ventas y guarda cuántas veces aparece cada cliente. `clientesRecurrentesMap` convierte ese `Map` en pares, filtra los que tienen `cantidad > 1` y con `map` extrae solo los nombres.

```js
[...comprasPorCliente(ventas)]
    .filter(([, cantidad]) => cantidad > 1)
    .map(([cliente]) => cliente);
```

`([, cantidad])` **ignora la primera posición** del par y toma la segunda. `([cliente])` toma la primera. Las consultas `Set.has` y `Map.get` suelen costar O(1) **en promedio**; recorrer n ventas cuesta O(n) esperado, con memoria O(u) para u clientes únicos. Esto evita las comparaciones entre todas las parejas de la versión original.

### Comparar resultados sin depender del orden

En `verificar.js`, las tres versiones devuelven arreglos de clientes. Se usa `.sort()` antes de comparar porque el orden de aparición puede ser distinto. `assert.deepEqual(a,b)` compara estructuras completas; `assert.equal(a,b)` compara valores simples. `assert` detiene la ejecución si una prueba falla.

---

## 9. Comandos de terminal: qué significa cada palabra

Abre la carpeta `cafe-origen-analitica` en VS Code y usa **Terminal → New Terminal**. Debes estar en la carpeta que contiene `README.md`.

```bash
node src/verificar.js
```

- `node`: ejecuta JavaScript con Node.js.
- `src/`: carpeta de código.
- `verificar.js`: archivo que ejecutará.
- Cambia el nombre del archivo para ejecutar otras pruebas:

| Comando | Qué muestra |
|---|---|
| `node src/verificar.js` | Comprobaciones y mensajes OK |
| `node src/reporte.js` | Informe de ventas y día vacío |
| `node src/medir.js` | Conteos de operaciones para varios tamaños |
| `node src/benchmark.js` | Tiempos y proyecciones; puede tardar |
| `node src/comparar-ciudad.js` | Igualdad entre cadena y una pasada |
| `node src/perfil.js` | Medición individual de funciones |

**Git, explicado:**

```bash
git status
git add .
git commit -m "docs: ampliar guia de estudio"
git push origin main
```

`git status` muestra qué cambió. `git add .` prepara cambios de la carpeta actual; revisa antes que no haya archivos privados. `git commit -m "..."` guarda una versión **local** con un mensaje. `git push origin main` intenta enviar los commits a la rama `main` del remoto llamado `origin`; necesita acceso y permisos. Un commit local **no** significa que ya se publicó en GitHub.

## 10. Cómo estudiar cada reto sin perderte

1. Busca su fila en el **mapa de archivos** de la sección 0.
2. Abre el archivo JS indicado y encuentra el nombre exacto de la función.
3. Lee el ejemplo y el desglose de sus operadores en esta guía.
4. Ejecuta el comando de prueba correspondiente.
5. Abre `bitacora.md` para ver la hipótesis, los casos borde y las evidencias.
6. Prueba con entradas pequeñas: `[]`, una venta y dos ventas. Predice el resultado **antes** de ejecutar.

**Preguntas de autoevaluación:** ¿Qué recibe un parámetro? ¿A dónde va `return`? ¿Por qué `reduce` recibe un valor inicial? ¿Qué diferencia hay entre `filter` y `map`? ¿Por qué `sort` necesita una copia? ¿Qué diferencia hay entre tiempo O(n) y memoria O(n)? ¿Por qué dos `Set` evitan comparar todos los pares?

## MiniRetos 10, 11 y 12 — pendientes de implementación

El código de esta versión llega hasta el MiniReto 9. Los retos siguientes requieren catálogo, complementos, frecuencias, ventana deslizante, dos punteros y reporte v1.0. No se presentan como implementados.
