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

def minify_css(css):
    # Remove comments
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
    # Remove extra spaces/newlines
    css = re.sub(r'\s+', ' ', css)
    return css.strip()

def minify_js(js):
    # Comment stripper that is aware of string literals, template literals, and
    # regex literals so it never corrupts code (multi-line template literals,
    # URLs inside strings, or regexes with quotes must be preserved verbatim).
    out = []
    i = 0
    n = len(js)
    state = "code"          # code | line | block | string | template | regex | regex_class
    quote = None
    tpl_depth = 0
    last_code = ";"         # last non-whitespace char in code output

    def expr_end(ch):
        return ch is None or ch.isalnum() or ch in ")]}._$"

    while i < n:
        c = js[i]

        if state == "line":
            if c == "\n":
                state = "code"
                out.append(c)
                last_code = c
            i += 1
            continue

        if state == "block":
            if c == "*" and i + 1 < n and js[i + 1] == "/":
                state = "code"
                i += 2
            else:
                i += 1
            continue

        if state == "string":
            out.append(c)
            if c == "\\" and i + 1 < n:
                out.append(js[i + 1])
                i += 2
                continue
            if c == quote:
                state = "code"
                last_code = c
            i += 1
            continue

        if state == "template":
            out.append(c)
            if c == "\\" and i + 1 < n:
                out.append(js[i + 1])
                i += 2
                continue
            if c == "$" and i + 1 < n and js[i + 1] == "{":
                tpl_depth += 1
                out.append(js[i + 1])
                i += 2
                continue
            if c == "}" and tpl_depth > 0:
                tpl_depth -= 1
                i += 1
                continue
            if c == "`" and tpl_depth == 0:
                state = "code"
            i += 1
            continue

        if state == "regex":
            out.append(c)
            if c == "\\" and i + 1 < n:
                out.append(js[i + 1])
                i += 2
                continue
            if c == "[":
                state = "regex_class"
                i += 1
                continue
            if c == "/":
                state = "code"
                i += 1
                while i < n and js[i].isalpha():
                    out.append(js[i])
                    i += 1
                last_code = "/"
                continue
            i += 1
            continue

        if state == "regex_class":
            out.append(c)
            if c == "\\" and i + 1 < n:
                out.append(js[i + 1])
                i += 2
                continue
            if c == "]":
                state = "regex"
            i += 1
            continue

        # ---- code state ----
        if c == "`":
            state = "template"
            tpl_depth = 0
            out.append(c)
            i += 1
            last_code = c
            continue
        if c == "'" or c == '"':
            state = "string"
            quote = c
            out.append(c)
            i += 1
            last_code = c
            continue
        if c == "/" and i + 1 < n:
            nxt = js[i + 1]
            if nxt == "/":
                state = "line"
                i += 2
                continue
            if nxt == "*":
                state = "block"
                i += 2
                continue
            if not expr_end(last_code):
                state = "regex"
                out.append(c)
                i += 1
                continue

        out.append(c)
        i += 1
        if not c.isspace():
            last_code = c

    return "".join(out)

def compile_safe():
    print("Compiling Blogger-safe self-contained HTML...")
    
    workspace = os.path.dirname(os.path.abspath(__file__))
    index_path = os.path.join(workspace, "index.html")
    css_path = os.path.join(workspace, "styles.css")
    js_path = os.path.join(workspace, "app.js")
    output_path = os.path.join(workspace, "blogspot_deploy_safe.html")
    
    if not os.path.exists(index_path) or not os.path.exists(css_path) or not os.path.exists(js_path):
        print("Error: Missing source files")
        return
        
    with open(index_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
        
    with open(css_path, 'r', encoding='utf-8') as f:
        css_content = f.read()
        
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()
    
    min_css = minify_css(css_content)
    min_js = minify_js(js_content)
    
    # Inline lesson videos as base64 data URIs after minification so the giant base64
    # strings never pass through the comment-stripping logic.
    min_js = inline_videos(min_js, workspace)
    
    # Replace stylesheets and script links
    css_link_pattern = '<link rel="stylesheet" href="styles.css">'
    style_block = f"<style>{min_css}</style>"
    html_content = html_content.replace(css_link_pattern, style_block)
    
    js_script_pattern = '<script src="app.js"></script>'
    script_block = f"<script>{min_js}</script>"
    html_content = html_content.replace(js_script_pattern, script_block)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
        
    print(f"Success! Blogger-safe deployment file written to: {output_path}")

if __name__ == "__main__":
    compile_safe()
