import { AssemblyAI } from 'assemblyai';

// Initialize AssemblyAI client
const getAssemblyAIClient = () => {
  const apiKey = import.meta.env.VITE_ASSEMBLYAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('AssemblyAI API key is not configured. Please add VITE_ASSEMBLYAI_API_KEY to your environment variables.');
  }
  
  return new AssemblyAI({
    apiKey: apiKey,
  });
};

export interface VoiceAnalysisResult {
  transcript: string;
  confidence: number;
  sentiment?: {
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    confidence: number;
  };
  emotions?: Array<{
    emotion: string;
    confidence: number;
  }>;
  summary?: string;
  keyPhrases?: string[];
}

export const analyzeVoiceWithAssemblyAI = async (audioBlob: Blob): Promise<VoiceAnalysisResult> => {
  try {
    const client = getAssemblyAIClient();
    
    // Convert blob to array buffer for upload
    const arrayBuffer = await audioBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Upload audio file to AssemblyAI
    const uploadUrl = await client.files.upload(uint8Array);
    
    // Configure transcription parameters
    const params = {
      audio: uploadUrl,
      speech_model: 'universal' as const,
      language_detection: true,
      sentiment_analysis: true,
      auto_highlights: true,
      summarization: true,
      summary_model: 'informative' as const,
      summary_type: 'bullets' as const,
    };
    
    // Start transcription
    const transcript = await client.transcripts.transcribe(params);
    
    if (transcript.status === 'error') {
      throw new Error(`Transcription failed: ${transcript.error}`);
    }
    
    // Extract emotions from sentiment analysis and text content
    const emotions = extractEmotionsFromText(transcript.text || '');
    
    // Build result object
    const result: VoiceAnalysisResult = {
      transcript: transcript.text || '',
      confidence: transcript.confidence || 0,
      sentiment: transcript.sentiment_analysis_results?.[0] ? {
        sentiment: transcript.sentiment_analysis_results[0].sentiment,
        confidence: transcript.sentiment_analysis_results[0].confidence,
      } : undefined,
      emotions,
      summary: transcript.summary || undefined,
      keyPhrases: transcript.auto_highlights_result?.results?.map(h => h.text) || [],
    };
    
    return result;
  } catch (error) {
    console.error('AssemblyAI analysis error:', error);
    throw new Error(`Voice analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Helper function to extract emotions from text analysis
const extractEmotionsFromText = (text: string): Array<{ emotion: string; confidence: number }> => {
  const emotions: Array<{ emotion: string; confidence: number }> = [];
  
  // Simple keyword-based emotion detection
  const emotionKeywords = {
    happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'fantastic', 'good', 'positive'],
    sad: ['sad', 'depressed', 'down', 'upset', 'disappointed', 'hurt', 'crying', 'tears'],
    angry: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'irritated', 'rage'],
    anxious: ['anxious', 'worried', 'nervous', 'stressed', 'panic', 'fear', 'scared', 'overwhelmed'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'content'],
    confused: ['confused', 'lost', 'uncertain', 'unclear', 'puzzled', 'bewildered'],
  };
  
  const lowerText = text.toLowerCase();
  
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    const matches = keywords.filter(keyword => lowerText.includes(keyword));
    if (matches.length > 0) {
      const confidence = Math.min(matches.length * 0.3, 1.0); // Scale confidence based on keyword matches
      emotions.push({ emotion, confidence });
    }
  });
  
  // If no emotions detected, default to neutral
  if (emotions.length === 0) {
    emotions.push({ emotion: 'neutral', confidence: 0.8 });
  }
  
  // Sort by confidence and return top 3
  return emotions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);
};

// Test function for development
export const testAssemblyAI = async () => {
  try {
    const client = getAssemblyAIClient();
    
    // Test with a sample audio URL
    const audioUrl = 'https://assembly.ai/wildfires.mp3';
    
    const params = {
      audio: audioUrl,
      speech_model: 'universal' as const,
      sentiment_analysis: true,
    };
    
    const transcript = await client.transcripts.transcribe(params);
    
    console.log('AssemblyAI Test Result:', {
      text: transcript.text,
      confidence: transcript.confidence,
      sentiment: transcript.sentiment_analysis_results?.[0],
    });
    
    return transcript;
  } catch (error) {
    console.error('AssemblyAI test failed:', error);
    throw error;
  }
};