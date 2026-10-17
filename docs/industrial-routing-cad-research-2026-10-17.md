# Industrial printable CAD research — 17 October 2026

## Evidence and limits
Research covered industrial sensor mounts, pneumatic tube organization, cable-carrier strain relief, printable cable combs and long-tail OpenSCAD queries. Public results establish application relevance, not monthly search volume, keyword difficulty or ranking prospects. Broad CAD terms already have supplier catalogs and established model libraries. Sparse exact-phrase results can also indicate low demand; they do not prove opportunity.

Primary application sources:
- icotek ZL cable/tubing organization: https://www.icotek.com/en-us/products/strain-relief/zl-32222
- igus cable-carrier strain-relief context: https://www.igus.com/cable-carriers/resources/energy-chains-designing-strainrelief-com
- Festo multi-tube holder product category: https://ftp.festo.com/public/PNEUMATIC/SOFTWARE_SERVICE/DataSheet/2147.html
- Turck M18 sensor bracket and supplier CAD: https://www.turck.us/en/product/A2522

Supplier CAD is strong competition for replacement hardware. The selected hypothesis is editable, dimension-specific printable bench accessories with no account requirement. No supplier geometry was copied; dimensions were independently chosen. No certified product characteristics transfer to these studies.

## Added models and search intent hypotheses
| Original study | Specific search intent | Distinguishing information |
|---|---|---|
| Four-lane machine cable tie comb | cable tie comb STL OpenSCAD | Four 10 mm channels, tie passages, rectangular mounting slots |
| Pneumatic tube routing guide | 6 mm pneumatic tube guide STL | Four 6.8 mm open channels, tie retention, explicitly not a fitting |
| Cable-carrier tie anchor plate | cable carrier tie plate STL | Six passages, 67 mm mounting-slot center spacing, no chain interface |
| Rectangular sensor strap tray | rectangular sensor mounting tray OpenSCAD | 40 × 20 mm pocket, strap passages, open cable exit |

All models have STL, editable SCAD, mesh-derived SVG, static dimension pages, application references, canonical URLs and existing catalog structured-data integration. Four pages are added to sitemap.xml. Existing library ZIP includes the files. Local CPU generation only; no runtime API/GPU.

Regenerate: python generate_cad_library.py (imports routing_parts.py).
Mesh generation checks closed edges, opposite winding, connectivity, positive volume and nondegenerate facets. No physical printing, load, pullout, flame, electrical or fatigue validation. Check fit, cable bend radius and material suitability before any use. Rounded cable contact edges should be considered in a production design.

Measure actual query impressions and clicks when Search Console data becomes available. Do not describe these hypotheses as verified high-volume or low-competition keywords.
