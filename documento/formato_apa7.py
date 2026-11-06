from docx import Document
from docx.shared import Inches,Pt,RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
D=Document('documento/informe_actividad_2_APA_final.docx')
for s in D.sections:
 s.page_width=Inches(8.5);s.page_height=Inches(11)
 s.top_margin=s.bottom_margin=s.left_margin=s.right_margin=Inches(1)
for st in D.styles:
 if st.type==1:
  st.font.name='Times New Roman';st.font.size=Pt(12);st.font.color.rgb=RGBColor(0,0,0)
  st.paragraph_format.line_spacing=2
  st.paragraph_format.space_before=Pt(0);st.paragraph_format.space_after=Pt(0)
body=False;refs=False;caption=False
for p in D.paragraphs:
 t=p.text.strip();f=p.paragraph_format
 f.space_before=Pt(0);f.space_after=Pt(0);f.line_spacing=2
 f.left_indent=Inches(0);f.right_indent=Inches(0)
 if t=='Contenido':body=True
 if t=='Referencias':refs=True
 ishead=p.style.name.startswith('Heading') or t in ('Introducción','Conclusiones','Referencias','Contenido')
 image=bool(p._p.xpath('.//w:drawing'))
 code='CREATE TABLE' in t or t.startswith('export class') or t.startswith('import {') or t.startswith('eliminarProducto(')
 f.first_line_indent=Inches(.5) if body else Inches(0)
 p.alignment=WD_ALIGN_PARAGRAPH.LEFT if body else WD_ALIGN_PARAGRAPH.CENTER
 if ishead:
  f.first_line_indent=Inches(0);f.keep_with_next=True
  p.alignment=WD_ALIGN_PARAGRAPH.CENTER if p.style.name=='Heading 1' or t in ('Introducción','Conclusiones','Referencias','Contenido') else WD_ALIGN_PARAGRAPH.LEFT
 if refs and not ishead:
  f.left_indent=Inches(.5);f.first_line_indent=Inches(-.5)
 if t.startswith('Figura '):caption=True
 if caption or image or code:
  f.first_line_indent=Inches(0)
 if image:f.line_spacing=1
 if code:f.line_spacing=1
 for r in p.runs:
  r.font.name='Consolas' if code else 'Times New Roman';r.font.size=Pt(9 if code else 12);r.font.color.rgb=RGBColor(0,0,0)
  if ishead:r.bold=True
 if t.startswith('Nota.'):caption=False
 if 'Programación orientada a objetos y manejo de eventos' in t:
  p.style='Title'
  for r in p.runs:r.bold=True;r.font.size=Pt(12)
D.save('documento/informe_actividad_2_APA_7.docx')
print('APA 7 guardado')
