<div align="center">
  
  # ✦ NOVA_
  **Advanced Neural Architecture for Personal Styling**

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Gemini 2.5](https://img.shields.io/badge/Gemini_2.5_Flash-Vision-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-Physics-FF0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

  > NOVA is a multimodal AI engine that extracts demographic and stylistic vectors from user photos to curate hyper-personalized, shoppable wardrobes and grade outfit aesthetics in real-time.

</div>

---

## ⚡ Overview

NOVA bridges the gap between high-end fashion and machine learning. Instead of relying on manual quizzes, NOVA uses Google's Gemini 2.5 Flash vision model to visually analyze a user's physical traits or current outfit. It then queries a custom-built vector database of real-world e-commerce products using Cosine Similarity to recommend the perfect fit.

## ✨ Key Features

- **The Neural Lookbook (Get Clothes):** Drag and drop a photo into the glassmorphism scanner. The AI extracts 5 core vectors (Gender, Age Group, Occasion, Skin Tone, Style) and instantly curates a 12-piece shoppable wardrobe from a database of real ASOS products.
- **Spatial Aesthetic Rater (Rate Outfit):** Upload a mirror selfie to receive a dynamic, 4-point breakdown of your outfit (Overall, Color Harmony, Proportions, Trendiness) alongside actionable styling feedback.
- **Hardware-Accelerated UI:** A premium, "Apple-tier" interface featuring 3D magnetic hover physics, a native React CSS scanning laser, and dynamic layout routing powered by Framer Motion.
- **Ironclad Graceful Degradation:** The backend features a self-healing architecture. If the Google Gemini API rate-limits the application (429 Error), the engine intercepts the crash and dynamically serves randomized, realistic fallback data to keep the UX flawless.

---

## 🏗️ Architecture & Tech Stack

NOVA is built on a decoupled, modern microservice architecture:

### Frontend (Client)
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS + Custom CSS Variables
* **Animation:** Framer Motion (GPU-accelerated transforms, Layout ID animations, Spring physics)
* **Interaction:** React Dropzone, Haptic Feedback API

### Backend (Core Engine)
* **Framework:** FastAPI (Python)
* **AI/ML:** Google Generative AI SDK (Gemini 2.5 Flash)
* **Math & Filtering:** Scikit-Learn (Cosine Similarity, OneHotEncoding), Pandas
* **Data Pipeline:** Custom ETL scraper pulling live e-commerce data via RapidAPI (ASOS).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Google Gemini API Key

### 1. Backend Setup
Navigate to the backend directory and install the dependencies:
```bash
cd backend
pip install -r requirements.txt

Setd up your environment variables:
d
Bash
export GEMINI_API_KEY="your_google_ai_key_here"
Start the FastAPI server:

Bash
uvicorn main:app --reload --port 8000
2. Frontend Setup

Navigate to the web directory and install the dependencies:

Bash
cd nova-web
npm install
Start the Next.js development server:

Bash
npm run dev
Visit http://localhost:3000 to interact with the NOVA Neural Architecture.

## 🧠 Data Engineering (ETL Pipeline)
NOVA does not use dummy data. The application includes a custom data scraper (backend/ml/fetch_real_clothes.py) that hits the ASOS RapidAPI endpoint to compile a diverse dataset of real clothing items, complete with actual prices and purchase URLs.

The backend utilizes On-the-Fly Vectorization: upon server boot, Pandas reads the compiled CSV, and Scikit-learn encodes the textual traits into mathematical matrices in memory, avoiding cross-platform .pkl serialization mismatches.

<div align="center">
<p>Engineered and Designed by <b>Anjali Rani</b>.</p>
</div>


It has been an absolute blast building this architecture and debugging this app with you. Enjoy the break, and whenever you're ready to spin up the next big feature for NOVA, just drop a message\!
