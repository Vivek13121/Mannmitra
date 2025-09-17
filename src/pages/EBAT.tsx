import React, { useState } from 'react';
import { Brain, BarChart3, Wand2, Headphones } from 'lucide-react';
import VoiceAnalysis from '../components/VoiceAnalysis';

const EBAT = () => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-teal-50 to-white dark:from-teal-900/20 dark:to-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
                Emotion-Based <span className="text-teal-600 dark:text-teal-400">Adaptive Therapy</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Our AI-powered EBAT system analyzes your emotional state in real-time and adapts therapeutic approaches to provide personalized support when you need it most.
              </p>
              <button 
                onClick={() => setShowDemo(true)}
                className="bg-gradient-to-r from-teal-600 to-blue-500 hover:from-teal-500 hover:to-blue-400 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Try EBAT Now
              </button>
            </div>
            <div className="relative">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 border border-gray-100 dark:border-slate-700">
                <div className="flex items-center justify-center mb-8">
                  <Brain className="h-16 w-16 text-teal-600 dark:text-teal-400" />
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
                  Real-time Emotional Analysis
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                  EBAT uses advanced AI to analyze your emotional state through:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
                    <Headphones className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    <span className="text-gray-700 dark:text-gray-200">Voice Modulation Analysis</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-200">Text Sentiment Detection</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <Wand2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-gray-700 dark:text-gray-200">Dynamic Therapy Adjustments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      {showDemo && (
        <section className="py-20 px-6 bg-gray-50 dark:bg-slate-800/50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
                Experience EBAT
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Try our voice emotion analysis to see how EBAT can understand and respond to your emotional state.
              </p>
            </div>
            
            <VoiceAnalysis />
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              How EBAT Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our emotion-based adaptive therapy system provides personalized support based on your emotional state.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-slate-700">
              <div className="bg-teal-100 dark:bg-teal-900/50 p-4 rounded-full inline-flex mb-6">
                <Brain className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Emotional Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                EBAT analyzes your voice modulation, text sentiment, and optional facial expressions to assess your emotional state.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-slate-700">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full inline-flex mb-6">
                <Wand2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Personalized Interventions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Based on your emotional state, EBAT suggests personalized interventions like meditation, mood-lifting activities, or therapist check-ins.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-slate-700">
              <div className="bg-purple-100 dark:bg-purple-900/50 p-4 rounded-full inline-flex mb-6">
                <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Therapist Insights
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                During teletherapy sessions, therapists receive AI-driven emotional insights to help them adjust their approach for more effective guidance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EBAT;