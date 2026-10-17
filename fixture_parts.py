"""Original printable fixture studies. No supplier geometry or certified performance."""
from routing_parts import generate_meshes as export_meshes
PARTS=[]
def add(slug,title,dims,values,solid,cut,notes):
 def box(b):return 'translate(['+','.join(map(str,b[:3]))+']) cube(['+','.join(map(str,b[3:]))+']);'
 PARTS.append(dict(slug=slug,title=title,dims=dims,values=values,solid=solid,cut=cut,published='2026-10-17',params='\n'.join(f'{k}={v};' for k,v in values.items()),code='difference(){union(){\n'+'\n'.join(map(box,solid))+'\n}\n'+'\n'.join(map(box,cut))+'\n}',notes=notes+' All apertures are rectangular slots, not modeled threads. Dimensions are nominal and require printer-specific fit allowance. These original studies have not been physically printed or tested for holding force, accuracy, creep, temperature, coolant resistance or wear. Use for bench layout and fit evaluation only; no powered machining or load rating is established. Check the actual assembly and material before use.'))
add('industrial-bench-vise-jaw-cover-100mm','100 mm bench vise jaw cover with top lip','100 × 16 × 28 mm; 4 mm face and top lip; 12 mm lip overhang',dict(length=100,depth=16,height=28,wall=4),
 [('0','0','0','length','wall','height'),('0','0','height-wall','length','depth','wall')],[],
 'One L-shaped cover with a plain contact face, no magnets or snap latch. Print two copies for opposing jaws. The 12 mm overhang is an open backing space, not a validated fit to a particular vise. The original steel jaws must remain installed. It does not attach securely by itself: check retention and interference. Use only for light manual positioning trials, not hammering, grinding or powered cutting. Print on the exterior broad contact face: rotate the model 90 degrees about X so the L section opens upward; confirm bed contact in your slicer.')
add('industrial-assembly-corner-locating-nest','90 degree assembly corner locating nest with relief','80 × 80 × 20 mm; 4 mm floor and fences; 4 × 4 mm inside-corner relief',dict(length=80,width=80,base=4,fence=4,height=20),
 [('0','0','0','length','width','base'),('0','0','base','fence','width','height-base'),('0','0','base','length','fence','height-base')],
 [('0','0','base','fence+4','fence+4','height'),('16','55','-1','6','14','base+2'),('55','16','-1','14','6','base+2')],
 'Two perpendicular reference fences locate the corner of a rectangular workpiece during a manual assembly layout. The 8 × 8 mm cut at the fence intersection supplies 4 mm relief beyond each inside fence face (X/Y=4). This avoids relying on a printed sharp internal corner. Mounting slots X16–22/Y55–69 and X55–69/Y16–22 accept separately selected fixtures. No clamp is included and squareness is not calibrated. Print floor down, fences upward; inspect fence flatness and actual squareness.')
add('industrial-slotted-assembly-fixture-base','Slotted assembly fixture base with fixed end fence','100 × 70 × 20 mm; 6 mm floor; two 6 × 76 mm slots',dict(length=100,width=70,base=6,fence=4,height=20,slot_width=6),
 [('0','0','0','length','width','base'),('0','0','base','fence','width','height-base')],
 [('12','15','-1','76','slot_width','base+2'),('12','45','-1','76','slot_width','base+2')],
 'Two X-direction through slots run X12–88 mm with centerlines Y18 and Y48 mm. The fence inside face is X4. Pair with the separately downloadable adjustable stop block and separately selected bolts, washers and nuts. Mount on standoffs or another surface that leaves access below the slots. The plate is not a precision tooling plate and the slots are not T-slots. Print floor down, fence upward; check floor flatness and washer bearing area.')
add('industrial-adjustable-assembly-stop-block','Adjustable assembly stop block with slotted foot','24 × 30 × 20 mm; 6 mm foot; 6 × 22 mm adjustment slot',dict(length=24,width=30,base=6,fence=4,height=20,slot_width=6),
 [('0','0','0','length','width','base'),('0','0','base','fence','width','height-base')],
 [('10','4','-1','slot_width','22','base+2')],
 'Single L-shaped movable stop for manual fixture layouts. The foot slot runs X10–16/Y4–26 mm; the upright reference face is X4. Position its slot over either long slot of the matching fixture base and use a separately selected bolt plus washers and nut. No fastener is included; ensure washer diameter bridges both 6 mm slots and the bolt length suits the 12 mm combined nominal floors. One bolt does not prevent rotation: align and independently secure the stop before use. Print foot down, fence upward.')
REFS=[('Formlabs: jigs, fixtures and manufacturing aids','https://formlabs.com/support/Jigs-fixtures-and-manufacturing-aids/'),('Carr Lane: fixture and jig context','https://www.carrlane.com/product/jig-fixture')]
SOURCE_REFERENCES={p['slug']:REFS for p in PARTS}
def generate_meshes():export_meshes(PARTS)
if __name__=='__main__':generate_meshes()
