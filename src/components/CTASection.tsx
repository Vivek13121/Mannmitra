import React from 'react';
import { Brain, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => navigate('/assessment');
  const handleViewFeatures = () => navigate('/wellness');

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-teal-600 to-blue-600 dark:from-teal-900 dark:to-blue-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white"></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Begin Your Mental Wellness Journey Today</h2>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Explore MannMitra's AI-powered mental wellness tools, assessments, resources, and confidential support without creating an account.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button onClick={handleGetStarted} className="bg-white text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl text-center">
                Get Started Free
              </button>
              <button onClick={handleViewFeatures} className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-full font-medium transition-all duration-300 text-center">
                View Features
              </button>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl font-semibold mb-6 text-center">Why Choose MannMitra?</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4"><div className="bg-white/20 p-3 rounded-lg"><Brain className="h-6 w-6 text-white" /></div><div><h4 className="font-semibold text-lg mb-1">AI-Powered Personalization</h4><p className="text-white/80">Adaptive support that responds to your emotional state in real-time.</p></div></div>
              <div className="flex items-start space-x-4"><div className="bg-white/20 p-3 rounded-lg"><Shield className="h-6 w-6 text-white" /></div><div><h4 className="font-semibold text-lg mb-1">Privacy & Security</h4><p className="text-white/80">Your wellness experience does not require a visible account or sign-in.</p></div></div>
              <div className="flex items-start space-x-4"><div className="bg-white/20 p-3 rounded-lg"><Sparkles className="h-6 w-6 text-white" /></div><div><h4 className="font-semibold text-lg mb-1">Engaging Experience</h4><p className="text-white/80">Explore practical tools and personalized wellness activities at your own pace.</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
