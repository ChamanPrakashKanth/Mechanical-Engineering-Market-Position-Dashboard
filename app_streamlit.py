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

# Hide Streamlit Default UI padding
st.markdown("""
<style>
    .reportview-container .main .block-container {
        padding-top: 0rem;
        padding-bottom: 0rem;
        padding-left: 0rem;
        padding-right: 0rem;
    }
    iframe {
        border-radius: 12px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
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
    st.components.v1.html(html_content, height=950, scrolling=True)
else:
    st.error("Error: Could not find compiled Blogspot HTML deployment file.")
