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