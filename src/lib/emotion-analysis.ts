import { supabase } from "./supabase";
import { getChatResponse } from "./ai"; // Import Gemini AI function

export interface EmotionAnalysisResult {
  primaryEmotion: string;
  emotionScores: { [key: string]: number };
  sentimentScore: number;
  confidence: number;
  isCrisis: boolean;
  crisisIndicators: string[];
  detectedKeywords: string[];
}

interface CrisisAlert {
  anonymousUserId: string;
  severity: "low" | "medium" | "high" | "critical";
  emotionDetected: string;
  confidenceScore: number;
  keywordsDetected: string[];
  contentSnippet: string;
}

class EmotionAnalysisService {
  private crisisKeywords = {
    critical: [
      "suicide",
      "kill myself",
      "end my life",
      "want to die",
      "not worth living",
      "self harm",
      "hurt myself",
      "nobody cares",
      "hopeless",
      "cant go on",
    ],
    high: [
      "depressed",
      "overwhelming",
      "cant cope",
      "breaking down",
      "falling apart",
      "anxiety attack",
      "panic",
      "worthless",
      "useless",
      "failure",
    ],
    medium: [
      "stressed",
      "worried",
      "anxious",
      "sad",
      "lonely",
      "tired",
      "exhausted",
      "frustrated",
      "angry",
      "upset",
    ],
  };

  private emotionKeywords = {
    happy: [
      "happy",
      "joy",
      "excited",
      "cheerful",
      "glad",
      "pleased",
      "content",
      "satisfied",
    ],
    sad: [
      "sad",
      "down",
      "blue",
      "melancholy",
      "grief",
      "sorrow",
      "heartbroken",
      "devastated",
    ],
    angry: [
      "angry",
      "mad",
      "furious",
      "rage",
      "irritated",
      "annoyed",
      "frustrated",
      "livid",
    ],
    anxious: [
      "anxious",
      "nervous",
      "worried",
      "panic",
      "fear",
      "scared",
      "terrified",
      "overwhelmed",
    ],
    stressed: [
      "stressed",
      "pressure",
      "overwhelmed",
      "burden",
      "exhausted",
      "burned out",
    ],
    neutral: [
      "okay",
      "fine",
      "normal",
      "regular",
      "usual",
      "typical",
      "average",
    ],
  };

  /**
   * Analyze text content for emotions and crisis indicators using AI
   */
  async analyzeText(
    content: string,
    userId?: string
  ): Promise<EmotionAnalysisResult> {
    try {
      // Use AI to analyze emotions instead of keyword matching
      const aiEmotionResult = await this.analyzeEmotionWithAI(content);

      // Still use our crisis detection for safety
      const { isCrisis, crisisIndicators, severity } =
        this.detectCrisisIndicators(content.toLowerCase());

      // Extract detected keywords for context
      const detectedKeywords = this.extractKeywords(content.toLowerCase());

      const result: EmotionAnalysisResult = {
        primaryEmotion: aiEmotionResult.primaryEmotion,
        emotionScores: aiEmotionResult.emotionScores,
        sentimentScore: aiEmotionResult.sentimentScore,
        confidence: aiEmotionResult.confidence,
        isCrisis,
        crisisIndicators,
        detectedKeywords,
      };

      // Log to database for admin dashboard
      await this.logEmotionAnalysis(result, "text", userId, content.length);

      // Create crisis alert if necessary
      if (isCrisis && userId) {
        await this.createCrisisAlert({
          anonymousUserId: this.hashUserId(userId),
          severity,
          emotionDetected: aiEmotionResult.primaryEmotion,
          confidenceScore: aiEmotionResult.confidence,
          keywordsDetected: crisisIndicators,
          contentSnippet: content.substring(0, 100),
        });
      }

      return result;
    } catch (error) {
      console.error(
        "AI emotion analysis failed, falling back to keyword method:",
        error
      );

      // Fallback to keyword-based analysis if AI fails
      return this.analyzeTextFallback(content, userId);
    }
  }

  /**
   * AI-powered emotion analysis using Gemini
   */
  private async analyzeEmotionWithAI(content: string): Promise<{
    primaryEmotion: string;
    emotionScores: { [key: string]: number };
    sentimentScore: number;
    confidence: number;
  }> {
    const emotionPrompt = {
      role: "user" as const,
      content: `Analyze the emotional content of this text and provide a detailed emotion analysis. Text: "${content}"

Please respond ONLY with a JSON object in this exact format (no additional text):
{
  "primaryEmotion": "one of: happy, sad, angry, anxious, stressed, neutral, fear, joy",
  "emotionScores": {
    "happy": 0.0,
    "sad": 0.0,
    "angry": 0.0,
    "anxious": 0.0,
    "stressed": 0.0,
    "fear": 0.0,
    "joy": 0.0,
    "neutral": 0.0
  },
  "sentimentScore": 0.0,
  "confidence": 0.0
}

Rules:
- emotionScores should sum to 1.0
- sentimentScore should be between -1.0 (very negative) and 1.0 (very positive)
- confidence should be between 0.0 and 1.0
- Analyze the actual emotional tone, not just keywords
- Consider context, intensity, and overall feeling`,
    };

    try {
      const response = await getChatResponse([emotionPrompt]);

      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in AI response");
      }

      const result = JSON.parse(jsonMatch[0]);

      // Validate the response structure
      if (
        !result.primaryEmotion ||
        !result.emotionScores ||
        typeof result.sentimentScore !== "number" ||
        typeof result.confidence !== "number"
      ) {
        throw new Error("Invalid AI response structure");
      }

      // Ensure emotion scores sum to 1.0
      const totalScore = Object.values(result.emotionScores).reduce(
        (sum: number, score: any) => sum + score,
        0
      );
      if (totalScore > 0) {
        Object.keys(result.emotionScores).forEach((emotion) => {
          result.emotionScores[emotion] =
            result.emotionScores[emotion] / totalScore;
        });
      }

      return result;
    } catch (error) {
      console.error("AI emotion analysis error:", error);
      throw error;
    }
  }

  /**
   * Fallback keyword-based analysis (original method)
   */
  private async analyzeTextFallback(
    content: string,
    userId?: string
  ): Promise<EmotionAnalysisResult> {
    const normalizedContent = content.toLowerCase();

    // Detect emotions
    const emotionScores = this.calculateEmotionScores(normalizedContent);
    const primaryEmotion = this.getPrimaryEmotion(emotionScores);

    // Calculate sentiment score (-1 to 1)
    const sentimentScore = this.calculateSentiment(
      normalizedContent,
      emotionScores
    );

    // Detect crisis indicators
    const { isCrisis, crisisIndicators, severity } =
      this.detectCrisisIndicators(normalizedContent);

    // Extract detected keywords
    const detectedKeywords = this.extractKeywords(normalizedContent);

    // Calculate overall confidence
    const confidence = this.calculateConfidence(
      emotionScores,
      detectedKeywords
    );

    const result: EmotionAnalysisResult = {
      primaryEmotion,
      emotionScores,
      sentimentScore,
      confidence,
      isCrisis,
      crisisIndicators,
      detectedKeywords,
    };

    // Log to database for admin dashboard
    await this.logEmotionAnalysis(result, "text", userId, content.length);

    // Create crisis alert if necessary
    if (isCrisis && userId) {
      await this.createCrisisAlert({
        anonymousUserId: this.hashUserId(userId),
        severity,
        emotionDetected: primaryEmotion,
        confidenceScore: confidence,
        keywordsDetected: crisisIndicators,
        contentSnippet: content.substring(0, 100),
      });
    }

    return result;
  }

  /**
   * Analyze voice transcription (similar to text but with additional voice-specific processing)
   */
  async analyzeVoice(
    transcription: string,
    duration: number,
    userId?: string
  ): Promise<EmotionAnalysisResult> {
    // For voice, we can add additional analysis based on tone, pace, etc.
    // For now, we'll use the text analysis with voice-specific adjustments
    const result = await this.analyzeText(transcription, userId);

    // Log as voice analysis
    await this.logEmotionAnalysis(result, "voice", userId, duration);

    return result;
  }

  private calculateEmotionScores(content: string): { [key: string]: number } {
    const scores: { [key: string]: number } = {};

    Object.entries(this.emotionKeywords).forEach(([emotion, keywords]) => {
      let score = 0;
      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        const matches = content.match(regex);
        if (matches) {
          score += matches.length;
        }
      });
      scores[emotion] = score;
    });

    // Normalize scores
    const totalScore = Object.values(scores).reduce(
      (sum, score) => sum + score,
      0
    );
    if (totalScore > 0) {
      Object.keys(scores).forEach((emotion) => {
        scores[emotion] = scores[emotion] / totalScore;
      });
    } else {
      // Default to neutral if no keywords found
      scores.neutral = 1.0;
    }

    return scores;
  }

  private getPrimaryEmotion(emotionScores: { [key: string]: number }): string {
    return Object.entries(emotionScores).reduce((a, b) =>
      emotionScores[a[0]] > emotionScores[b[0]] ? a : b
    )[0];
  }

  private calculateSentiment(
    content: string,
    emotionScores: { [key: string]: number }
  ): number {
    // Simple sentiment calculation based on emotion weights
    const sentimentWeights: { [key: string]: number } = {
      happy: 1.0,
      neutral: 0.0,
      sad: -0.6,
      angry: -0.8,
      anxious: -0.7,
      stressed: -0.5,
    };

    let weightedScore = 0;
    Object.entries(emotionScores).forEach(([emotion, score]) => {
      const weight = sentimentWeights[emotion] || 0;
      weightedScore += score * weight;
    });

    // Clamp between -1 and 1
    return Math.max(-1, Math.min(1, weightedScore));
  }

  private detectCrisisIndicators(content: string): {
    isCrisis: boolean;
    crisisIndicators: string[];
    severity: "low" | "medium" | "high" | "critical";
  } {
    const foundIndicators: string[] = [];
    let maxSeverity: "low" | "medium" | "high" | "critical" = "low";

    // Check each severity level
    Object.entries(this.crisisKeywords).forEach(([severity, keywords]) => {
      keywords.forEach((keyword) => {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        if (regex.test(content)) {
          foundIndicators.push(keyword);
          if (
            this.getSeverityLevel(severity) > this.getSeverityLevel(maxSeverity)
          ) {
            maxSeverity = severity as any;
          }
        }
      });
    });

    return {
      isCrisis: foundIndicators.length > 0,
      crisisIndicators: foundIndicators,
      severity: maxSeverity,
    };
  }

  private getSeverityLevel(severity: string): number {
    const levels = { low: 1, medium: 2, high: 3, critical: 4 };
    return levels[severity as keyof typeof levels] || 0;
  }

  private extractKeywords(content: string): string[] {
    const allKeywords = [
      ...Object.values(this.emotionKeywords).flat(),
      ...Object.values(this.crisisKeywords).flat(),
    ];

    const foundKeywords: string[] = [];
    allKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      if (regex.test(content)) {
        foundKeywords.push(keyword);
      }
    });

    return [...new Set(foundKeywords)]; // Remove duplicates
  }

  private calculateConfidence(
    emotionScores: { [key: string]: number },
    keywords: string[]
  ): number {
    // Confidence based on keyword density and emotion score distribution
    const maxEmotionScore = Math.max(...Object.values(emotionScores));
    const keywordDensity = keywords.length / 100; // Normalize by assuming 100 words average

    // Higher confidence if clear primary emotion and relevant keywords
    const confidence =
      maxEmotionScore * 0.7 + Math.min(keywordDensity, 1) * 0.3;

    return Math.min(1.0, Math.max(0.1, confidence));
  }

  private hashUserId(userId: string): string {
    // Simple hash function for anonymization
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private async logEmotionAnalysis(
    result: EmotionAnalysisResult,
    analysisType: "text" | "voice",
    userId?: string,
    sessionDuration?: number
  ): Promise<void> {
    try {
      const logData = {
        anonymous_user_id: userId ? this.hashUserId(userId) : "anonymous",
        analysis_type: analysisType,
        primary_emotion: result.primaryEmotion,
        emotion_scores: result.emotionScores,
        sentiment_score: result.sentimentScore,
        confidence: result.confidence,
        is_crisis: result.isCrisis,
        crisis_indicators: result.crisisIndicators,
        detected_keywords: result.detectedKeywords,
        session_duration_seconds: sessionDuration || null,
      };

      const { error } = await supabase
        .from("emotion_analysis_logs")
        .insert([logData]);

      if (error) {
        console.error("Failed to log emotion analysis:", error);
      }
    } catch (error) {
      console.error("Error logging emotion analysis:", error);
    }
  }

  private async createCrisisAlert(alert: CrisisAlert): Promise<void> {
    try {
      const { error } = await supabase.from("crisis_alerts").insert([
        {
          anonymous_user_id: alert.anonymousUserId,
          severity: alert.severity,
          emotion_detected: alert.emotionDetected,
          confidence_score: alert.confidenceScore,
          keywords_detected: alert.keywordsDetected,
          content_snippet: alert.contentSnippet,
        },
      ]);

      if (error) {
        console.error("Failed to create crisis alert:", error);
      }
    } catch (error) {
      console.error("Error creating crisis alert:", error);
    }
  }

  /**
   * Log resource interaction for admin analytics
   */
  async logResourceInteraction(
    resourceType: string,
    resourceId: string,
    resourceTitle: string,
    interactionType: string,
    userId?: string,
    duration?: number,
    userEmotionBefore?: string,
    userEmotionAfter?: string
  ): Promise<void> {
    try {
      const { error } = await supabase.from("resource_interactions").insert([
        {
          anonymous_user_id: userId ? this.hashUserId(userId) : "anonymous",
          resource_type: resourceType,
          resource_id: resourceId,
          resource_title: resourceTitle,
          interaction_type: interactionType,
          duration_seconds: duration,
          user_emotion_before: userEmotionBefore,
          user_emotion_after: userEmotionAfter,
        },
      ]);

      if (error) {
        console.error("Failed to log resource interaction:", error);
      }
    } catch (error) {
      console.error("Error logging resource interaction:", error);
    }
  }

  /**
   * Get crisis helpline information based on severity
   */
  getCrisisHelpline(severity: string): {
    name: string;
    phone: string;
    description: string;
  } {
    switch (severity) {
      case "critical":
        return {
          name: "National Suicide Prevention Lifeline",
          phone: "988",
          description: "Immediate crisis support available 24/7",
        };
      case "high":
        return {
          name: "Crisis Text Line",
          phone: "Text HOME to 741741",
          description: "Free, confidential crisis support via text",
        };
      default:
        return {
          name: "Mental Health Support",
          phone: "1-800-662-4357",
          description: "SAMHSA National Helpline for treatment referrals",
        };
    }
  }
}

export const emotionAnalysisService = new EmotionAnalysisService();
