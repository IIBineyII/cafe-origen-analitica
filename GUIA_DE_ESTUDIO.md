# Guía de estudio — Café Origen, desde cero

Esta guía explica **qué hace** cada reto y **por qué**. Lee los archivos `src/` en paralelo; la bitácora registra evidencias y pruebas.

## 1. Funciones, parámetros y return

Imagina una máquina de jugos: recibe fruta (parámetro), prepara algo (cuerpo), entrega el jugo (`return`).

```js
function duplicar(numero) { return numero * 2; }
const resultado = duplicar(5); // 10
```

`numero` **no necesita existir antes**: recibe `5` cuando llamas `duplicar(5)`. `return` entrega `10` al lugar donde se llamó. `console.log` solo lo muestra; no sustituye a `return`.

## 2. Arreglos y métodos — MiniReto 3

Un arreglo es una lista. `for...of` revisa sus elementos. Los métodos ofrecen otras formas de trabajar:

- `filter`: deja solo los que cumplen una condición; devuelve **otro arreglo**.
- `map`: convierte cada elemento en otro valor; devuelve **otro arreglo**.
- `reduce`: junta los valores en un acumulador. Para sumar empieza en `0`; para crear un diccionario empieza en `{}`. El `return` **interno** actualiza el acumulador, mientras que el `return` **externo** devuelve el resultado final.
- `sort((a,b) => b-a)`: ordena descendente; modifica el arreglo donde se aplica.
- `slice(0,3)`: toma los primeros tres sin modificar el arreglo original.
- `[...arreglo]`: copia superficialmente el arreglo antes de ordenar.
- `Object.entries(objeto)`: convierte `{A: 10}` en `[['A',10]]`.

```js
const valores = [10, 20, 30];
const suma = valores.reduce((acumulado, actual) => acumulado + actual, 0); // 60
```

`verificar.js` compara cada resultado del ciclo y del método; si no coinciden, muestra DIFERENTE y lanza un error.

## 3. Reporte y depuración — MiniReto 4

`require('./datos')` trae datos de otro archivo. `require('./analitica')` trae funciones exportadas por `module.exports`. El reporte usa `console.log`, `console.table` y plantillas con `${valor}` para crear un informe sin abrir el código.

**Error de Bogotá duplicada:** `'Bogotá' !== 'Bogotá '` porque el segundo texto tiene un espacio. `trim()` elimina espacios externos; `toLocaleLowerCase('es-CO')` elimina diferencias de mayúsculas. El diccionario permite presentar el nombre bien escrito.

**Error de ticket NaN:** `0 / 0` produce `NaN` (no es un número). Si no hay ventas válidas, la función debe devolver `0` antes de dividir.

**Cómo depurar:** 1) reproduce el error con datos concretos; 2) imagina una causa; 3) imprime valores con `console.log` o usa puntos de interrupción en VS Code; 4) corrige; 5) agrega una prueba que impida su regreso.

## 4. Generador, contador y Big O — MiniReto 5

`Math.random()` produce un decimal aleatorio entre 0 y 1 (sin incluir 1). `Math.floor()` redondea hacia abajo. Con ambos elegimos una ciudad, producto o cantidad de una lista fija.

`contador` es un objeto: `const c = { operaciones: 0 }`. Al pasarlo a una función, ambas partes acceden al **mismo objeto**; `c.operaciones++` registra el trabajo realizado.

Big O describe **cómo crece el trabajo** cuando aumentan los datos:

- O(1): consultar el primer elemento, aunque haya un millón.
- O(n): recorrer una vez n ventas; 10 veces más ventas implica ~10 veces más visitas.
- O(n²): comparar pares de ventas; duplicar n implica ~4 veces más comparaciones.

No confundas **operaciones contadas** con **tiempo en milisegundos**: el tiempo fluctúa por el equipo y otros procesos.

## 5. Ciclos anidados y lentitud — MiniReto 6

```js
for (let i = 0; i < ventas.length; i++) {
  for (let j = i + 1; j < ventas.length; j++) {
    // comparar dos clientes
  }
}
```

El primer ciclo escoge una venta; el segundo la compara con todas las posteriores. Para cinco ventas: `4+3+2+1=10` comparaciones. Para n: `n*(n-1)/2`.

`recurrentes.includes(cliente)` también busca dentro de una lista, así que tiene un costo adicional. En este algoritmo el número de consultas a `includes` está acotado por el número de coincidencias, y el número de clientes distintos por n; el peor caso total puede seguir siendo **O(n²)** para esta implementación (no O(n³)), aunque con un factor mayor. `console.time`/`console.timeEnd` miden tiempos reales; para 100.000 o 1.000.000 se estima a partir de mediciones previas antes de intentar ejecutarlo.

## 6. Tiempo frente a memoria — MiniReto 7

Una cadena `map → filter → map → reduce` recorre sucesivamente listas y crea tres arreglos intermedios. Su trabajo es `n+n+m+m` donde m es el número de ventas de la ciudad (m ≤ n), así que es O(n), no O(n²). La memoria extra es O(n).

Un `for...of` único suma directamente en una variable: O(n) tiempo y O(1) memoria extra. En un servidor con memoria limitada elegimos esta segunda versión. Las dos deben devolver el mismo dinero.

## 7. Informe de rendimiento — MiniReto 8

`RENDIMIENTO.md` reúne para cada función tiempo y memoria, evidencia y proyecciones. No es lo mismo una medición que una estimación: medir 10.000 ventas y multiplicar por 100 sirve como **aproximación** para O(n), pero el tiempo real puede cambiar. Para O(n²), pasar de 10.000 a 1.000.000 multiplica el trabajo por aproximadamente 10.000.

Riesgo principal: clientes recurrentes con ciclos anidados. Plan: recordar qué clientes ya vimos, en vez de comparar todas las parejas.

## 8. Set y Map — Optimización del Día 3

Un `Set` almacena valores **sin duplicados**. `vistos.has(cliente)` pregunta si ya apareció; `repetidos.add(cliente)` lo registra una sola vez.

Un `Map` almacena pares **clave → valor**: por ejemplo, `C01 → 3 compras`. `get` consulta, `set` guarda, `has` pregunta si existe.

```js
const vistos = new Set();
vistos.add('C01');
console.log(vistos.has('C01')); // true
const conteos = new Map();
conteos.set('C01', 3);
console.log(conteos.get('C01')); // 3
```

Set y Map suelen permitir búsquedas O(1) en promedio; recorrer n ventas da O(n) tiempo esperado, a cambio de O(u) memoria para u clientes únicos. Es una mejora frente a comparar todos los pares O(n²).

## 9. Orden recomendado para estudiar y probar

1. Lee `analitica.js`: identifica parámetros y `return`.
2. Ejecuta `node src/verificar.js`: observa los OK y modifica una función temporalmente para ver fallar una prueba; deshaz el cambio.
3. Ejecuta `node src/reporte.js`: observa el día sin ventas y las ciudades agrupadas.
4. Ejecuta `node src/medir.js`: compara 100, 1.000, 10.000 y 100.000.
5. Ejecuta `node src/benchmark.js`: observa que los milisegundos no crecen de forma perfectamente regular.
6. Ejecuta `node src/comparar-ciudad.js`: comprueba igualdad entre cadena y una pasada.
7. Lee `RENDIMIENTO.md` y las conclusiones de la bitácora.

### Preguntas para comprobar tu comprensión

- ¿Por qué `reduce(..., 0)` devuelve 0 con un arreglo vacío?
- ¿Por qué `ticketPromedio([])` debe comprobar el contador antes de dividir?
- ¿Qué diferencia hay entre `return` y `console.log`?
- ¿Por qué una función O(n²) suele empeorar mucho más que una O(n)?
- ¿Por qué `Set` consume memoria adicional pero ahorra tiempo?
