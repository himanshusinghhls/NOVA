import streamlit as st
from streamlit_option_menu import option_menu
import streamlit.components.v1 as components
import requests
import pandas as pd

st.set_page_config(page_title="NOVA | Style Engine", layout="wide", page_icon="⚡")
API_URL = "http://127.0.0.1:8000"

st.markdown("""
    <style>
    #MainMenu {visibility: hidden;}
    header {visibility: hidden;}
    footer {visibility: hidden;}
    .stApp { background-color: #09090B; color: #FAFAFA; font-family: 'Inter', sans-serif;}
    .main-title {
        font-size: 3.5rem; font-weight: 900; letter-spacing: -0.05em;
        background: linear-gradient(90deg, #FFFFFF, #71717A);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        margin-bottom: 0px; padding-top: 1rem;
    }
    .sub-title { font-size: 1.1rem; color: #A1A1AA; font-weight: 400; margin-bottom: 2rem; }
    .card { background-color: #18181B; padding: 20px; border-radius: 12px; border: 1px solid #27272A; }
    </style>
""", unsafe_allow_html=True)

st.markdown("<h1 class='main-title'>NOVA</h1>", unsafe_allow_html=True)
st.markdown("<p class='sub-title'>The AI infrastructure for modern personal styling.</p>", unsafe_allow_html=True)

selected = option_menu(
    menu_title=None,
    options=["Platform Overview", "Style Engine", "Vision Setup", "Fit Rater"],
    icons=["grid", "sliders", "camera", "star"],
    orientation="horizontal",
    styles={
        "container": {"background-color": "#18181B", "border": "1px solid #27272A", "border-radius": "8px", "padding": "5px"},
        "nav-link": {"font-size": "14px", "text-align": "center", "margin":"0px", "--hover-color": "#27272A"},
        "nav-link-selected": {"background-color": "#FAFAFA", "color": "#09090B", "font-weight": "700"},
    }
)

st.write("---")

if selected == "Platform Overview":
    col1, col2 = st.columns([1, 1.2])
    with col1:
        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.subheader("High-Fidelity AI Styling")
        st.write("""
        NOVA represents the next generation of fashion tech infrastructure.
        Built on a decoupled microservices architecture, it enables real-time inferences for e-commerce and retail.
        """)
        st.markdown("""
        * ⚡ **FastAPI Engine:** Sub-millisecond vector retrieval.
        * 🧠 **DeepFace & OpenCV:** Real-time demographic & color clustering.
        * 👗 **ML Pipeline:** Advanced Cosine Similarity mapping.
        """)
        st.markdown("</div>", unsafe_allow_html=True)
        
    with col2:
        spline_html = """
        <script type="module" src="https://unpkg.com/@splinetool/viewer@1.0.51/build/spline-viewer.js"></script>
        <spline-viewer url="https://prod.spline.design/iW5gB5h5D98B-Dcw/scene.splinecode" style="width: 100%; height: 450px; border-radius: 12px;"></spline-viewer>
        """
        components.html(spline_html, height=450)

elif selected == "Style Engine":
    st.subheader("Manual Inference Parameters")
    col1, col2, col3 = st.columns(3)
    with col1:
        gender = st.selectbox("Gender", ["male", "female", "unisex"])
        age_group = st.selectbox("Age Bracket", ["teen", "young_adult", "adult", "senior"])
    with col2:
        occasion = st.selectbox("Context", ["casual", "formal", "party", "sport", "streetwear"])
        skin_tone = st.selectbox("Skin Tone", ["fair", "medium", "dark", "olive", "brown"])
    with col3:
        style = st.selectbox("Aesthetic", ["minimalist", "vintage", "hypebeast", "elegant", "classic"])
        
    if st.button("Execute Query", type="primary"):
        payload = {"gender": gender, "age_group": age_group, "occasion": occasion, "skin_tone": skin_tone, "style": style}
        with st.spinner("Querying vector database..."):
            try:
                response = requests.post(f"{API_URL}/recommend", json=payload)
                if response.status_code == 200:
                    recs = pd.DataFrame(response.json()["recommendations"])
                    st.success("Retrieved 6 optimal matches.")
                    cols = st.columns(3)
                    for i, (_, row) in enumerate(recs.iterrows()):
                        with cols[i % 3]:
                            st.image(row["image_url"], use_container_width=True)
                            st.markdown(f"**{row['brand']}** | {row['item']}")
                            st.caption(f"${row['price']} - {row['color'].title()}")
                else:
                    st.error(f"Engine Error: {response.text}")
            except requests.exceptions.ConnectionError:
                st.error("Backend offline. Start Uvicorn.")

elif selected == "Vision Setup":
    st.subheader("Computer Vision Intake")
    uploaded_file = st.file_uploader("Upload subject photo...", type=["jpg", "jpeg", "png"])
    
    if uploaded_file is not None:
        col1, col2 = st.columns([1, 2])
        with col1:
            st.image(uploaded_file, use_container_width=True, caption="Input Data")
        with col2:
            with st.spinner("Processing through vision models..."):
                try:
                    files = {"file": (uploaded_file.name, uploaded_file.getvalue(), uploaded_file.type)}
                    response = requests.post(f"{API_URL}/analyze-image", files=files)
                    
                    if response.status_code == 200:
                        data = response.json()
                        st.success("Vision Analysis Complete")
                        
                        m1, m2, m3 = st.columns(3)
                        m1.metric("Detected Gender", data.get('gender', 'N/A').title())
                        m2.metric("Estimated Age", int(data.get('age', 0)))
                        with m3:
                            hex_color = data.get('dominant_color_hex', '#FFFFFF')
                            st.write("Dominant Hex")
                            st.markdown(f"<div style='width:100%;height:30px;background-color:{hex_color};border-radius:4px;border:1px solid #555;'></div>", unsafe_allow_html=True)
                            st.caption(hex_color)
                            
                        st.info("In a production app, these metrics instantly feed into the Style Engine API to generate recommendations without manual input.")
                    else:
                        st.error("Vision Processing Failed.")
                except Exception as e:
                    st.error("Backend offline.")

elif selected == "Fit Rater":
    st.subheader("OOTD Aesthetic Evaluation")
    st.write("Upload an outfit. NOVA evaluates color blocking, contrast math, and visual hierarchy.")
    uploaded_fit = st.file_uploader("Upload Outfit...", type=["jpg", "jpeg", "png"])
    
    if uploaded_fit is not None:
        col1, col2 = st.columns([1, 2])
        with col1:
            st.image(uploaded_fit, use_container_width=True)
            
        with col2:
            with st.spinner("Calculating aesthetic vectors..."):
                try:
                    files = {"file": (uploaded_fit.name, uploaded_fit.getvalue(), uploaded_fit.type)}
                    res = requests.post(f"{API_URL}/rate-outfit", files=files)
                    
                    if res.status_code == 200:
                        fit_data = res.json()
                        st.markdown(f"## Overall Score: **{fit_data['score']} / 10**")
                        st.progress(fit_data['score'] / 10.0)
                        
                        st.write("### Palette Analysis")
                        c1, c2 = st.columns(2)
                        with c1:
                            st.markdown(f"<div style='width:100%;height:50px;background-color:{fit_data['color_1']};border-radius:4px;'></div>", unsafe_allow_html=True)
                        with c2:
                            st.markdown(f"<div style='width:100%;height:50px;background-color:{fit_data['color_2']};border-radius:4px;'></div>", unsafe_allow_html=True)
                            
                        st.info(f"💡 **NOVA Insight:** {fit_data['feedback']}")
                    else:
                        st.error("Rating Engine Failed.")
                except Exception as e:
                    st.error("Backend offline.")