# 🎯 Goal for Prototype

Build a Digital Mental Health Platform (Web + optional mobile) with core unique features:

- Emotion-aware Venting (speech + text)  
- AI Early-Warning Risk Dashboard (admin)  
- Crisis Prediction & Safety Net  

---

# 🛠️ Prototype Scope (What to Build in Hackathon)

## Student Side (Frontend)

### Landing Page / Dashboard
- Simple UI (login/signup, anonymous option).  
- Sections: Vent It Out, Resources, Booking (basic), Peer Support.  

### Vent It Out (Core Feature)
- Input options: Text box + Voice recording (30s–1 min).  
- Backend runs sentiment/emotion analysis → returns:  
  - Emotion categories (stress, sadness, joy, anger, fear).  
  - Short personalized coping response (breathing, journaling, self-care).  

### Crisis Detection
If high-risk keywords/emotions detected →  
1. Show grounding exercise (breathing audio, relaxation gif).  
2. Suggest counsellor booking.  
3. Show emergency helpline **and alert the admin on its admin dashboard**.  

---

## Admin Side (Frontend)

### Anonymous Dashboard
- View only collective data, no student names.  
- Heatmap / bar graph: Weekly trend of stress, anxiety, depression.  
- Alerts: *“Spike detected in Year 2 before exams.”*  

---

## Backend (AI & Data Layer)

### Emotion Analysis Engine
- Use pre-trained NLP sentiment/emotion models for text (Hugging Face).  
- Use speech-to-text (Whisper / Google Speech API) → then run emotion classification.  

### Crisis Keyword/Pattern Detector
- Rule-based + ML: Detect self-harm keywords / repeated negativity.  

### Analytics Engine
- Collect only anonymous metadata (e.g., session count, detected emotions).  
- Aggregate for admin dashboard.  

### Database
- Students: Anonymous ID (no personal data for now).  
- Emotion logs (time, type, severity, anonymized).  
- Admin reports (summarized trends).  

---

# 📆 Hackathon Work Breakdown

### Setup & Core Build
- Setup repo, project structure (frontend + backend).  
- Build student UI (login + venting page).  
- Integrate text-based sentiment/emotion analysis (basic Hugging Face model).  

### AI + Crisis Layer
- Add speech-to-text pipeline (Whisper API or Google Speech).  
- Connect emotion analysis to responses (coping suggestions).  
- Implement crisis detection triggers + 3-step escalation flow.  

### Admin Dashboard
- Build analytics dashboard (React + Chart.js/Recharts).  
- Display heatmaps & trends from anonymized logs.  
- Test with mock data (simulate exam week stress spike).  

### Polishing + Pitch Demo
- Add basic booking placeholder (not full integration, just mock UI).  
- Add a few resource guides (PDF/video links).  
- Prepare final demo flow:  
  - Student venting → AI response → Crisis handling.  
  - Admin dashboard showing emotion trends.  

---

# ⚡ Deliverables for SIH Demo

- Working student portal with Vent It Out + Crisis detection.  
- Admin dashboard with emotion trends.  
- Demo scenario (scripted test cases showing stress detection, crisis trigger, and admin insights).  
- Pitch video/slides with architecture + future vision (peer forum, counsellor booking, multilingual resources).  
