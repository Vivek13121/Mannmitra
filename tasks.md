# 🚀 MannMitra → SIH Prototype Conversion Tasks

## 📌 Context for Copilot
This repository contains **MannMitra**, a mental wellness platform.  
We are now **converting MannMitra into our SIH internal hackathon prototype**.  

⚠️ **Important:**  
Do not rely only on this file for context. Refer to **`sih.md`** (already added in the repo) which explains:
- SIH problem statement  
- Features required  
- Expected user flows  
- Our planned solution  

Your job is to use `sih.md` as the **source of truth** and apply changes to MannMitra step by step.

---

## 🥇 Phase 1 - Core Conversion (Highest Priority)

1. **Rebrand for SIH Context (Name stays "MannMitra")**
   - Keep the project name "MannMitra".  
   - Update landing page text and hero section to reflect the **SIH problem statement and solution** (see `sih.md`).  
   - Modify navbar/sections so the flow matches SIH requirements.  

2. **User Flow Redesign**
   - Based on `sih.md`, create a **step-by-step scroll flow** on landing page:  
     1. Student mental health challenges (problem).  
     2. Our solution (MannMitra SIH features).  
     3. How students interact with the platform.  
     4. Outcomes/impact.  
   - Ensure this matches hackathon expectations.  

3. **Vent It Out (Core Feature)**
   - Build a dedicated **Venting Page** where students can:  
     - Type emotions (text input).  
     - Record short voice clips (30s–1 min).  
   - Run **text emotion analysis** (Hugging Face model).  
   - For voice: use **speech-to-text (Whisper/Google Speech)** → then emotion classification.  
   - Show categorized result (stress, sadness, joy, anger, fear).  
   - Provide short coping responses (breathing, journaling, self-care).  

4. **Crisis Detection Layer**
   - Implement keyword/pattern detection for high-risk cases (self-harm, severe distress).  
   - Escalation flow:  
     1. Show grounding exercise (breathing gif/audio).  
     2. Suggest counsellor booking (dummy placeholder).  
     3. Display emergency helpline **and alert admin dashboard**.  

5. **Mental Health Assessment Alignment**
   - Adapt existing quiz/assessment so categories & scoring follow SIH guidelines in `sih.md`.  
   - Show result categories: **Low, Moderate, High Risk**.  
   - Store responses in Supabase with timestamp.  

6. **Teletherapy & Resources**
   - Expand therapist directory using sample SIH-style data from `sih.md`.  
   - Add placeholders for **verified centers / govt facilities**.  
   - Keep booking feature as dummy for now.  

---

## 🥈 Phase 2 - SIH Feature Enhancements

7. **AI Early-Warning Risk Dashboard (Admin)**
   - Build analytics dashboard with:  
     - Heatmap/graphs for weekly stress, anxiety, depression trends.  
     - Alerts: *“Spike detected in Year 2 before exams.”*  
   - Use Supabase RLS for secure role-based access.  

8. **EBAT Enhancement**
   - Connect emotional analysis (voice/text) with SIH intervention mappings from `sih.md`.  
   - Example: if severe stress detected → suggest govt helpline + coping strategy.  

9. **AI Assistant Customization**
   - Restrict chatbot to **mental health + SIH resources only**.  
   - Pull in helplines, official portals, and curated content from `sih.md`.  
   - Add a short disclaimer before session starts.  

---

## 🥉 Phase 3 - Advanced / Optional Features

10. **Crisis Prediction & Safety Net**
    - Implement predictive analytics for repeated high-risk patterns.  
    - Send anonymous early-warning insights to admin dashboard.  

11. **Gamified Engagement**
    - Add youth-focused games/activities (stress relief, mindfulness).  
    - Track streaks or engagement points.  

12. **Wellness Hub Expansion**
    - Add regional language support + govt awareness campaigns.  
    - Curate official PDF/video resources (see `sih.md`).  

13. **Deployment & Demo Prep**
    - Deploy to Netlify/Vercel.  
    - Ensure demo-ready sequence: **Assessment → Vent It Out → Crisis Handling → Admin Dashboard**.  
    - Optimize UI for hackathon presentation.  

---

## ✅ Deliverables
- Updated MannMitra repo reflecting SIH modifications.  
- Deployed link for **internal SIH demo**.  
- Demo-ready flow covering:  
  - Student venting → AI response → Crisis handling.  
  - Admin dashboard with stress trend insights.  
