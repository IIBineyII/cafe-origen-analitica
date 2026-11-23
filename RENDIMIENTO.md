# RENDIMIENTO — Café Origen v0.2

## Alcance y evidencia

Las mediciones son **una ejecución local** de Node.js v22.16.0 en un entorno de pruebas, con datos aleatorios de 10.000 ventas; varían entre equipos y ejecuciones. Los tiempos del informe son **observaciones**, no compromisos de rendimiento. `node src/perfil.js` regenera las mediciones. `node src/medir.js` cuenta operaciones (más estable que el tiempo). Para análisis de espacio se excluye el arreglo de entrada y se cuenta la memoria adicional; u = productos o clientes únicos, c = ciudades distintas.

## Tabla técnica de todas las funciones de análisis

| Función | Qué hace | Tiempo | Espacio adicional | Justificación | Medición 10.000 ventas |
|---|---|---|---|---|---|
| `valorVenta` | Multiplica cantidad y precio | O(1) | O(1) | Una multiplicación por objeto | 0.0279 ms |
| `totalVendido` | Suma ingresos con for...of | O(n) | O(1) | Visita n ventas | 0.8592 ms |
| `unidadesVendidas` | Suma cantidades | O(n) | O(1) | Una suma por venta | 0.8390 ms |
| `ventaMayor` | Busca venta máxima | O(n) | O(1) | Compara cada venta con la mejor | 0.4484 ms |
| `ticketPromedio` | Promedio de ventas válidas | O(n) | O(1) | Acumula suma y contador | 1.1922 ms |
| `ventasPorCiudad` | Suma una ciudad con ciclo | O(n) | O(1) | Examina cada ciudad; cadenas de longitud acotada | 1.8003 ms |
| `totalVendidoM` | Suma con reduce | O(n) | O(1) | Reduce visita cada venta | 0.5396 ms |
| `unidadesVendidasM` | Suma unidades con reduce | O(n) | O(1) | Reduce visita cada venta | 0.3834 ms |
| `ventasPorCiudadM` | Filtra y suma ciudad | O(n) | O(n) | Filter y map crean arreglos intermedios | 1.1545 ms |
| `totalPorCiudad` | Agrupa dinero por ciudad | O(n) promedio | O(c) | Diccionario con c ciudades distintas; O(n) si c crece con n | 1.3714 ms |
| `unidadesPorProducto` | Agrupa unidades por producto | O(n) promedio | O(u) | Diccionario con u productos distintos | 0.6696 ms |
| `topProductosPorValor` | Ordena productos por ingresos | O(n + u log u) | O(u) | Agrupa n ventas y ordena u productos; copia superficial | 1.0298 ms |
| `ventasDelDia` | Filtra fecha | O(n) | O(n) | Filter puede crear hasta n elementos | 0.4145 ms |
| `primeraVenta` | Consulta primer registro | O(1) | O(1) | Acceso directo al índice cero | 0.0355 ms |
| `clientesRecurrentes` | Encuentra clientes con pares | O(n²) | O(u) | n(n−1)/2 pares; includes añade búsqueda lineal sin cambiar cota O(n²) | 360.4514 ms |
| `clientesRecurrentesSet` | Encuentra repetidos con Set | O(n) esperado | O(u) | Dos Set y búsquedas promedio O(1) | 1.8316 ms |
| `comprasPorCliente` | Cuenta compras con Map | O(n) esperado | O(u) | Un Map de u clientes | 2.0371 ms |
| `clientesRecurrentesMap` | Extrae repetidos de Map | O(n) esperado | O(u) | Cuenta n compras y filtra u claves | 1.7920 ms |
| `totalCiudadCadena` | Ciudad con métodos encadenados | O(n) | O(n) | Dos map y filter crean 3 arreglos | 1.6921 ms |
| `totalCiudadUnaPasada` | Ciudad con ciclo único | O(n) | O(1) | Una pasada, solo acumulador | 2.0481 ms |
| `normalizarCiudad` | Limpia texto de ciudad | O(1)* | O(1)* | *Suponiendo longitud de ciudad acotada; en general O(longitud del texto) | 0.0197 ms |

**Funciones instrumentadas:** `totalVendidoInstrumentado`, `ventaMayorInstrumentada`, `totalPorCiudadInstrumentado` y `primeraVentaInstrumentada` hacen el mismo cálculo que sus versiones base; su tiempo es respectivamente O(n), O(n), O(n) esperado y O(1), y su espacio extra es O(1), O(1), O(c) y O(1). `contador` es un objeto adicional constante. La función `generarVentas(n)` tarda O(n) y crea O(n) ventas.

## Operaciones medidas (MiniReto 5)

| n | totalVendido | ventaMayor (visitas + comparaciones) | totalPorCiudad | primeraVenta |
|---:|---:|---:|---:|---:|
| 100 | 100 | 199 | 100 | 1 |
| 1.000 | 1.000 | 1.999 | 1.000 | 1 |
| 10.000 | 10.000 | 19.999 | 10.000 | 1 |
| 100.000 | 100.000 | 199.999 | 100.000 | 1 |

## Comparación original de recurrentes (MiniReto 6)

| n | Tiempo original (ms) | Set (ms) | Map (ms) |
|---:|---:|---:|---:|
| 1.000 | 6,386 | 0,935 | 0,515 |
| 2.000 | 15,870 | 0,217 | 0,815 |
| 4.000 | 73,774 | 0,616 | 1,540 |
| 8.000 | 217,723 | 3,199 | 1,190 |
| 16.000 | 1.057,752 | 4,732 | 2,883 |

Al duplicar n, las comparaciones de pares aumentan cerca de cuatro veces; el tiempo medido puede apartarse por optimizaciones del motor, calentamiento y carga. `console.time`/`console.timeEnd` están presentes en `benchmark.js`.

## Proyección para 1.000.000 de ventas

Las siguientes estimaciones usan **tiempos medidos con 10.000** multiplicados por 100 para O(n), por 10.000 para O(n²), o por 1 para O(1). No son garantías y en especial O(n + u log u) depende de cuántos productos distintos haya.

| Función | Base 10.000 | Estimación 1.000.000 |
|---|---:|---:|
| `valorVenta` | 0.0279 ms | 0.03 ms |
| `totalVendido` | 0.8592 ms | 85.92 ms |
| `unidadesVendidas` | 0.8390 ms | 83.90 ms |
| `ventaMayor` | 0.4484 ms | 44.84 ms |
| `ticketPromedio` | 1.1922 ms | 119.22 ms |
| `ventasPorCiudad` | 1.8003 ms | 180.03 ms |
| `totalVendidoM` | 0.5396 ms | 53.96 ms |
| `unidadesVendidasM` | 0.3834 ms | 38.34 ms |
| `ventasPorCiudadM` | 1.1545 ms | 115.45 ms |
| `totalPorCiudad` | 1.3714 ms | 137.14 ms |
| `unidadesPorProducto` | 0.6696 ms | 66.96 ms |
| `topProductosPorValor` | 1.0298 ms | no fija: aprox. 100–200 (depende de u)× tiempo de referencia |
| `ventasDelDia` | 0.4145 ms | 41.45 ms |
| `primeraVenta` | 0.0355 ms | 0.04 ms |
| `clientesRecurrentes` | 360.4514 ms | 3604514.00 ms |
| `clientesRecurrentesSet` | 1.8316 ms | 183.16 ms |
| `comprasPorCliente` | 2.0371 ms | 203.71 ms |
| `clientesRecurrentesMap` | 1.7920 ms | 179.20 ms |
| `totalCiudadCadena` | 1.6921 ms | 169.21 ms |
| `totalCiudadUnaPasada` | 2.0481 ms | 204.81 ms |
| `normalizarCiudad` | 0.0197 ms | 0.02 ms |

Para **clientesRecurrentes**, una segunda proyección más representativa desde la medición de 16.000 ventas (1.057,752 ms) da: 100.000 → **41,32 s**; 1.000.000 → **4.131,84 s (~68,9 min)** usando `T(n)=T(16.000)×(n/16.000)²`. Es una estimación, no una ejecución real. No se ejecutó la fuerza bruta con 100.000 ventas.

## Riesgos ordenados

1. **Clientes recurrentes original:** O(n²), domina el tiempo con grandes historiales.
2. **Top productos por valor:** O(n + u log u), requiere ordenar u productos; riesgo de memoria O(u) si crece el catálogo.
3. **Cadenas de métodos y filtros:** O(n) tiempo, O(n) memoria; las copias intermedias presionan la memoria.
4. **Agrupaciones con diccionarios / Set / Map:** O(n) tiempo esperado, O(u) o O(c) memoria; depende de claves únicas.
5. **Recorridos únicos y accesos directos:** O(n)/O(1) con memoria O(1), menor riesgo relativo.

## Plan de optimización (idea planteada en v0.2)

La versión original compara cada venta con todas las posteriores y repite búsquedas con `includes`. Se propone guardar en un `Set` los clientes vistos y en otro los repetidos, o contar compras con `Map`. Así no se repite la comparación de cada par. **La idea se documentó antes de implementar las versiones optimizadas**, que aparecen en el siguiente reto.

## Revisión por compañero

**Pendiente de validación externa.** No se ha solicitado ni recibido una observación real de un compañero; no se inventa una revisión. Para completar este requisito, pídele que revise la tabla y anota su observación y tu respuesta en `bitacora.md`.
