import { Producto } from './Producto.js';
export async function solicitar(ruta, opciones) {
 const respuesta = await fetch('/api/productos' + ruta, opciones);
 if (!respuesta.ok) { const datos=await respuesta.json(); throw new Error(datos.error || 'No se pudo completar la operación.'); }
 if(respuesta.status===204)return;
 return respuesta.json();
}
export function convertir(datos) {
 const producto=new Producto(datos.nombre,Number(datos.precio),Number(datos.cantidad));
 producto.id=datos.id;
 return producto;
}
