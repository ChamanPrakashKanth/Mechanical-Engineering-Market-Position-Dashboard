import os
import re

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
        
    # 1. Replace the stylesheet link with the actual CSS style block
    css_link_pattern = r'<link rel="stylesheet" href="styles.css">'
    style_block = f"<style>\n{css_content}\n</style>"
    html_content = re.sub(css_link_pattern, style_block, html_content)
    
    # 2. Replace the external javascript script tag with inline script block
    js_script_pattern = r'<script src="app.js"></script>'
    script_block = f"<script>\n{js_content}\n</script>"
    html_content = re.sub(js_script_pattern, script_block, html_content)
    
    # Write the compiled result
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
        
    print(f"Success! Compiled Blogger-ready file written to: {output_path}")
    print("You can copy the entire text in this file and paste it directly into Blogger's 'HTML View'.")

if __name__ == "__main__":
    compile_single_file()
