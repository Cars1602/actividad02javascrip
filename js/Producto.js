// export permite usar esta clase desde otros archivos.
export class Producto {
    // El constructor se ejecuta al crear un producto con new.
    constructor(nombre, precio, cantidad) {
        // this hace referencia al objeto que estamos creando.
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
    }

    // Método que calcula el valor total del producto.
    calcularTotal() {
        return this.precio * this.cantidad;
    }
}