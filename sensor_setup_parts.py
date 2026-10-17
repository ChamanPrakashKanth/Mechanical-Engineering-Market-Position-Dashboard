"""Original sensor setup and identification accessories; CPU-only geometry."""
from routing_parts import generate_meshes as export_meshes
PARTS=[]
def add(slug,title,dims,values,solid,cut,notes,refs):
 def box(b):return 'translate(['+','.join(map(str,b[:3]))+']) cube(['+','.join(map(str,b[3:]))+']);'
 PARTS.append(dict(slug=slug,title=title,dims=dims,values=values,solid=solid,cut=cut,published='2026-10-17',params='\n'.join(f'{k}={v};' for k,v in values.items()),code='difference(){union(){\n'+'\n'.join(map(box,solid))+'\n}\n'+'\n'.join(map(box,cut))+'\n}',notes=notes+' Original geometry, not a supplier replacement. All mounting apertures are rectangular slots. No physical print, optical alignment, retention, environmental, flame or electrical tests have been performed. Dimensions are nominal: measure the actual hardware and add process-specific allowance. No standards compliance or safety-rated sensing use is claimed.',refs=refs))
BANNER=[('Banner reflector mounting application context','https://www.bannerengineering.com/us/en/products/accessories/brackets/reflectors.html')]
LABEL=[('Phoenix Contact conductor and cable marking context','https://www.phoenixcontact.com/en-sg/products/conductor-and-cable-marking')]
add('industrial-photoeye-reflector-backing-bracket','Photoelectric reflector backing bracket with adjustment slots','70 × 30 × 60 mm; 4 mm walls; 6 × 40 mm upright slot',dict(width=70,depth=30,height=60,wall=4,slot_width=6),
 [('0','0','0','width','depth','wall'),('0','0','wall','width','wall','height-wall')],
 [('15','-1','32','40','wall+2','slot_width'),('12','12','-1','slot_width','12','wall+2'),('52','12','-1','slot_width','12','wall+2')],
 'A plain backing bracket for a separately selected reflector and its own fasteners. The single upright slot runs X15–55/Z32–38 mm; base slots X12–18 and X52–58/Y12–24 mm. The slotted face provides a layout surface, not a specific reflector footprint, swivel joint or tilt adjustment. No retroreflective material is included and printed plastic is not a retroreflector. Confirm optical suitability with the sensor manufacturer. Print with the underside of the base on the bed, upright vertical; review supports and layer direction.',BANNER)
add('industrial-photoeye-alignment-card-stand','Sensor alignment card stand with open top slot','70 × 35 × 14 mm; card slot 52 × 1.6 mm; two mounting slots',dict(length=70,width=35,base=4,holder_length=56,holder_width=8,holder_height=10,card_gap=1.6),
 [('0','0','0','length','width','base'),('(length-holder_length)/2','(width-holder_width)/2','base','holder_length','holder_width','holder_height')],
 [('(length-holder_length)/2+2','(width-card_gap)/2','base+2','holder_length-4','card_gap','holder_height'),('4','12','-1','3','10','base+2'),('63','12','-1','3','10','base+2')],
 'A stationary stand for a separately supplied thin setup card. Slot depth is 8 mm from the top with 2 mm material remaining under the slot. The card must be narrower than 52 mm and thinner than the measured printed gap; nominal 1.6 mm is not a guaranteed fit. It does not include a calibrated target, optical reflector or card and does not establish sensor range or accuracy. Use only for manufacturer-approved visible-light bench setup; it is not a laser beam stop or eye-protection device. Print base down with the card slot upward.',BANNER)
add('industrial-cable-tie-label-carrier','Cable tie label carrier with recessed writing field','56 × 20 × 3 mm; recessed field 36 × 14 × 0.6 mm; two 3 × 10 mm tie slots',dict(length=56,width=20,thickness=3,label_length=36,label_width=14,recess=0.6),
 [('0','0','0','length','width','thickness')],
 [('(length-label_length)/2','(width-label_width)/2','thickness-recess','label_length','label_width','recess+1'),('3','5','-1','3','10','thickness+2'),('length-6','5','-1','3','10','thickness+2')],
 'Recessed flat field for a separately supplied adhesive paper label or compatible marker, with two tie passages outside the writing area. The label field is X10–46/Y3–17 mm. Route separate soft ties through each end passage; check cable curvature, abrasion and tie tension. This is an identification carrier, not strain relief, a conductor insulator or a certified electrical marker. No cover, ink or adhesive is supplied; no durability against oils, UV or heat is established. Print broad flat underside down, recess upward.',LABEL)
SOURCE_REFERENCES={p['slug']:p['refs'] for p in PARTS}
def generate_meshes():export_meshes(PARTS)
if __name__=='__main__':generate_meshes()
