import React from 'react';
import ChatInterface from '../components/ChatInterface';
import MoodTracker from '../components/MoodTracker';

const AIAssistance = () => {
  return (
    <main className="min-h-screen py-20 px-6 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
            Your AI Mental Health Assistant
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Chat with Adma, track your mood, and receive personalized support for better mental health.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <MoodTracker />
          </div>
          <div>
            <ChatInterface />
          </div>
        </div>
      </div>
    </main>
  );
};

export default AIAssistance;