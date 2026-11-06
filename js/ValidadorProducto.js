export class ValidadorProducto {
    // static permite llamar al método sin crear un objeto:
    // ValidadorProducto.validar(...)
    static validar(campo, valor) {
        const texto = valor.trim();

        // Esta regla se aplica a todos los campos.
        if (texto === "") {
            return "Este campo es obligatorio.";
        }

        // Elegimos la validación según el campo.
        switch (campo) {
            case "nombre":
                return this.validarNombre(texto);

            case "precio":
                return this.validarPrecio(texto);

            case "cantidad":
                return this.validarCantidad(texto);

            default:
                return "Campo desconocido.";
        }
    }

    static validarNombre(nombre) {
        // La regla de nombre obligatorio ya se comprobó en validar().
        return "";
    }

    static validarPrecio(valor) {
        // Los valores de los inputs llegan como texto.
        const precio = Number(valor);

        if (!Number.isFinite(precio)) {
            return "Ingresa un precio válido.";
        }

        if (precio <= 0) {
            return "El precio debe ser mayor que cero.";
        }

        // No hay errores.
        return "";
    }

    static validarCantidad(valor) {
        const cantidad = Number(valor);

        // Acepta cero y enteros positivos dentro del rango seguro.
        if (!Number.isSafeInteger(cantidad) || cantidad < 0) {
            return "Ingresa una cantidad entera no negativa válida.";
        }

        return "";
    }
}   