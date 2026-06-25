import os
import re

def minify_css(css):
    # Remove comments
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
    # Remove extra spaces/newlines
    css = re.sub(r'\s+', ' ', css)
    return css.strip()

def minify_js(js):
    # Remove multi-line comments
    js = re.sub(r'/\*.*?\*/', '', js, flags=re.DOTALL)
    
    lines = js.split('\n')
    cleaned_lines = []
    
    # Pre-clean lines to filter out comments and empty entries
    raw_lines = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        # Skip single-line comments
        if line.startswith('//'):
            continue
        
        # Remove trailing comments if they are not part of URLs
        if '//' in line:
            parts = line.split('//')
            if len(parts) > 1:
                # If first part ends with 'http:' or 'https:', keep it as URL
                if parts[0].strip().endswith('http:') or parts[0].strip().endswith('https:'):
                    pass
                else:
                    line = parts[0].strip()
                    
        if line:
            raw_lines.append(line)
            
    # Process lines with a peek ahead
    for i, line in enumerate(raw_lines):
        next_line = raw_lines[i + 1] if i + 1 < len(raw_lines) else ""
        
        # Standard delimiters that block semicolons
        ends_with_delim = (
            line.endswith(';') or line.endswith('{') or line.endswith('}') or 
            line.endswith(',') or line.endswith('[') or line.endswith(']') or 
            line.endswith(':') or line.endswith('.') or line.endswith('&&') or 
            line.endswith('||') or line.endswith('+') or line.endswith('-') or 
            line.endswith('?') or line.endswith('=>')
        )
        
        # Semicolon should not be appended if the next line starts with a closing delimiter
        is_closing_next = (
            next_line.startswith('}') or next_line.startswith(']') or 
            next_line.startswith(')') or next_line.startswith('.') or
            next_line.startswith(',') or next_line.startswith(';')
        )
        
        if not ends_with_delim and not is_closing_next:
            # Avoid appending semicolons after control flow headers like if, while, for
            is_control_header = (
                line.startswith('if') or line.startswith('else if') or 
                line.startswith('for') or line.startswith('while') or 
                line.startswith('function') or line.startswith('catch')
            ) and line.endswith(')')
            
            if not is_control_header:
                line += ';'
                
        cleaned_lines.append(line)
            
    return " ".join(cleaned_lines)

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
