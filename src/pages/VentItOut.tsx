import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Type,
  Send,
  Heart,
  Brain,
  AlertTriangle,
  CheckCircle,
  Phone,
  ExternalLink,
} from "lucide-react";
import { supabase } from "../lib/supabase"; // Using real Supabase
import { getChatResponse } from "../lib/ai"; // Import Gemini AI function
import {
  emotionAnalysisService,
  EmotionAnalysisResult,
} from "../lib/emotion-analysis";
import { analyzeVoiceWithAssemblyAI } from "../lib/assemblyai"; // Import AssemblyAI function
import { useStore } from "../lib/store";

interface VentingEntry {
  id: string;
  type: "text" | "voice";
  content: string;
  emotion: string;
  confidence: number;
  timestamp: Date;
  copingResponse: string;
  isHighRisk: boolean;
  analysisResult?: EmotionAnalysisResult;
  helplineInfo?: {
    name: string;
    phone: string;
    description: string;
  };
}

const VentItOut = () => {
  const [activeTab, setActiveTab] = useState<"text" | "voice">("text");
  const [textInput, setTextInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<VentingEntry | null>(null);
  const [showCrisisFlow, setShowCrisisFlow] = useState(false);
  const [crisisStep, setCrisisStep] = useState(1);
  const [analysisResult, setAnalysisResult] =
    useState<EmotionAnalysisResult | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Get current user on component mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  // High-risk keywords for crisis detection
  const crisisKeywords = [
    "suicide",
    "kill myself",
    "end it all",
    "hurt myself",
    "self harm",
    "cutting",
    "worthless",
    "hopeless",
    "better off dead",
    "no point",
    "give up",
    "die",
    "death",
    "cant go on",
    "nobody cares",
    "alone forever",
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Auto-stop after 60 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && isRecording) {
          stopRecording();
        }
      }, 60000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const analyzeEmotion = async (text: string) => {
    try {
      // Use the new emotion analysis service
      const result = await emotionAnalysisService.analyzeText(
        text,
        currentUser?.id
      );
      setAnalysisResult(result);

      return {
        emotion: result.primaryEmotion,
        confidence: result.confidence,
        isHighRisk: result.isCrisis,
        keywords: result.detectedKeywords,
        analysisResult: result,
      };
    } catch (error) {
      console.error("Emotion analysis failed:", error);

      // Fallback to basic analysis
      return {
        emotion: "neutral",
        confidence: 0.5,
        isHighRisk: false,
        keywords: [],
        analysisResult: null,
      };
    }
  };

  const generateCopingResponse = async (
    emotion: string,
    content: string
  ): Promise<string> => {
    try {
      // Create a specialized prompt for venting/emotional support
      const ventingPrompt = {
        role: "user" as const,
        content: `I need emotional support and coping strategies. I'm feeling ${emotion} and here's what I want to vent about: "${content}"

Please provide:
1. Immediate emotional validation and empathy
2. Specific, actionable coping strategies for this situation
3. Gentle encouragement and hope
4. Practical next steps I can take right now

Keep your response caring, supportive, and focused on mental wellness. Make it feel personal and genuine, not generic.`,
      };

      const messages = [ventingPrompt];
      const aiResponse = await getChatResponse(messages);

      return aiResponse || getDefaultCopingResponse(emotion);
    } catch (error) {
      console.error("Error generating AI coping response:", error);
      return getDefaultCopingResponse(emotion);
    }
  };

  // Fallback responses in case AI fails
  const getDefaultCopingResponse = (emotion: string): string => {
    const responses = {
      stress:
        "I can sense you're feeling overwhelmed. Try the 4-7-8 breathing technique: Inhale for 4, hold for 7, exhale for 8. Remember, it's okay to take breaks and ask for help.",
      sadness:
        "It sounds like you're going through a tough time. Your feelings are valid. Consider reaching out to a friend or counselor. Small acts of self-care can help too.",
      anxiety:
        "Anxiety can feel overwhelming. Try grounding yourself: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
      anger:
        "I hear your frustration. Take some deep breaths and count to 10. Physical activity or journaling can help release these intense feelings safely.",
      joy: "It's wonderful that you're feeling positive! These moments are precious - consider writing down what's making you happy to remember during tougher times.",
      fear: "Fear is a natural response. You're brave for acknowledging it. Break down what you're afraid of into smaller, manageable parts. You don't have to face this alone.",
      neutral:
        "Thank you for sharing with me. Sometimes just expressing our thoughts can be helpful. Remember that seeking support is a sign of strength.",
      "Crisis Risk Detected":
        "I'm concerned about what you've shared. Please know that you matter and help is available. Let's connect you with immediate support resources.",
    };

    return responses[emotion as keyof typeof responses] || responses.neutral;
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;

    setIsAnalyzing(true);

    try {
      const emotionResult = await analyzeEmotion(textInput);

      // Generate AI-powered coping response
      const copingResponse = await generateCopingResponse(
        emotionResult.emotion,
        textInput
      );

      const entry: VentingEntry = {
        id: Date.now().toString(),
        type: "text",
        content: textInput,
        emotion: emotionResult.emotion,
        confidence: emotionResult.confidence,
        timestamp: new Date(),
        copingResponse,
        isHighRisk: emotionResult.isHighRisk,
      };

      setCurrentEntry(entry);

      // Store in Supabase with user authentication
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("venting_entries").insert({
            user_id: user.id,
            type: entry.type,
            emotion: entry.emotion,
            confidence: entry.confidence,
            is_high_risk: entry.isHighRisk,
            content: entry.content,
            coping_response: entry.copingResponse,
            created_at: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.warn("Failed to save venting entry:", error);
      }

      // Trigger crisis flow if high risk
      if (emotionResult.isHighRisk) {
        setShowCrisisFlow(true);
        setCrisisStep(1);

        // Get crisis helpline info based on severity
        if (emotionResult.analysisResult) {
          const helplineInfo = emotionAnalysisService.getCrisisHelpline(
            emotionResult.analysisResult.crisisIndicators.length > 2
              ? "critical"
              : "high"
          );
          entry.helplineInfo = helplineInfo;
        }
      }

      setTextInput("");
    } catch (error) {
      console.error("Error analyzing text:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceSubmit = async () => {
    if (!audioBlob) return;

    setIsAnalyzing(true);

    try {
      // Use AssemblyAI for real voice-to-text analysis
      let voiceText = "";
      let voiceAnalysisError = false;

      try {
        const voiceResult = await analyzeVoiceWithAssemblyAI(audioBlob);
        voiceText = voiceResult.transcript;

        // If transcript is empty or too short, provide feedback
        if (!voiceText || voiceText.trim().length < 3) {
          voiceText =
            "I couldn't understand the audio clearly. Please try speaking more clearly or check your microphone.";
          voiceAnalysisError = true;
        }
      } catch (error) {
        console.error("AssemblyAI analysis failed:", error);
        voiceText =
          "Voice analysis failed. Please try again or use text input instead.";
        voiceAnalysisError = true;
      }

      const emotionResult = await analyzeEmotion(voiceText);

      // Generate AI-powered coping response
      const copingResponse = await generateCopingResponse(
        emotionResult.emotion,
        voiceText
      );

      const entry: VentingEntry = {
        id: Date.now().toString(),
        type: "voice",
        content: voiceText,
        emotion: emotionResult.emotion,
        confidence: emotionResult.confidence,
        timestamp: new Date(),
        copingResponse,
        isHighRisk: emotionResult.isHighRisk && !voiceAnalysisError, // Don't trigger crisis for analysis errors
        analysisResult: emotionResult.analysisResult || undefined,
      };

      setCurrentEntry(entry);

      // Store in Supabase with user authentication
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("venting_entries").insert({
            user_id: user.id,
            type: entry.type,
            emotion: entry.emotion,
            confidence: entry.confidence,
            is_high_risk: entry.isHighRisk,
            content: entry.content,
            coping_response: entry.copingResponse,
            created_at: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.warn("Failed to save venting entry:", error);
      }

      if (emotionResult.isHighRisk && !voiceAnalysisError) {
        setShowCrisisFlow(true);
        setCrisisStep(1);

        // Get crisis helpline info based on severity
        if (emotionResult.analysisResult) {
          const helplineInfo = emotionAnalysisService.getCrisisHelpline(
            emotionResult.analysisResult.crisisIndicators.length > 2
              ? "critical"
              : "high"
          );
          entry.helplineInfo = helplineInfo;
        }
      }

      setAudioBlob(null);
    } catch (error) {
      console.error("Error analyzing voice:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      stress: "text-orange-600 dark:text-orange-400",
      sadness: "text-blue-600 dark:text-blue-400",
      anxiety: "text-yellow-600 dark:text-yellow-400",
      anger: "text-red-600 dark:text-red-400",
      joy: "text-green-600 dark:text-green-400",
      fear: "text-purple-600 dark:text-purple-400",
      neutral: "text-gray-600 dark:text-gray-400",
      "Crisis Risk Detected": "text-red-700 dark:text-red-500",
    };
    return colors[emotion as keyof typeof colors] || colors.neutral;
  };

  const CrisisFlow = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            We're Here to Help
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            It sounds like you're going through a really difficult time. You're
            not alone.
          </p>
        </div>

        {crisisStep === 1 && (
          <div className="space-y-6">
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
              <h3 className="font-semibold text-red-800 dark:text-red-300 mb-3">
                Immediate Grounding Exercise
              </h3>
              <p className="text-red-700 dark:text-red-400 mb-4">
                Let's focus on your breathing. Breathe with me:
              </p>
              <div className="text-center">
                <div className="w-24 h-24 bg-red-200 dark:bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-12 w-12 text-red-600 dark:text-red-400 animate-pulse" />
                </div>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Inhale for 4... Hold for 7... Exhale for 8...
                </p>
              </div>
            </div>
            <button
              onClick={() => setCrisisStep(2)}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium"
            >
              I'm Ready for Next Step
            </button>
          </div>
        )}

        {crisisStep === 2 && (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
                Professional Support Available
              </h3>
              <p className="text-blue-700 dark:text-blue-400 mb-4">
                Would you like to connect with a counselor? We can help you book
                an appointment.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                Book Counselor (Coming Soon)
              </button>
            </div>
            <button
              onClick={() => setCrisisStep(3)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
            >
              Show Emergency Resources
            </button>
          </div>
        )}

        {crisisStep === 3 && (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
              <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Emergency Support - Available 24/7
              </h3>

              {/* Dynamic helpline based on severity */}
              {currentEntry?.helplineInfo && (
                <div className="mb-4 p-4 bg-white dark:bg-slate-700 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">
                    {currentEntry.helplineInfo.name}
                  </h4>
                  <p className="text-red-600 dark:text-red-400 mb-2">
                    {currentEntry.helplineInfo.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-red-600" />
                    <span className="font-bold text-red-700 dark:text-red-300 text-lg">
                      {currentEntry.helplineInfo.phone}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-3 text-green-700 dark:text-green-400">
                <div className="flex items-center justify-between">
                  <span>National Mental Health Helpline:</span>
                  <span className="font-bold">1800-599-0019</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Crisis Intervention:</span>
                  <span className="font-bold">1800-180-2005</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>J&K Student Support:</span>
                  <span className="font-bold">24x7 Available</span>
                </div>
              </div>

              {/* Crisis keywords detected display */}
              {analysisResult?.crisisIndicators &&
                analysisResult.crisisIndicators.length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded border">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      <strong>Support available for concerns about:</strong>{" "}
                      {analysisResult.crisisIndicators.join(", ")}
                    </p>
                  </div>
                )}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCrisisFlow(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium"
              >
                I'm Safe Now
              </button>
              <a
                href={`tel:${currentEntry?.helplineInfo?.phone || "988"}`}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium text-center flex items-center justify-center"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen py-20 px-6 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            Vent It Out
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Share your feelings safely and anonymously. Our AI will help you
            understand your emotions and provide personalized coping strategies.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-1 flex">
              <button
                onClick={() => setActiveTab("text")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "text"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
                }`}
              >
                <Type className="h-5 w-5 inline-block mr-2" />
                Text
              </button>
              <button
                onClick={() => setActiveTab("voice")}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === "voice"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
                }`}
              >
                <Mic className="h-5 w-5 inline-block mr-2" />
                Voice
              </button>
            </div>
          </div>

          {/* Text Input */}
          {activeTab === "text" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How are you feeling? Share what's on your mind...
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your thoughts and feelings here. Remember, this is a safe space..."
                  className="w-full h-32 p-4 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {textInput.length}/500
                </div>
              </div>
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim() || isAnalyzing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Analyze My Feelings</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Voice Input */}
          {activeTab === "voice" && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Record a voice message (up to 1 minute). Share what's on your
                  mind.
                </p>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-8">
                  {!isRecording && !audioBlob && (
                    <button
                      onClick={startRecording}
                      className="bg-blue-600 hover:bg-blue-700 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-colors"
                    >
                      <Mic className="h-8 w-8" />
                    </button>
                  )}

                  {isRecording && (
                    <div className="text-center">
                      <button
                        onClick={stopRecording}
                        className="bg-red-600 hover:bg-red-700 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-colors animate-pulse"
                      >
                        <MicOff className="h-8 w-8" />
                      </button>
                      <p className="text-red-600 dark:text-red-400 mt-4 font-medium">
                        Recording... Click to stop
                      </p>
                    </div>
                  )}

                  {audioBlob && (
                    <div className="text-center">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Recording completed! Ready to analyze.
                      </p>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => setAudioBlob(null)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                        >
                          Record Again
                        </button>
                        <button
                          onClick={handleVoiceSubmit}
                          disabled={isAnalyzing}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
                        >
                          {isAnalyzing ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Analyzing Voice...</span>
                            </>
                          ) : (
                            <>
                              <Brain className="h-4 w-4" />
                              <span>Analyze</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {currentEntry && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Your Emotional Analysis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Detected Emotion
                </h3>
                <p
                  className={`text-2xl font-bold capitalize ${getEmotionColor(
                    currentEntry.emotion
                  )}`}
                >
                  {currentEntry.emotion}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Confidence: {Math.round(currentEntry.confidence * 100)}%
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Entry Type
                </h3>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {currentEntry.type} Message
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {currentEntry.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Personalized Coping Response
              </h3>
              <p className="text-blue-700 dark:text-blue-400">
                {currentEntry.copingResponse}
              </p>
            </div>
          </div>
        )}

        {/* Crisis Flow Modal */}
        {showCrisisFlow && <CrisisFlow />}
      </div>
    </main>
  );
};

export default VentItOut;
