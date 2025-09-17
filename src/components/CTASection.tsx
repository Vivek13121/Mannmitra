import React from 'react';
import { Brain, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface CTASectionProps {
  onGetStarted: () => void;
}

const CTASection = ({ onGetStarted }: CTASectionProps) => {
  const navigate = useNavigate();
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (session) {
      // User is signed in, redirect to assessment
      navigate('/assessment');
    } else {
      // User is not signed in, show auth modal
      onGetStarted();
    }
  };

  const handleViewPricing = () => {
    if (session) {
      // User is signed in, redirect to wellness features
      navigate('/wellness');
    } else {
      // User is not signed in, show auth modal
      onGetStarted();
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-teal-600 to-blue-600 dark:from-teal-900 dark:to-blue-900 text-white relative overflow-hidden">
      {/* Background Elements */}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {session ? 'Continue Your Mental Wellness Journey' : 'Begin Your Mental Wellness Journey Today'}
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              {session 
                ? 'Explore more features and continue building better mental health habits with MannMitra\'s comprehensive platform.'
                : 'Join thousands of users who have transformed their mental health with MannMitra\'s AI-powered platform. Your journey to better mental wellness starts here.'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={handleGetStarted}
                className="bg-white text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl text-center"
              >
                {session ? 'Take Assessment' : 'Get Started Free'}
              </button>
              <button 
                onClick={handleViewPricing}
                className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-full font-medium transition-all duration-300 text-center"
              >
                {session ? 'Explore Wellness' : 'View Features'}
              </button>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl font-semibold mb-6 text-center">Why Choose MannMitra?</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">AI-Powered Personalization</h4>
                  <p className="text-white/80">
                    Adaptive therapy that responds to your emotional state in real-time.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Privacy & Security</h4>
                  <p className="text-white/80">
                    End-to-end encryption for all teletherapy sessions and personal data.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">Engaging Experience</h4>
                  <p className="text-white/80">
                    Gamified approach to mental wellness that keeps you motivated.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;