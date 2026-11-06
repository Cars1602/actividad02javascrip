import fs from 'node:fs/promises';
import {Presentation,PresentationFile} from 'file:///C:/Program%20Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1104-1290-0_26.1104.1290.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';
const p=Presentation.create({slideSize:{width:1280,height:720}});
const slides=[
['Registro de productos','Programación orientada a objetos\ny base de datos en la nube\n\nCarlos Ademar Suarez\nDiseño Web 2 · UPDS',null],
['Objetivos del proyecto','Objetivo general\nDesarrollar una aplicación web con validación, almacenamiento en Neon y publicación en Render.\n\nObjetivos específicos\nOrganizar el código en clases y módulos.\nGestionar productos mediante una API.\nConfirmar la eliminación y conservar los datos.',null],
['Marco teórico','Las clases agrupan datos y métodos.\n\nLos eventos conectan las acciones del usuario con el programa.\n\nEl servidor procesa las solicitudes HTTP.\n\nPostgreSQL conserva los registros en una tabla.',null],
['Organización del código','Producto.js representa cada producto.\n\nValidadorProducto.js comprueba los campos.\n\nControladorProductos.js coordina la interfaz.\n\nApiProductos.js comunica con el servidor.\n\nserver.js conecta con PostgreSQL.',null],
['Formulario y validación','Nombre obligatorio.\nPrecio mayor que cero, con dos decimales.\nCantidad entera no negativa.\n\nEl total multiplica precio por cantidad.\n\nEnter registra y Escape limpia.','366aa01a-ba40-4226-a20c-855c9adaacf6'],
['Base de datos en Neon','Creamos el proyecto en Neon.\n\nLa tabla productos guarda id, nombre, precio, cantidad y fecha.\n\nLas restricciones protegen la integridad de los datos.','4c620019-81ec-4406-9b71-cdc136287753'],
['Conexión y operaciones','GET consulta los productos.\nPOST guarda un producto.\nDELETE elimina por identificador.\n\nEl servidor usa consultas parametrizadas.\nDATABASE_URL guarda la conexión fuera del navegador.', '856df842-b9b4-45d3-a18a-231aed680876'],
['Eliminación con confirmación','Al pulsar Eliminar, el cuadro muestra el nombre del producto.\n\nSí, eliminar envía la solicitud al servidor.\n\nCancelar o Escape conserva el registro.\n\nLa interfaz se actualiza al confirmar la respuesta.',null],
['Publicación en GitHub y Render','Subimos el código a GitHub.\n\nVinculamos el repositorio a Render.\n\nConfiguramos npm install, el comando de inicio y DATABASE_URL.\n\nEl servidor escucha en 0.0.0.0 y utiliza PORT.','39ae6286-8816-41aa-aa19-9e22bf573a3b'],
['Resultado y conclusiones','Render confirmó el despliegue exitoso.\n\nLa aplicación integra interfaz, servidor y base de datos.\n\nNeon permite recuperar los productos al recargar.\n\nPróximas mejoras: edición y acceso con usuarios.','fe13f406-55ad-4539-8550-a8edd1e9168d']
];
function text(s,t,x,y,w,h,size,color='#E7EDF7',bold=false){const a=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});a.text=t;a.text.style={fontFamily:'Arial',fontSize:size,color,bold};return a;}
for(let i=0;i<slides.length;i++){
 const [title,body,img]=slides[i];const s=p.slides.add();s.background.fill='#101C30';
 text(s,title,60,45,1150,95,i===0?52:40,'#FFFFFF',true);
 text(s,body,60,170,img?410:1100,480,img?24:29);
 if(img){const b=await fs.readFile('C:/Users/Carlos/AppData/Local/Temp/codex-clipboard-'+img+'.png');s.images.add({blob:b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),contentType:'image/png',alt:title,fit:'contain',position:{left:500,top:170,width:720,height:440}});text(s,'Captura del desarrollo del proyecto',500,625,700,30,16,'#94ADC8');}
 text(s,String(i+1).padStart(2,'0')+' / 10',1120,672,100,25,16,'#94ADC8');
}
await (await PresentationFile.exportPptx(p)).save('documento/presentacion_build/candidate.pptx');
for(let i=0;i<p.slides.items.length;i++){const b=await p.export({slide:p.slides.items[i],format:'png',scale:.8});await fs.writeFile('documento/presentacion_build/slide-'+(i+1)+'.png',new Uint8Array(await b.arrayBuffer()));}
console.log('Exportadas 10 diapositivas');
