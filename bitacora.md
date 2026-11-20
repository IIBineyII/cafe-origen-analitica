Minireto #1
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

Que aprendí: 
- Aprendí las deficiones de objeto y arrays o arreglo, y de que están compuestos estos. En el caso del objeto se usa {} y adentro van propiedades o elementos, y en el caso del arrays se usa [] y dentro de esta hay mas objetos que se dividen justamente con llaves. 

- Aprendí a exportar e importar información de un arrays y de como este está compuesto por objetos que enumeran en indices a partir de "0". En base a eso se puede llamar la información del arrays escribiendo "ventas[4]".

Minireto #2

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

Minireto #3

Qué aprendí
- filter selecciona los elementos que cumplen una condición, por ejemplo, ventas cuya cantidad sea mayor que cero. 
- map crea un nuevo array transformando cada elemento, Por ejemplo, convertir objetos de ventas en sus valores monetarios. 
- reduce combina los elementos para obtener un resultado, como una suma o un objeto agrupado. 
- sort es para ordernar los elementos siguiendo una función de comparación. 
- slice devuelve una porción del array sin modificar el original.