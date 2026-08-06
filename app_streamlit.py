import streamlit as st
import os
import subprocess

# Set Page Config
st.set_page_config(
    page_title="MechIntel AI — Mechanical Engineering Career Intelligence",
    page_icon="⚛",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Hide Streamlit Default UI padding and enforce responsive full-height layout
st.markdown("""
<style>
    #root > div:nth-child(1) > div > div > div {
        padding: 0 !important;
        margin: 0 !important;
    }
    .main .block-container {
        padding: 0 !important;
        margin: 0 !important;
        max-width: 100% !important;
    }
    header[data-testid="stHeader"] {
        display: none !important;
    }
    footer {
        display: none !important;
    }
    iframe {
        width: 100% !important;
        border: none !important;
    }
</style>
""", unsafe_allow_html=True)

# Path definitions
workspace = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(workspace, "blogspot_deploy.html")

# Auto-compile if not exists
if not os.path.exists(html_path):
    try:
        subprocess.run(["python", "compile_single_file.py"], cwd=workspace, check=True)
    except Exception as e:
        st.error(f"Error compiling single file dashboard: {e}")

# Serves the compiled premium HTML dashboard
if os.path.exists(html_path):
    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()
    
    # Embed inside high-performance responsive container
    st.components.v1.html(html_content, height=1200, scrolling=True)
else:
    st.error("Error: Could not find compiled Blogspot HTML deployment file.")
