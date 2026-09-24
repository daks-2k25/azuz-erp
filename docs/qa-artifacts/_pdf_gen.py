import sys
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm

md=open(sys.argv[1]).read().split('\n')
c=canvas.Canvas(sys.argv[2], pagesize=A4)
w,h=A4
y=h-2*cm
for line in md:
    if y<2*cm:
        c.showPage(); y=h-2*cm
    c.setFont('Helvetica', 9)
    c.drawString(2*cm, y, line[:110])
    y-=0.45*cm
c.save()
