// Google Gemini API configuration for mental health chatbot
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

const SYSTEM_PROMPT = `You are an empathetic and professional AI mental health assistant for the MannMitra platform. Your role is to provide emotional support, guide users through evidence-based therapeutic techniques, and offer practical mental wellness advice.

Key Guidelines:
- Always maintain an empathetic, supportive, and non-judgmental tone
- Provide practical, actionable mental health advice and coping strategies
- Use evidence-based approaches like CBT techniques, mindfulness, and stress management
- Never provide medical diagnoses or replace professional therapy
- For serious mental health crises, always recommend professional help
- Keep responses concise but meaningful (2-4 sentences typically)
- Focus on mental wellness, emotional support, stress relief, anxiety management, and self-care
- Encourage positive coping mechanisms and healthy habits
- NEVER include your name in responses - respond directly as a supportive helper
- Avoid prefixing responses with "As an AI" or similar phrases

You are integrated into a comprehensive mental health platform that includes mood tracking, wellness plans, crisis detection, and teletherapy connections. Help users make the most of these features when relevant.`;

export async function getChatResponse(
  messages: { role: string; content: string }[]
) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return "I apologize, but the AI service is not properly configured. Please contact support to resolve this issue. In the meantime, you can still access all other features of MannMitra.";
  }

  try {
    // Build conversation context (last 6 messages for context)
    const recentMessages = messages.slice(-6);
    const conversationContext = recentMessages
      .map((msg) => `${msg.role === "user" ? "User" : "Adma"}: ${msg.content}`)
      .join("\n");

    // Create the prompt with system instructions and conversation context
    const fullPrompt = `${SYSTEM_PROMPT}

Previous conversation:
${conversationContext}

Please respond to the user's message. Keep your response supportive, practical, and focused on mental wellness. If the user is asking about non-mental health topics, gently guide them back to mental wellness while still being helpful.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: fullPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 300,
        stopSequences: [],
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API error:", response.status, errorData);

      if (response.status === 403) {
        return "I'm currently experiencing high demand. Please try again in a few moments. Your mental wellness is important to me!";
      } else if (response.status === 429) {
        return "I'm receiving many requests right now. Please wait a moment and try again. I'm here to support you!";
      } else {
        return "I'm experiencing a temporary technical issue. Please try again shortly. In the meantime, remember that you're not alone in your mental health journey.";
      }
    }

    const data = await response.json();

    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content
    ) {
      const aiResponse = data.candidates[0].content.parts[0].text.trim();

      // Clean up the response more thoroughly
      let cleanedResponse = aiResponse
        .replace(/^Adma:\s*/i, "")
        .replace(/^Assistant:\s*/i, "")
        .replace(/^AI:\s*/i, "")
        .replace(/^Bot:\s*/i, "")
        .replace(/^\*.*?\*:\s*/i, "") // Remove any name in asterisks
        .trim();

      // Remove any remaining Adma references at the start
      while (cleanedResponse.match(/^(Adma|Assistant|AI|Bot)[\s:]/i)) {
        cleanedResponse = cleanedResponse
          .replace(/^(Adma|Assistant|AI|Bot)[\s:]+/i, "")
          .trim();
      }

      if (!cleanedResponse || cleanedResponse.length < 10) {
        return "Hello! I'm Adma, your mental health companion. I'm here to provide emotional support and practical wellness guidance. How can I help you feel better today?";
      }

      return cleanedResponse;
    } else {
      return "Hello! I'm Adma, your mental health assistant. I'm here to listen and provide support. How are you feeling today?";
    }
  } catch (error: any) {
    console.error("Error getting chat response:", error);

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return "I'm having trouble connecting to the AI service. Please check your internet connection and try again.";
    }

    return "I apologize, but I encountered a temporary issue. Please try again in a moment. Remember, I'm here to support your mental wellness journey!";
  }
}

const DEFAULT_WELLNESS_PLAN = [
  "Practice deep breathing exercises (5 minutes)",
  "Take a mindful walk outside",
  "Write three things you're grateful for",
  "Connect with a supportive friend or family member",
  "Do a gentle stretching or movement activity",
];

export async function generateWellnessPlan(
  moodData: { mood: number; notes: string }[]
) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return DEFAULT_WELLNESS_PLAN;
  }

  try {
    const moodSummary = moodData
      .slice(-5)
      .map((entry) => `Mood: ${entry.mood}/5, Notes: ${entry.notes}`)
      .join("\n");

    const prompt = `Based on the following recent mood data, create 5 specific, actionable wellness tasks that would help improve mental wellbeing:

${moodSummary}

Please provide 5 personalized wellness activities that are:
- Specific and actionable
- Appropriate for the user's current mood state  
- Evidence-based for mental health improvement
- Realistic to complete in 10-30 minutes each

Format: Just list the 5 activities, one per line, without numbering.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 200,
        stopSequences: [],
      },
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error("Gemini API error for wellness plan:", response.status);
      return DEFAULT_WELLNESS_PLAN;
    }

    const data = await response.json();

    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content
    ) {
      const aiResponse = data.candidates[0].content.parts[0].text.trim();

      const tasks = aiResponse
        .split("\n")
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) =>
          line
            .replace(/^\d+[\.\)]\s*/, "")
            .replace(/^[-*]\s*/, "")
            .trim()
        )
        .slice(0, 5);

      return tasks.length === 5 ? tasks : DEFAULT_WELLNESS_PLAN;
    } else {
      return DEFAULT_WELLNESS_PLAN;
    }
  } catch (error: any) {
    console.error("Error generating wellness plan:", error);
    return DEFAULT_WELLNESS_PLAN;
  }
}
