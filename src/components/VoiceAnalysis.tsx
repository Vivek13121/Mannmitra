import React, { useRef, useState, useEffect } from 'react';
import { Mic, Square, RefreshCw, Volume2, Loader2, AlertCircle } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';
import { supabase } from '../lib/supabase';
import { analyzeVoiceWithAssemblyAI, type VoiceAnalysisResult } from '../lib/assemblyai';

const emotionSuggestions = {
  happy: {
    title: "Maintain Your Positive Energy",
    suggestions: [
      "Share your joy with others",
      "Set new goals while motivated",
      "Practice gratitude journaling",
      "Engage in activities that bring you fulfillment"
    ]
  },
  sad: {
    title: "Gentle Support for Difficult Moments",
    suggestions: [
      "Try deep breathing exercises",
      "Connect with a loved one",
      "Take a mindful walk outside",
      "Practice self-compassion"
    ]
  },
  angry: {
    title: "Channel Your Energy Positively",
    suggestions: [
      "Practice progressive muscle relaxation",
      "Write down your thoughts",
      "Do physical exercise",
      "Try the 4-7-8 breathing technique"
    ]
  },
  anxious: {
    title: "Calming Strategies for Anxiety",
    suggestions: [
      "Practice grounding techniques (5-4-3-2-1)",
      "Try mindful breathing",
      "Use positive self-talk",
      "Focus on what you can control"
    ]
  },
  calm: {
    title: "Nurture Your Inner Peace",
    suggestions: [
      "Continue your mindfulness practice",
      "Share your calm energy with others",
      "Reflect on what brings you peace",
      "Set intentions for maintaining balance"
    ]
  },
  confused: {
    title: "Finding Clarity in Uncertainty",
    suggestions: [
      "Break down complex thoughts into smaller parts",
      "Talk through your feelings with someone",
      "Practice journaling to organize thoughts",
      "Take time to process without pressure"
    ]
  },
  neutral: {
    title: "Enhance Your Well-being",
    suggestions: [
      "Try a new mindfulness exercise",
      "Set an intention for the day",
      "Practice self-reflection",
      "Engage in a meaningful activity"
    ]
  }
};

export default function VoiceAnalysis() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<VoiceAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const chunks = useRef<Blob[]>([]);
  const waveformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (waveformRef.current && audioUrl) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4F46E5',
        progressColor: '#818CF8',
        cursorColor: '#C7D2FE',
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 1,
        height: 100,
        barGap: 3,
      });

      wavesurfer.current.load(audioUrl);

      return () => {
        wavesurfer.current?.destroy();
      };
    }
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });
      
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(chunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        await analyzeVoice(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setError(null);
      setAnalysisResult(null);
    } catch (err) {
      console.error('Recording error:', err);
      setError('Please allow microphone access to use this feature');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const analyzeVoice = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Check if AssemblyAI API key is configured
      if (!import.meta.env.VITE_ASSEMBLYAI_API_KEY) {
        throw new Error('AssemblyAI API key is not configured. Please add your API key to continue.');
      }

      const result = await analyzeVoiceWithAssemblyAI(audioBlob);
      setAnalysisResult(result);

      // Store the analysis result in Supabase
      const user = await supabase.auth.getUser();
      if (user.data.user && result.emotions && result.emotions.length > 0) {
        const primaryEmotion = result.emotions[0];
        const moodScore = getMoodScore(primaryEmotion.emotion);
        
        await supabase.from('user_mood_entries').insert({
          user_id: user.data.user.id,
          mood: moodScore,
          notes: `Voice Analysis: ${primaryEmotion.emotion} (${Math.round(primaryEmotion.confidence * 100)}% confidence) - "${result.transcript.substring(0, 100)}..."`,
        });
      }
    } catch (err: any) {
      console.error('Voice analysis error:', err);
      setError(err.message || 'Failed to analyze voice. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMoodScore = (emotion: string): number => {
    const emotionToMood: { [key: string]: number } = {
      'happy': 5,
      'calm': 4,
      'neutral': 3,
      'confused': 2,
      'anxious': 2,
      'sad': 1,
      'angry': 1,
    };
    return emotionToMood[emotion.toLowerCase()] || 3;
  };

  const resetRecording = () => {
    setAudioUrl(null);
    setAnalysisResult(null);
    setError(null);
    chunks.current = [];
  };

  const getSuggestions = () => {
    if (!analysisResult || !analysisResult.emotions || analysisResult.emotions.length === 0) {
      return emotionSuggestions.neutral;
    }
    
    const primaryEmotion = analysisResult.emotions[0].emotion.toLowerCase();
    return emotionSuggestions[primaryEmotion as keyof typeof emotionSuggestions] || emotionSuggestions.neutral;
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-green-600 dark:text-green-400';
      case 'negative':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">
          Advanced Voice Emotion Analysis
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Speak naturally for 15-30 seconds. Our AI will analyze your speech patterns, tone, and content to understand your emotional state.
        </p>
      </div>

      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Analysis Error</p>
              <p className="text-sm mt-1">{error}</p>
              {error.includes('API key') && (
                <p className="text-sm mt-2 text-red-600 dark:text-red-400">
                  Please configure your AssemblyAI API key in the environment variables to use this feature.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={isAnalyzing}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full flex items-center space-x-3 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Mic className="h-6 w-6" />
              <span className="font-medium">Start Recording</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-full flex items-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse"
            >
              <Square className="h-6 w-6" />
              <span className="font-medium">Stop Recording</span>
            </button>
          )}

          {audioUrl && !isAnalyzing && (
            <button
              onClick={resetRecording}
              className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-6 py-4 rounded-full flex items-center space-x-2 transition-all duration-300 hover:bg-gray-300 dark:hover:bg-slate-600"
            >
              <RefreshCw className="h-5 w-5" />
              <span>Record Again</span>
            </button>
          )}
        </div>

        {audioUrl && (
          <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <Volume2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Your Recording</span>
            </div>
            <div ref={waveformRef} className="w-full" />
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600 dark:text-indigo-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              Analyzing Your Voice...
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Processing speech patterns, tone, and emotional content
            </p>
          </div>
        )}

        {analysisResult && (
          <div className="space-y-6">
            {/* Transcript */}
            {analysisResult.transcript && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                  Transcript
                </h4>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{analysisResult.transcript}"
                </p>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Confidence: {Math.round(analysisResult.confidence * 100)}%
                </div>
              </div>
            )}

            {/* Emotional Analysis */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
              <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                {getSuggestions().title}
              </h4>
              
              {/* Emotions */}
              {analysisResult.emotions && analysisResult.emotions.length > 0 && (
                <div className="mb-6">
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Detected Emotions:</h5>
                  <div className="space-y-2">
                    {analysisResult.emotions.map((emotion, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300 capitalize">
                          {emotion.emotion}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${emotion.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                            {Math.round(emotion.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sentiment */}
              {analysisResult.sentiment && (
                <div className="mb-6">
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Overall Sentiment:</h5>
                  <div className="flex items-center space-x-3">
                    <span className={`font-semibold capitalize ${getSentimentColor(analysisResult.sentiment.sentiment)}`}>
                      {analysisResult.sentiment.sentiment}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({Math.round(analysisResult.sentiment.confidence * 100)}% confidence)
                    </span>
                  </div>
                </div>
              )}

              {/* Key Phrases */}
              {analysisResult.keyPhrases && analysisResult.keyPhrases.length > 0 && (
                <div className="mb-6">
                  <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Key Phrases:</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keyPhrases.slice(0, 5).map((phrase, index) => (
                      <span
                        key={index}
                        className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full text-sm"
                      >
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              <div>
                <h5 className="font-medium text-gray-800 dark:text-white mb-3">Personalized Recommendations:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getSuggestions().suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800"
                    >
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {analysisResult.summary && (
                <div className="mt-6 bg-white dark:bg-slate-800 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <h5 className="font-medium text-gray-800 dark:text-white mb-2">AI Summary:</h5>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{analysisResult.summary}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* API Key Notice */}
      {!import.meta.env.VITE_ASSEMBLYAI_API_KEY && (
        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                Configuration Required
              </h4>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                To use voice analysis, please add your AssemblyAI API key to the <code>VITE_ASSEMBLYAI_API_KEY</code> environment variable.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}