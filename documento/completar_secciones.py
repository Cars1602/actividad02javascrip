from docx import Document
from docx.shared import Inches,Pt
D=Document('documento/informe_actividad_2_APA_7.docx')
ps=D.paragraphs
anchor=ps[121]._p
for p in ps[20:83]:anchor.addprevious(p._p)
ps=D.paragraphs
for p in ps:
 if p.text=='Fundamentos de la solución':p.text='Marco teórico'
a=next(p for p in D.paragraphs if p.text=='Objetivos específicos' and p.style.name=='Heading 1')
h=a.insert_paragraph_before('Objetivo general','Heading 1')
p=a.insert_paragraph_before('Desarrollar una aplicación web de registro de productos mediante programación orientada a objetos y manejo de eventos en JavaScript, con validación de datos, persistencia en PostgreSQL mediante Neon y publicación en Render, para gestionar el registro, la consulta y la eliminación de productos desde una interfaz accesible.')
p.paragraph_format.first_line_indent=Inches(.5)
# Añadir objetivos de la ampliación antes del marco teórico.
a=next(p for p in D.paragraphs if p.text=='Marco teórico' and p.style.name=='Heading 1')
for t in ['Implementar una API con Node.js y Express para consultar, registrar y eliminar productos mediante consultas parametrizadas.','Configurar la base de datos PostgreSQL en Neon con restricciones de integridad para nombre, precio y cantidad.','Incorporar una confirmación de eliminación que permita aceptar o cancelar la operación antes de modificar la base de datos.','Publicar la aplicación desde GitHub en Render y documentar la configuración y las evidencias del despliegue.']:
 a.insert_paragraph_before(t,'List Bullet')
a.insert_paragraph_before('El marco teórico reúne los conceptos que sustentan la estructura del programa y la relación entre la interfaz, el servidor y la base de datos. Estos fundamentos permiten explicar cómo se representan los productos, cómo se procesan las acciones del usuario y cómo se conserva la información.')
# Ampliar los fundamentos antes de la implementación.
a=next(p for p in D.paragraphs if p.text=='Organización e implementación' and p.style.name=='Heading 1')
for title,text in [('Eventos y actualización del DOM','Un evento representa una acción detectada por el navegador, como escribir, enviar un formulario o pulsar un botón. addEventListener permite asociar una función a esa acción. El DOM representa los elementos del documento y permite actualizar los mensajes y la lista sin recargar toda la página (MDN Web Docs, s. f.-b).'),('Arquitectura cliente servidor','La interfaz recoge los datos y envía solicitudes HTTP al servidor. El servidor comprueba los valores, ejecuta las operaciones de datos y devuelve una respuesta. Esta separación concentra las credenciales y el acceso a PostgreSQL fuera del navegador.'),('Base de datos relacional e integridad','Los productos se organizan en filas de una tabla. La clave primaria identifica cada registro, mientras que las restricciones NOT NULL y CHECK establecen condiciones de integridad. El tipo NUMERIC permite almacenar el precio con dos posiciones decimales. Neon aloja la base de datos utilizada por el proyecto.'),('API y persistencia de información','La API define las rutas de comunicación entre las partes del sistema. GET consulta los productos, POST crea un registro y DELETE elimina el registro identificado. La persistencia permite recuperar la información después de recargar la interfaz, a diferencia del arreglo temporal de la versión inicial.')]:
 a.insert_paragraph_before(title,'Heading 2');a.insert_paragraph_before(text)
# Mantener el contenido solicitado alineado con las secciones.
a=next(p for p in D.paragraphs if p.text=='Objetivos específicos' and p.style.name=='Normal')
a.insert_paragraph_before('Objetivo general')
for p in D.paragraphs:
 if p.text in ['Clases y objetos','Módulos y separación de responsabilidades']:p.style='Heading 2'
 f=p.paragraph_format;f.space_before=Pt(0);f.space_after=Pt(0)
 if p.style.name.startswith('Heading'):
  f.first_line_indent=Inches(0);f.keep_with_next=True
D.save('documento/informe_actividad_2_APA_7_completo.docx')
