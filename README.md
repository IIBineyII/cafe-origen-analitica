# Café Origen — Motor de analítica v0.2 (con reporte v0.1)

Proyecto académico en JavaScript (Node.js, CommonJS). Analiza ventas ficticias: ingresos, unidades, ticket promedio, ciudades, productos, clientes recurrentes y rendimiento con grandes volúmenes.

## Requisitos y ejecución

Instala Node.js. No se requieren paquetes externos ni `npm install`.
Abre una terminal en la carpeta `cafe-origen-analitica` y ejecuta:

```bash
node src/explorar.js       # Ver los datos originales
node src/probar.js         # Probar funciones con casos borde
node src/verificar.js      # Pruebas automáticas: OK o error
node src/reporte.js        # Reporte de negocio v0.1
node src/medir.js          # Conteo de operaciones Big O
node src/benchmark.js      # Medición de tiempo; no corre 100.000 en fuerza bruta
node src/comparar-ciudad.js # Compara cadena vs una pasada
node src/perfil.js         # Perfil de funciones con 10.000 ventas
```

## Archivos

- `src/datos.js`: 12 ventas del Día 1, con un registro de cantidad 0 y variantes de ciudad.
- `src/analitica.js`: funciones puras de indicadores, agrupaciones, versiones instrumentadas, recurrencia y comparación espacial.
- `src/generador.js`: datos aleatorios válidos; **cada ejecución puede generar valores diferentes**.
- `src/reporte.js`: resumen, ciudades, productos, top 3 y días con/sin ventas.
- `src/verificar.js`: igualdad ciclo/métodos y pruebas de errores conocidos.
- `src/medir.js`, `src/benchmark.js`, `src/perfil.js`: operaciones y tiempos.
- `bitacora.md`: trazas, preguntas sobre colecciones, depuración, predicciones y análisis.
- `RENDIMIENTO.md`: tabla técnica, proyecciones, riesgos y plan de optimización.
- `GUIA_DE_ESTUDIO.md`: explicaciones para empezar desde cero.

## Preguntas de negocio

¿Cuánto dinero se vendió? ¿Cuántas unidades? ¿Cuál fue la venta más alta? ¿Cuál es el ticket promedio de ventas con cantidad positiva? ¿Qué ciudades y productos venden más? ¿Quiénes compraron más de una vez? ¿Qué ocurre si no hay ventas? ¿Cómo cambia el rendimiento cuando crecen los registros?

## Consideraciones

Las ciudades se normalizan quitando espacios y unificando mayúsculas/minúsculas; se presentan como Medellín, Bogotá, Cali y Pereira. `ticketPromedio([])` devuelve 0. `ventaMayor([])` devuelve `null`, pero el reporte imprime «Sin ventas». `sort` trabaja sobre una copia, sin reordenar las ventas originales. Las búsquedas `Set`/`Map` se consideran O(1) **en promedio**. Los tiempos son observaciones de una máquina, no garantías universales.

## Git

El ZIP conserva el historial Git local incluido en el RAR original y agrega commits de los retos completados. Para publicar los commits desde tu equipo, configura el remoto y ejecuta `git push origin main`. El ZIP no demuestra por sí solo que los cambios estén publicados en GitHub.
