import { solicitar, convertir } from './ApiProductos.js';
// import trae clases exportadas por otros archivos.
// ./ significa que el archivo está en la misma carpeta.
import { Producto } from "./Producto.js";
import { ValidadorProducto } from "./ValidadorProducto.js";

export class ControladorProductos {
    constructor() {
        // Guardamos referencias a los elementos del HTML.
        this.formulario = document.getElementById("formulario");
        this.lista = document.getElementById("lista");
        this.mensaje = document.getElementById("mensaje");

        // Nombres de los campos que vamos a recorrer.
        this.campos = ["nombre", "precio", "cantidad"];

        // Arreglo que guardará los objetos Producto.
        this.productos = [];

        this.conectarEventos();
        this.cargarProductos();
    }

    // Organiza la conexión de todos los eventos.
    conectarEventos() {
        this.conectarValidacion();
        this.conectarEnvio();
        this.conectarLimpieza();
    }

    // EVENTO INPUT: se ejecuta al escribir o pegar contenido.
    conectarValidacion() {
        this.campos.forEach((campo) => {
            const entrada = document.getElementById(campo);

            entrada.addEventListener("input", () => {
                this.mensaje.textContent = "";
                this.validarCampo(campo);
            });
        });
    }

    // EVENTO SUBMIT: clic en Registrar o Enter desde un campo.
    conectarEnvio() {
        this.formulario.addEventListener("submit", (evento) => {
            // Evitamos que el navegador recargue la página.
            evento.preventDefault();

            this.registrar();
        });
    }

    conectarLimpieza() {
        const botonLimpiar = document.getElementById("limpiar");

        // EVENTO CLICK: pulsar el botón Limpiar.
        botonLimpiar.addEventListener("click", () => {
            this.limpiar();
        });

        // EVENTO KEYDOWN: pulsar una tecla dentro del formulario.
        this.formulario.addEventListener("keydown", (evento) => {
            if (evento.key === "Escape") {
                evento.preventDefault();
                this.limpiar();
            }
        });
    }

    // Valida un campo y muestra su mensaje de error.
    validarCampo(campo) {
        const entrada = document.getElementById(campo);
        const salidaError = document.getElementById("error-" + campo);

        let error = ValidadorProducto.validar(campo, entrada.value);

        // Algunos caracteres no pueden interpretarse como números.
        if (entrada.validity.badInput) {
            error = "Ingresa un número válido.";
        }

        // Usa el atributo step="0.01" del precio en el HTML.
        if (
            campo === "precio" &&
            error === "" &&
            entrada.validity.stepMismatch
        ) {
            error = "El precio admite como máximo dos decimales.";
        }

        // Mostramos el error y actualizamos el estado del input.
        salidaError.textContent = error;
        entrada.setAttribute("aria-invalid", String(error !== ""));

        return error === "";
    }

    // Comprueba todos los campos antes de registrar.
    validarFormulario() {
        let primerCampoConError = null;

        this.campos.forEach((campo) => {
            const esValido = this.validarCampo(campo);

            if (!esValido && primerCampoConError === null) {
                primerCampoConError = document.getElementById(campo);
            }
        });

        if (primerCampoConError !== null) {
            this.mensaje.textContent = "Corrige los campos indicados.";

            // Coloca el cursor en el primer campo incorrecto.
            primerCampoConError.focus();

            return false;
        }

        return true;
    }

    // Lee los inputs y devuelve un objeto con sus valores.
    obtenerDatos() {
        return {
            nombre: document.getElementById("nombre").value.trim(),
            precio: Number(document.getElementById("precio").value),
            cantidad: Number(document.getElementById("cantidad").value)
        };
    }

    // Coordina los pasos necesarios para registrar un producto.
    async cargarProductos() {
        try {
            const datos = await solicitar('');
            this.productos = datos.map(convertir);
            this.lista.replaceChildren();
            this.productos.forEach(producto => this.mostrarProducto(producto));
        } catch (error) { this.mensaje.textContent = error.message; }
    }

    async registrar() {
        if (this.guardando || !this.validarFormulario()) return;
        this.guardando = true;
        const boton = this.formulario.querySelector('[type="submit"]');
        boton.disabled = true;
        try {
            const datos = await solicitar('', {
                method: 'POST', headers: {'Content-Type':'application/json'},
                body: JSON.stringify(this.obtenerDatos())
            });
            const producto = convertir(datos);
            this.productos.push(producto);
            this.mostrarProducto(producto);
            this.limpiar();
            this.mensaje.textContent = 'Producto guardado en Neon.';
        } catch (error) { this.mensaje.textContent = error.message; }
        finally { this.guardando = false; boton.disabled = false; }
    }
    // Agrega un producto a la lista visible.
        mostrarProducto(producto) {
        const elemento = document.createElement("li");
        elemento.className = "producto";

        // Creamos un espacio para mostrar los datos.
        const texto = document.createElement("span");

        texto.textContent =
            producto.nombre +
            " | Precio: Bs " + producto.precio.toFixed(2) +
            " | Cantidad: " + producto.cantidad +
            " | Total: Bs " + producto.calcularTotal().toFixed(2);

        // Creamos un botón para este producto.
        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "boton-eliminar";
        botonEliminar.setAttribute(
            "aria-label",
            "Eliminar producto " + producto.nombre
        );

        // Al hacer clic, eliminamos este producto y su fila.
        botonEliminar.addEventListener("click", () => {
            this.eliminarProducto(producto, elemento);
        });

        // Colocamos el texto y el botón dentro de la fila.
        elemento.append(texto, botonEliminar);

        // Agregamos la fila a la lista visible.
        this.lista.appendChild(elemento);
    }
    confirmarEliminacion(producto) {
        const dialogo = document.createElement('dialog');
        dialogo.className = 'confirmacion';
        dialogo.setAttribute('aria-labelledby', 'titulo-eliminar');
        dialogo.setAttribute('aria-describedby', 'detalle-eliminar');
        const titulo = document.createElement('h2');
        titulo.id = 'titulo-eliminar';
        titulo.textContent = '¿Estás seguro de eliminar este producto?';
        const detalle = document.createElement('p');
        detalle.id = 'detalle-eliminar';
        detalle.textContent = producto.nombre;
        const formulario = document.createElement('form');
        formulario.method = 'dialog';
        formulario.className = 'botones';
        const cancelar = document.createElement('button');
        cancelar.value = 'cancelar';
        cancelar.textContent = 'Cancelar';
        cancelar.autofocus = true;
        const confirmar = document.createElement('button');
        confirmar.value = 'eliminar';
        confirmar.textContent = 'Sí, eliminar';
        confirmar.className = 'boton-eliminar';
        formulario.append(cancelar, confirmar);
        dialogo.append(titulo, detalle, formulario);
        document.body.append(dialogo);
        return new Promise(resolve => {
            dialogo.addEventListener('close', () => {
                const aceptado = dialogo.returnValue === 'eliminar';
                dialogo.remove();
                resolve(aceptado);
            }, {once: true});
            dialogo.showModal();
        });
    }

    async eliminarProducto(producto, elemento) {
        if (!await this.confirmarEliminacion(producto)) return;
        const boton = elemento.querySelector('button');
        boton.disabled = true;
        try {
            await solicitar('/' + producto.id, {method:'DELETE'});
            this.productos = this.productos.filter(item => item.id !== producto.id);
            elemento.remove();
            this.mensaje.textContent = 'Producto eliminado de Neon.';
        } catch (error) { this.mensaje.textContent = error.message; boton.disabled = false; }
    }    // Limpia los campos y errores, pero conserva los productos.
    limpiar() {
        this.formulario.reset();
        this.mensaje.textContent = "";

        this.campos.forEach((campo) => {
            const entrada = document.getElementById(campo);
            const salidaError = document.getElementById("error-" + campo);

            entrada.removeAttribute("aria-invalid");
            salidaError.textContent = "";
        });

        document.getElementById("nombre").focus();
    }
}

