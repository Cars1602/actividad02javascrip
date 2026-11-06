import zipfile,lxml.etree as E
src=r'C:/Users/Carlos/Downloads/Programacion-orientada-a-objetos-y-eventos-en-JavaScript.pptx'
out='documento/Presentacion_mejorada_contenido_conclusiones_IA.pptx'
changes={
'ppt/slides/slide2.xml':{'Introducción':'El proyecto','Propósito, objetivos y alcance':'Registro y gestión de productos','Marco teórico':'Cómo funciona','Clases, módulos, eventos':'Clases, validación y eventos','Implementación':'Conexión y publicación','Validación, API, BD, despliegue':'Neon, GitHub y Render'},
'ppt/slides/slide10.xml':{'Conclusiones y siguientes pasos':'Conclusiones y apoyo de la IA','Resumen':'Lo que logramos','OOP + eventos + validación + persistencia funcionan juntos':'Creamos una aplicación que registra y elimina productos.','Mejoras':'Lo que aprendimos','Editar productos, autenticación, redondeo y pruebas completas':'Aplicamos clases y eventos, y guardamos los datos en Neon.','Recordatorio':'Prompt usado para pedir ayuda','Git/GitHub para control; Render despliega; Neon almacena datos':'Ayúdame a crear un registro de productos con JavaScript y Neon.','Pide ejemplos de código o demostración en vivo si quieres.':'Explica el código paso a paso y ayúdame a corregir errores.'}}
with zipfile.ZipFile(src) as zin,zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as zout:
 for item in zin.infolist():
  data=zin.read(item.filename)
  if item.filename in changes:
   x=E.fromstring(data)
   for t in x.xpath('//*[local-name()="t"]'):
    if t.text in changes[item.filename]:t.text=changes[item.filename][t.text]
   data=E.tostring(x,xml_declaration=True,encoding='UTF-8',standalone=True)
  zout.writestr(item,data)
print(out)
