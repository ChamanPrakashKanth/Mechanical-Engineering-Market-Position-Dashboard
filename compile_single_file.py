import base64
import os
import re

VIDEO_FILES = [
    "cad-lewis-gear-bending.mp4",
    "cae-stiffness-matrix.mp4",
    "robotics-pid-control.mp4",
    "manufacturing-cpk-capability.mp4",
    "hvac-sensible-latent-loads.mp4",
    "fluid-bernoulli-conservation.mp4",
    "thermo-carnot-cycle.mp4",
    "som-mohrs-circle.mp4",
    "tom-four-bar-linkage.mp4",
    "cnc-gcode-toolpath.mp4",
    "calculus-derivative-rate.mp4",
    "linear-algebra-eigenvalues.mp4",
    "diff-eq-spring-damper.mp4",
    "mechanics-truss-equilibrium.mp4",
    "materials-iron-carbon.mp4",
    "control-bode-plot.mp4",
    "simulation-von-mises.mp4",
    "additive-3d-printing.mp4",
]

def inline_videos(js_content, workspace):
    video_dir = os.path.join(workspace, "manim_courses", "renders")
    for name in VIDEO_FILES:
        path = os.path.join(video_dir, name)
        if os.path.exists(path):
            with open(path, "rb") as f:
                data = base64.b64encode(f.read()).decode("ascii")
            token = f"manim_courses/renders/{name}"
            js_content = js_content.replace(token, f"data:video/mp4;base64,{data}")
            print(f"Inlined video: {name}")
    return js_content

def compile_single_file():
    print("Compiling single self-contained HTML file for Blogspot deployment...")
    
    workspace = os.path.dirname(os.path.abspath(__file__))
    index_path = os.path.join(workspace, "index.html")
    css_path = os.path.join(workspace, "styles.css")
    js_path = os.path.join(workspace, "app.js")
    output_path = os.path.join(workspace, "blogspot_deploy.html")
    
    if not os.path.exists(index_path) or not os.path.exists(css_path) or not os.path.exists(js_path):
        print("Error: Missing source files (index.html, styles.css, or app.js)")
        return
        
    # Read HTML
    with open(index_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
        
    # Read CSS
    with open(css_path, 'r', encoding='utf-8') as f:
        css_content = f.read()
        
    # Read JS
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()
    
    # Inline lesson videos as base64 data URIs so the single-file build is self-contained
    js_content = inline_videos(js_content, workspace)
        
    # 1. Replace the stylesheet link with the actual CSS style block
    css_link_pattern = '<link rel="stylesheet" href="styles.css">'
    style_block = f"<style>\n{css_content}\n</style>"
    html_content = html_content.replace(css_link_pattern, style_block)
    
    # 2. Replace the external javascript script tag with inline script block
    js_script_pattern = '<script src="app.js"></script>'
    script_block = f"<script>\n{js_content}\n</script>"
    html_content = html_content.replace(js_script_pattern, script_block)
    
    # Write the compiled result
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
        
    print(f"Success! Compiled Blogger-ready file written to: {output_path}")
    print("You can copy the entire text in this file and paste it directly into Blogger's 'HTML View'.")

if __name__ == "__main__":
    compile_single_file()
