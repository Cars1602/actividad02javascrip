from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
p='documento/informe_actividad_2.docx'
d=Document(p)
for s in d.sections:
 s.page_width=Inches(8.5); s.page_height=Inches(11)
 s.top_margin=s.bottom_margin=s.left_margin=s.right_margin=Inches(1)
 h=s.header.paragraphs[0]; h.alignment=WD_ALIGN_PARAGRAPH.RIGHT
 f=OxmlElement('w:fldSimple'); f.set(qn('w:instr'),'PAGE'); h._p.append(f)
for st in d.styles:
 if st.type==1:
  st.font.name='Times New Roman'; st.font.size=Pt(12); st.font.color.rgb=RGBColor(0,0,0)
  st.paragraph_format.line_spacing=2
  st.paragraph_format.space_before=Pt(0); st.paragraph_format.space_after=Pt(0)
refs=False; intro=False
for p in list(d.paragraphs):
 t=p.text.strip()
 if not t and not p._p.xpath('.//w:drawing'):
  p._element.getparent().remove(p._element); continue
 pf=p.paragraph_format
 pf.line_spacing=2; pf.space_before=Pt(0); pf.space_after=Pt(0)
 pf.page_break_before=False; pf.widow_control=True
 for r in p.runs:
  r.font.name='Times New Roman'; r.font.size=Pt(12); r.font.color.rgb=RGBColor(0,0,0)
 if t=='Introducción': intro=True; pf.page_break_before=True
 if t=='Referencias': refs=True; pf.page_break_before=True
 heading=p.style.name.startswith('Heading') or t in ['Introducción','Referencias','Conclusiones']
 if heading:
  pf.first_line_indent=Inches(0); pf.keep_with_next=True
  p.alignment=WD_ALIGN_PARAGRAPH.CENTER if p.style.name in ['Heading 1'] or t in ['Introducción','Referencias','Conclusiones'] else WD_ALIGN_PARAGRAPH.LEFT
  for r in p.runs:r.bold=True
 elif not intro:
  p.alignment=WD_ALIGN_PARAGRAPH.CENTER; pf.first_line_indent=Inches(0)
 elif refs:
  p.alignment=WD_ALIGN_PARAGRAPH.LEFT; pf.left_indent=Inches(.5); pf.first_line_indent=Inches(-.5)
 else:
  p.alignment=WD_ALIGN_PARAGRAPH.LEFT; pf.first_line_indent=Inches(.5)
 if t=='Materia:Diseño Web 2':p.text='Diseño Web 2'
for table in d.tables:
 for row in table.rows:
  for cell in row.cells:
   for p in cell.paragraphs:
    p.paragraph_format.line_spacing=2
    for r in p.runs:r.font.name='Times New Roman';r.font.size=Pt(12)
d.save('documento/informe_actividad_2_APA.docx')
print('Guardado')
