// export permite usar esta clase desde otros archivos.
export class Producto {
    constructor(nombre, precio, cantidad) {
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
    }

    // Método que calcula el valor total del producto.
    calcularTotal() {
        return this.precio * this.cantidad;
    }
}