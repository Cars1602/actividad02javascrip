from docx import Document
from docx.shared import Inches,Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from pathlib import Path
D=Document('documento/informe_actividad_2_APA.docx')
# Actualizar el alcance de la versión final.
for p in D.paragraphs:
 if p.text.startswith('La aplicación funciona en el navegador y conserva'):
  p.text='La versión final utiliza HTML, CSS y JavaScript en el navegador, un servidor Node.js con Express y una base de datos PostgreSQL alojada en Neon. Los productos se consultan, registran y eliminan mediante una API. Los datos permanecen en la base de datos al recargar la página.'
 if p.text.startswith('El taller constituye una base funcional'):
  p.text='El taller integra programación orientada a objetos, validación de formularios y persistencia en PostgreSQL. Las capturas documentan la creación de recursos, la publicación del código y un despliegue exitoso en Render, además de la interfaz publicada con un producto registrado.'
 if p.text.startswith('Una siguiente versión puede agregar almacenamiento local'):
  p.text='Una siguiente versión puede incorporar edición de productos, autenticación y autorización. La persistencia en Neon y la confirmación de eliminación ya forman parte de la implementación. Para operaciones monetarias de producción se debe definir una estrategia de redondeo y ampliar las comprobaciones del sistema.'
 if p.text=='Vaciar la lista almacenada en memoria.':p.text='Consultar nuevamente los productos persistidos en Neon.'
intro=next(p for p in D.paragraphs if p.text=='Introducción')
toc=intro.insert_paragraph_before('Contenido','Heading 1');toc.paragraph_format.page_break_before=True
entries=['Introducción','Propósito y alcance','Objetivos específicos','Fundamentos de la solución','Organización e implementación','Validación de los campos','Manejo de eventos y eliminación','Comprobación del funcionamiento','Desarrollo e integración con Neon y Render','Limitaciones y mejoras','Ejes transversales y conclusiones','Conclusiones','Referencias']
for name in entries:
 p=intro.insert_paragraph_before(name);p.paragraph_format.first_line_indent=Inches(0)
anchor=next(p for p in D.paragraphs if p.text=='Limitaciones y mejoras')
def para(text,style=None):
 p=anchor.insert_paragraph_before(text,style);p.paragraph_format.line_spacing=2
 return p
def heading(text):return para(text,'Heading 2')
p=para('Desarrollo e integración con Neon y Render','Heading 1');p.paragraph_format.page_break_before=True
para('El desarrollo amplió el formulario inicial con una base de datos remota y un servidor que concentra las operaciones de acceso a los productos. Las figuras siguientes presentan la secuencia de creación de recursos, preparación del repositorio y publicación de la aplicación.')
heading('Persistencia de productos en PostgreSQL')
para('La tabla productos contiene un identificador generado automáticamente, nombre, precio, cantidad y fecha de creación. Las restricciones impiden nombres vacíos, precios no positivos y cantidades negativas. El servidor utiliza consultas parametrizadas para enviar los valores por separado de las instrucciones SQL.')
code=Path('schema.sql').read_text(encoding='utf-8-sig')
p=para(code);p.paragraph_format.first_line_indent=Inches(0);p.paragraph_format.line_spacing=1
for r in p.runs:r.font.name='Consolas';r.font.size=Pt(9)
heading('Comunicación entre la interfaz y el servidor')
para('ApiProductos.js utiliza fetch para comunicarse con /api/productos. GET carga la lista, POST registra un producto y DELETE /api/productos/:id elimina el registro seleccionado. ControladorProductos convierte los datos recibidos en objetos Producto y actualiza la lista después de cada operación confirmada por el servidor.')
para('Antes de eliminar se abre un cuadro de diálogo con el nombre del producto y las opciones Sí, eliminar y Cancelar. Cancelar o pulsar Escape cierra el cuadro sin enviar la solicitud DELETE. La conexión se guarda en DATABASE_URL del servidor y no se incorpora a los archivos públicos.')
heading('Preparación y publicación de la aplicación')
para('El código se publicó en GitHub y se vinculó a un servicio web en Render. La construcción utiliza npm install. El error inicial de arranque fue node: .env: not found, porque el comando exigía un archivo local ausente en el despliegue. La configuración se corrigió para recibir DATABASE_URL desde el entorno y ejecutar el servidor sin exigir ese archivo. El servidor escucha en 0.0.0.0 y utiliza el puerto indicado por PORT.')
para('Las capturas distinguen la instalación de dependencias, el despliegue y la vista final. La figura de Netlify documenta una alternativa explorada; la evidencia de publicación final corresponde a Render. El estado Live acredita el despliegue, pero no sustituye una prueba completa de todas las validaciones y operaciones.')
items=[
('143d0470-ee6d-434b-8a18-8a6d5b570d5f','Panel de proyectos de Neon','Acceso al panel desde el que se organiza la base de datos del ejercicio.'),
('4c620019-81ec-4406-9b71-cdc136287753','Creación del proyecto en Neon','Confirmación de creación del proyecto y opciones para iniciar su configuración.'),
('856df842-b9b4-45d3-a18a-231aed680876','Editor SQL de Neon','Vista inicial del editor. El código visible es el ejemplo predeterminado de Neon, no el esquema final de productos.'),
('70c2d331-3c96-4ea6-8589-748ac095e732','Acceso a GitHub','Panel utilizado para iniciar la publicación del código fuente.'),
('87a5b530-b594-430b-a575-f4443408c49c','Creación del repositorio','Formulario de creación de un repositorio para almacenar los archivos del proyecto.'),
('bf636f5b-886c-4446-889b-acad6ab48e90','Repositorio del proyecto','Repositorio actividad02javascrip creado y preparado para recibir los archivos.'),
('9f3c74cc-2c0c-4c4e-8211-830041376418','Alternativa de publicación en Netlify','Pantalla de importación explorada antes de la publicación final en Render.'),
('9a560fd4-8f40-427c-a8ba-70f240fecaa8','Proyecto en Render','Entorno inicial del proyecto actividad02 antes de agregar el servicio.'),
('cc507b1c-a0f7-46ba-bfff-119e3b50c959','Selección del servicio web','Selección de Web Services para ejecutar el servidor Node.js.'),
('39ae6286-8816-41aa-aa19-9e22bf573a3b','Vinculación de GitHub con Render','Selección del repositorio actividad02javascrip como origen del despliegue.'),
('cb44ffa0-6fbb-4cbc-977a-41a82c724d96','Instalación de dependencias','Los registros muestran npm install y la instalación de 79 paquetes en el primer intento.'),
('fe13f406-55ad-4539-8550-a8edd1e9168d','Despliegue exitoso en Render','El panel muestra Deploy succeeded y el mensaje Your service is live después de las correcciones.'),
('366aa01a-ba40-4226-a20c-855c9adaacf6','Aplicación publicada','La interfaz muestra un producto lápiz con precio Bs 2.00, cantidad 150 y total Bs 300.00.')]
for i,(uid,title,note) in enumerate(items,1):
 p=para('Figura '+str(i));p.paragraph_format.page_break_before=True;p.paragraph_format.keep_with_next=True;p.runs[0].bold=True
 p=para(title);p.runs[0].italic=True;p.paragraph_format.keep_with_next=True
 p=para('');p.paragraph_format.first_line_indent=Inches(0);p.paragraph_format.line_spacing=1
 p.add_run().add_picture(str(Path('C:/Users/Carlos/AppData/Local/Temp')/('codex-clipboard-'+uid+'.png')),width=Inches(6.5))
 para('Nota. '+note+' Captura proporcionada por el autor.')
D.save('documento/informe_actividad_2_APA_final.docx')
print('Documento guardado con 13 capturas')
