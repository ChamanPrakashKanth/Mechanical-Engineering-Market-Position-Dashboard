"""Optional CPU/Agg gallery render of the actual STL surfaces; requires matplotlib."""
from pathlib import Path
import matplotlib
from importlib.metadata import version
matplotlib.__version__=version('matplotlib')
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
from drone_parts import PARTS,mesh

root=Path(__file__).absolute().parent
fig=plt.figure(figsize=(15,9),facecolor='#0b151c')
fig.suptitle('DRONE ACCESSORIES / PRINTABLE STL + EDITABLE CAD',color='#edf7f3',fontsize=20,fontweight='bold',y=.97)
titles=['25 mm GPS tray','Capacitor strap cradle','Dual antenna cable guide','20 × 12 mm receiver tray','14 mm arm wire cover','20 mm strap routing bridge']
for i,(part,title) in enumerate(zip(PARTS,titles),1):
    ax=fig.add_subplot(2,3,i,projection='3d',facecolor='#0b151c')
    triangles=mesh(part)
    collection=Poly3DCollection(triangles,facecolors='#8bddc3',edgecolors='#345e59',linewidths=.25,alpha=1)
    ax.add_collection3d(collection)
    points=[p for tri in triangles for p in tri]
    low=[min(p[k] for p in points) for k in range(3)]
    high=[max(p[k] for p in points) for k in range(3)]
    center=[(low[k]+high[k])/2 for k in range(3)]
    extent=max(high[k]-low[k] for k in range(3))*.57
    ax.set_xlim(center[0]-extent,center[0]+extent);ax.set_ylim(center[1]-extent,center[1]+extent);ax.set_zlim(center[2]-extent,center[2]+extent)
    ax.set_box_aspect((1,1,1));ax.view_init(elev=34,azim=-58);ax.set_axis_off()
    ax.set_title(title,color='#edf7f3',fontsize=14,pad=0)
fig.text(.5,.025,'Original MechIntel geometry · millimetres · computational mesh checks passed · physical printing and flight testing pending',ha='center',color='#bed0d8',fontsize=11)
plt.subplots_adjust(top=.90,bottom=.07,left=.02,right=.98,wspace=.03,hspace=.05)
fig.savefig(root/'assets/cad/drone-print-preview.png',dpi=120,facecolor=fig.get_facecolor())
print('Saved CPU-rendered drone mesh gallery.')
