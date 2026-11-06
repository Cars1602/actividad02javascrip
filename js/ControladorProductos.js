import { solicitar, convertir } from './ApiProductos.js';
// import trae clases exportadas por otros archivos.
// ./ significa que el archivo está en la misma carpeta.
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
                method: 'POST', headers: { 'Content-Type': 'application/json' },
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
    // Copia el diseño del HTML y coloca los datos del producto.
    mostrarProducto(producto) {
        const plantilla = document.getElementById('plantilla-producto');
        const elemento = plantilla.content.firstElementChild.cloneNode(true);

        elemento.querySelector('[data-nombre]').textContent = producto.nombre;
        elemento.querySelector('[data-precio]').textContent = producto.precio.toFixed(2);
        elemento.querySelector('[data-cantidad]').textContent = producto.cantidad;
        elemento.querySelector('[data-total]').textContent = producto.calcularTotal().toFixed(2);

        const boton = elemento.querySelector('[data-eliminar]');
        boton.setAttribute('aria-label', boton.textContent + ' ' + producto.nombre);
        boton.addEventListener('click', () => this.eliminarProducto(producto, elemento));
        this.lista.appendChild(elemento);
    }

    // El cuadro y sus botones están escritos en index.html.
    confirmarEliminacion(producto) {
        const dialogo = document.getElementById('confirmar-eliminar');
        if (dialogo.open) return Promise.resolve(false);
        document.getElementById('detalle-eliminar').textContent = producto.nombre;
        dialogo.returnValue = 'cancelar';

        return new Promise(resolve => {
            dialogo.addEventListener('close', () => {
                resolve(dialogo.returnValue === 'eliminar');
            }, { once: true });
            dialogo.showModal();
        });
    }

    async eliminarProducto(producto, elemento) {
        if (!await this.confirmarEliminacion(producto)) return;
        const boton = elemento.querySelector('button');
        boton.disabled = true;
        try {
            await solicitar('/' + producto.id, { method: 'DELETE' });
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

