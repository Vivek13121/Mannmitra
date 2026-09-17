// Google Gemini API configuration for MannMitra.
// Use Gemini 3.6 Flash directly for fast responses.
const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models";

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
- NEVER include your name in responses
- Avoid prefixing responses with "As an AI" or similar phrases`;

const DEFAULT_WELLNESS_PLAN = [
  "Practice deep breathing exercises (5 minutes)",
  "Take a mindful walk outside",
  "Write three things you're grateful for",
  "Connect with a supportive friend or family member",
  "Do a gentle stretching or movement activity",
];

async function callGemini(requestBody: unknown, apiKey: string): Promise<any> {
  const timeoutMs = 10000;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(
      `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      }
    );

    window.clearTimeout(timeout);

    if (response.ok) return await response.json();

    const errorData = await response.json().catch(() => ({}));
    console.error(`Gemini ${GEMINI_MODEL} error:`, response.status, errorData);

    const error = new Error(
      `Gemini API request failed with status ${response.status}`
    );
    (error as any).status = response.status;
    throw error;
  } catch (error: any) {
    window.clearTimeout(timeout);

    if (error?.name === "AbortError") {
      const timeoutError = new Error("Gemini API request timed out");
      (timeoutError as any).status = 408;
      throw timeoutError;
    }

    throw error;
  }
}

function getApiKey(): string | null {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key || key === "your_gemini_api_key_here") return null;
  return key;
}

function extractText(data: any): string | null {
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
}

export async function getChatResponse(
  messages: { role: string; content: string }[]
) {
  const apiKey = getApiKey();

  if (!apiKey) {
    return "I apologize, but the AI service is not properly configured. Please check the Gemini API key configuration.";
  }

  const recentMessages = messages.slice(-6);
  const conversationContext = recentMessages
    .map((msg) => `${msg.role === "user" ? "User" : "Adma"}: ${msg.content}`)
    .join("\n");

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\nPrevious conversation:\n${conversationContext}\n\nPlease respond to the user's message. Keep your response supportive, practical, and focused on mental wellness.`,
          },
        ],
      },
    ],
    generationConfig: { maxOutputTokens: 300 },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ],
  };

  try {
    const data = await callGemini(requestBody, apiKey);
    const text = extractText(data);

    if (!text) {
      return "I couldn't generate a response right now. Please try again in a moment.";
    }

    return text
      .replace(/^Adma:\s*/i, "")
      .replace(/^Assistant:\s*/i, "")
      .replace(/^AI:\s*/i, "")
      .replace(/^Bot:\s*/i, "")
      .trim();
  } catch (error: any) {
    console.error("Error getting chat response:", error);

    if (error?.status === 401 || error?.status === 403) {
      return "The AI service rejected the API key. Please check the Gemini API key configuration.";
    }
    if (error?.status === 429) {
      return "The AI service is temporarily busy. Please try again in a moment.";
    }
    if (error?.status >= 500) {
      return "The AI service is temporarily unavailable. Please try again in a moment.";
    }
    if (error?.status === 408) {
      return "The AI service took too long to respond. Please try again.";
    }
    if (error?.status === 404) {
      return "The configured Gemini AI model is unavailable. Please try again later.";
    }
    return "I'm having trouble connecting to the AI service. Please try again shortly.";
  }
}

export async function generateWellnessPlan(
  moodData: { mood: number; notes: string }[]
) {
  const apiKey = getApiKey();
  if (!apiKey) return DEFAULT_WELLNESS_PLAN;

  const moodSummary = moodData
    .slice(-5)
    .map((entry) => `Mood: ${entry.mood}/5, Notes: ${entry.notes}`)
    .join("\n");

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Based on this recent mood data, create exactly 5 specific, actionable wellness tasks:\n\n${moodSummary}\n\nEach should be realistic to complete in 10-30 minutes. Return only one task per line, without numbering.`,
          },
        ],
      },
    ],
    generationConfig: { maxOutputTokens: 200 },
  };

  try {
    const data = await callGemini(requestBody, apiKey);
    const text = extractText(data);
    if (!text) return DEFAULT_WELLNESS_PLAN;

    const tasks = text
      .split("\n")
      .filter((line: string) => line.trim())
      .map((line: string) => line.replace(/^\d+[.)]\s*/, "").replace(/^[-*]\s*/, "").trim())
      .slice(0, 5);

    return tasks.length === 5 ? tasks : DEFAULT_WELLNESS_PLAN;
  } catch (error) {
    console.error("Error generating wellness plan:", error);
    return DEFAULT_WELLNESS_PLAN;
  }
}
