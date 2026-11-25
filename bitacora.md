# Día 1

## Minireto #1
Diccionario de datos
Propiedades:

id: Identificador de la venta, tipo: number
fecha: Fecha con formato, tipo: string
cliente: Código del cliente, tipo: string
producto: Nombre del producto, tipo: string
ciudad: Ciudad donde se registró la venta, tipo: string
cantidad: Unidades registradas, tipo: number
precio: Precio unitario en pesos colombianos, tipo: number

Casos borde:
Ciudades: La ciudad en "Venta id:5" aparece como "medellín" a diferencia de como está escrita en el resto de ventas ("Medellín").

Cantidades: La venta "id:8" tiene precio, pero registra cero unidades. Aunque no implica que sea necesariamente un error.

Clientes repetidos: Las ventas "id:1, 4 y 11" aparecen con el mismo cliente, aunque de igual forma tampoco implica que sea un error. 

Qué aprendí: 
- Aprendí las deficiones de objeto y arrays o arreglo, y de que están compuestos estos. En el caso del objeto se usa {} y adentro van propiedades o elementos, y en el caso del arrays se usa [] y dentro de esta hay mas objetos que se dividen justamente con llaves. 

- Aprendí a exportar e importar información de un arrays y de como este está compuesto por objetos que enumeran en indices a partir de "0". En base a eso se puede llamar la información del arrays escribiendo "ventas[4]".

## Minireto #2

Traza 1: totalVendido

ID	        Valor venta	        Total acumulado
Inicial	          —	                0
1	            84.000	            84.000
2	            26.000	            110.000
3	            95.000	            205.000
4	            42.000	            247.000
5	            135.000	            382.000
6	            52.000	            434.000
7	            120.000	            554.000
8	            0	                554.000
9	            90.000	            644.000
10	            168.000	            812.000
11	            95.000	            907.000
12	            78.000	            985.000

Traza 2: ticketPromedio

ID	            ¿Válida?	Total acumulado	    Contador
Inicial	            —	          0	                0
1	                Sí	          84.000	        1
2	                Sí	          110.000	        2
3	                Sí	          205.000	        3
4	                Sí	          247.000	        4
5	                Sí	          382.000	        5
6	                Sí	          434.000	        6
7	                Sí	          554.000	        7
8	                No	          554.000	        7
9	                Sí	          644.000	        8
10	                Sí	          812.000	        9
11	                Sí	          907.000	        10
12	                Sí	          985.000	        11

Casos borde:

Caso	                                        Decisión
Arreglo vacío	                                Las funciones que suman devuelven 0.
Venta mayor sin registros	                    Devolver null, porque no existe una venta.
Ticket promedio sin ventas válidas	            Devolver 0 para evitar NaN.
Cantidad igual a cero	                        Aporta 0 al total y a las unidades; no cuenta para el ticket promedio.
Ciudades con diferentes mayúsculas o espacios	Comparar usando trim() y toLowerCase() sin modificar los datos originales.
Empate entre ventas máximas                 	Conservar la primera venta encontrada con ese valor.


Pseudocódigo:

- valorVenta: multiplicar cantidad por precio.
- totalVendido: iniciar en 0 y sumar el valor de cada venta.
- unidadesVendidas: iniciar en 0 y sumar cada cantidad.
- ventaMayor: iniciar en null y guardar la primera venta o una de mayor valor.
- ticketPromedio: sumar ventas válidas y contarlas; devolver 0 si no hay ninguna.
- ventasPorCiudad: normalizar la ciudad buscada y cada ciudad; sumar las coincidencias desde 0.

Qué aprendí:
Aprendí a recorrer arreglos con for...of, acumular valores y manejar arreglos vacíos.


## Minireto #3 — Preguntas sobre colecciones

| Función | ¿Qué recorro? | ¿Qué filtro? | ¿Qué transformo? | ¿Qué acumulo? | ¿Cómo agrupo? |
|---|---|---|---|---|---|
| totalVendidoM | Todas las ventas | Nada | Venta → cantidad × precio | Dinero | No agrupa |
| unidadesVendidasM | Todas las ventas | Nada | Extrae cantidad | Unidades | No agrupa |
| ventasPorCiudadM | Ventas | Ciudad normalizada | Venta → dinero | Dinero de ciudad | No agrupa; selecciona ciudad |
| totalPorCiudad | Ventas | Nada | Normaliza nombre de ciudad | Dinero | Diccionario por ciudad |
| unidadesPorProducto | Ventas | Nada | Obtiene producto y cantidad | Unidades | Diccionario por producto |
| topProductosPorValor | Ventas y pares de producto | slice selecciona los primeros k | Objeto → entradas; ordena | Dinero por producto | Diccionario por producto |

Traza breve: para tres ventas con valores 84.000, 26.000 y 95.000, `reduce` comienza en 0, pasa a 84.000, luego 110.000 y termina en 205.000. En `reduce`, el `return` interno entrega el acumulador a la siguiente vuelta.

Casos borde: `reduce(..., 0)` en [] da 0; `slice(0, 3)` devuelve hasta tres elementos aunque haya menos; `topProductosPorValor([], 3)` devuelve []; el arreglo de ventas no se ordena directamente.

Qué aprendí:
Aprendí a usar map, filter y reduce, agrupar datos y ordenar una copia sin alterar el arreglo original.


## Minireto #4 — Reporte y depuración

Incidente A — Bogotá duplicada
- Síntoma: aparecen grupos «Bogotá» y «Bogotá ».
- Entrada: dos ventas con `ciudad: 'Bogotá'` y `ciudad: 'Bogotá '`.
- Hipótesis: el espacio final produce claves distintas.
- Prueba: `verificar.js` agrega una venta con espacio y exige cuatro grupos y Bogotá = 302.000.
- Causa: agrupar con el texto original sin `trim()` ni normalización.
- Corrección: `normalizarCiudad` aplica `trim()` y `toLocaleLowerCase('es-CO')`, luego asigna nombre canónico.
- Resultado: prueba OK, no hay quinto grupo.

Incidente B — Ticket promedio NaN
- Síntoma: al filtrar un día sin ventas aparece NaN.
- Entrada: `ventasDelDia(ventas, '2026-10-01')` devuelve [].
- Hipótesis: división `0 / 0` por no haber ventas válidas.
- Prueba: `console.log(0 / 0)` muestra NaN; `verificar.js` exige `ticketPromedio([]) === 0`.
- Causa: calcular `total / contador` sin comprobar si contador es cero.
- Corrección: la versión conservada de Día 1 tiene `if (contador === 0) return 0`.
- Resultado: reporte imprime `$0` y «Sin ventas»; no aparece NaN ni undefined.

Depuración estratégica: imprimir `venta.ciudad`, `venta.ciudad.trim()`, `contador` y `total` antes de agrupar o dividir. En VS Code también se puede poner un breakpoint en la condición y mirar Variables.

Qué aprendí:
Aprendí a conectar archivos, presentar un reporte y comprobar las causas de errores como NaN.


# Día 2

## Minireto #5 — Predicción ANTES de medir

Si n aumenta ×10: `totalVendido` ×10 visitas; `ventaMayor` ~×10 visitas/comparaciones; `totalPorCiudad` ×10 visitas; `primeraVenta` ×1. Predicción: O(n), O(n), O(n), O(1), respectivamente.

Resultados observados:

| n | Total | Mayor (visitas + comparaciones) | Por ciudad | Primera |
|---:|---:|---:|---:|---:|
| 100 | 100 | 199 | 100 | 1 |
| 1.000 | 1.000 | 1.999 | 1.000 | 1 |
| 10.000 | 10.000 | 19.999 | 10.000 | 1 |
| 100.000 | 100.000 | 199.999 | 100.000 | 1 |

Comparación: coinciden con la predicción. `ventaMayor` hace n visitas y n−1 comparaciones para n > 0, de ahí 2n−1. No hay O(n²) en estas cuatro funciones. El objeto `contador` se pasa por referencia: modificar `contador.operaciones` dentro de la función modifica el mismo objeto que recibió el llamador.

Qué aprendí:
Aprendí a generar datos aleatorios y contar operaciones para entender cómo crece el trabajo.


## Minireto #6 — Ciclos anidados

Traza con 5 ventas: i=0 compara con j=1,2,3,4 (4); i=1 con j=2,3,4 (3); i=2 con j=3,4 (2); i=3 con j=4 (1); i=4 no compara (0). Total = 4+3+2+1 = 10.

Fórmula: `n(n−1)/2`; con 1.000 ventas son 499.500 comparaciones, con 2.000 son 1.999.000. Al duplicar n, se acerca a ×4.

| n | Tiempo original medido (ms) |
|---:|---:|
| 1.000 | 6,386 |
| 2.000 | 15,870 |
| 4.000 | 73,774 |
| 8.000 | 217,723 |
| 16.000 | 1.057,752 |

Proyección desde 16.000: `1057,752 × (100000 / 16000)^2 = 41.318,4 ms ≈ 41,3 s`; para 1.000.000, `1057,752 × (1000000 / 16000)^2 = 4.131.844 ms ≈ 68,9 min`. Son estimaciones y dependen del equipo. No se ejecutaron 100.000 ventas con fuerza bruta.

Costo oculto de `includes`: revisa hasta u clientes ya guardados (O(u)) por cada coincidencia que activa esa condición. Puede añadir trabajo importante, pero el costo total sigue acotado por O(n²) en esta implementación: a lo sumo se incorporan u clientes, y las búsquedas que no los incorporan se hacen tras encontrar una coincidencia. Una cota segura y sencilla de la implementación completa es O(n²) para los pares y búsquedas sobre una lista de longitud ≤ n, con el peor caso global todavía cuadrático para este patrón de inserciones; el coste exacto depende de distribución de clientes.

Conclusión para la gerente: con pocos registros la comparación de cada pareja es tolerable, pero al crecer el historial se repite demasiado trabajo. Duplicar ventas puede cuadruplicar el número de comparaciones. Conviene recordar clientes ya encontrados en vez de revisar todas las combinaciones.

Qué aprendí:
Aprendí que dos ciclos anidados pueden aumentar mucho el tiempo y que includes también tiene un costo.


## Minireto #7 — Complejidad espacial

`totalCiudadCadena`: map recorre n y crea arreglo n; filter recorre n y crea arreglo m; map recorre m y crea arreglo m; reduce recorre m y no crea otro arreglo. 4 etapas de recorrido, 3 arreglos intermedios, tiempo O(n+n+m+m)=O(n), memoria adicional O(n).

`totalCiudadUnaPasada`: un `for...of` recorre n, crea 0 arreglos intermedios, acumula un número. Tiempo O(n), memoria O(1). Ambas devuelven igual para 10.000 ventas generadas (prueba automatizada).

¿Por qué O(4n) = O(n)? Big O describe cómo crece el trabajo; el factor constante 4 no cambia la forma de crecimiento. Con `m ≤ n`, n+n+m+m ≤ 4n.

Memoria de funciones del motor: `valorVenta`, `totalVendido`, `unidadesVendidas`, `ventaMayor`, `ticketPromedio`, `ventasPorCiudad`, `totalVendidoM`, `unidadesVendidasM`, `primeraVenta`, `totalCiudadUnaPasada` usan O(1) memoria adicional. `ventasPorCiudadM`, `ventasDelDia`, `totalCiudadCadena` usan O(n). `totalPorCiudad` usa O(c) para c ciudades, `unidadesPorProducto` y `topProductosPorValor` O(u) para u productos. `clientesRecurrentes`, `clientesRecurrentesSet`, `comprasPorCliente`, `clientesRecurrentesMap` usan O(u) para u clientes. `generarVentas` usa O(n). Las versiones instrumentadas mantienen el espacio de sus originales y un contador O(1). Ver tabla completa y justificaciones en `RENDIMIENTO.md`.

Decisión: dejar `totalCiudadUnaPasada` como opción para el servidor de memoria limitada. La cadena es legible y útil para aprender, pero reserva arreglos temporales. Se conservan ambas versiones para comparar.

Qué aprendí:
Aprendí que dos funciones pueden tener la misma complejidad temporal y consumir distinta memoria.


## Minireto #8 — Documento técnico

`RENDIMIENTO.md` incluye tiempos y memoria, tabla con medición a 10.000, proyección a un millón, riesgos y plan de optimización. Se redactó el plan antes de implementar Set/Map como siguiente paso.

Revisión de compañero: pendiente. No se dispone de una observación auténtica de otro estudiante. Completar tras revisión externa:
- Observación recibida: ____________________
- Respuesta y cambio realizado: ____________________

Qué aprendí:
Aprendí a documentar el rendimiento con mediciones y a identificar qué función conviene optimizar primero.


# Día 3

## Minireto #9 — Método de seis fases

1. Entender: entrada = arreglo de ventas con cliente; salida = lista sin duplicados de clientes con 2 o más compras; sin modificar las ventas.
2. Ejemplos y bordes: [] → []; [C01] → []; [C01,C01] → [C01]; [C01,C02,C01,C02] → [C01,C02]. Los 12 datos originales → [C01,C02,C03].
3. Fuerza bruta: comparar pares i<j, O(n²) tiempo y O(u) memoria para la respuesta.
4. Optimizar: guardar clientes vistos en un Set; si aparece de nuevo, agregar a otro Set. Alternativa: Map cliente → número de compras.
5. Implementar: `clientesRecurrentesSet`, `comprasPorCliente` y `clientesRecurrentesMap` en `analitica.js`.
6. Probar: `verificar.js` compara las tres versiones ordenando las respuestas con los 12 datos y 5.000 ventas generadas. `benchmark.js` mide 1.000, 10.000 y 100.000 para Set y Map, pero limita fuerza bruta a 16.000.

Intercambio: Set y Map necesitan O(u) memoria para recordar clientes, a cambio de O(n) tiempo esperado. Con los 100.000 datos generados, se observaron 22,298 ms para Set y 45,677 ms para Map (una ejecución local); ambos bajo un segundo en este entorno, pero hay que volver a medir en el equipo del usuario.

Qué aprendí:
Aprendí a usar Set y Map para recordar clientes y evitar comparaciones repetidas.

## Minireto #10 — Complementos y frecuencias

Pendiente de implementación. Se requiere crear catalogo.js y agregar comboRegalo, productoEstrellaPorCiudad y primerClienteUnico.

Qué aprendí (por practicar): cómo buscar complementos y contar frecuencias con Map.

## Minireto #11 — Ventana deslizante y dos punteros

Pendiente de implementación. Se requieren mejorSemanaBruta, mejorSemana y parMasCercano, sus pruebas y trazas.

Qué aprendí (por practicar): cómo reutilizar una suma y buscar pares en un arreglo ordenado.

## Minireto #12 — Entrega v1.0

Pendiente de implementación. Se requiere integrar el reporte final, medir ambas versiones, actualizar README y RENDIMIENTO y verificar un clon limpio.

Qué aprendí (por practicar): cómo integrar y comprobar una versión final del producto.
