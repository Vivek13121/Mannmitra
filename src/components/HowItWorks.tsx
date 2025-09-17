import React from 'react';
import { Brain, MessageSquare, UserCheck, BarChart } from 'lucide-react';

const steps = [
  {
    icon: <Brain className="h-8 w-8 text-white" />,
    title: "AI Analysis",
    description: "Our AI analyzes your emotional state through voice modulation, text sentiment, and optional facial recognition.",
    color: "bg-teal-600 dark:bg-teal-500",
    number: "01"
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-white" />,
    title: "Personalized Recommendations",
    description: "Based on your emotional state, MannMitra suggests personalized interventions like meditation or therapist check-ins.",
    color: "bg-blue-600 dark:bg-blue-500",
    number: "02"
  },
  {
    icon: <UserCheck className="h-8 w-8 text-white" />,
    title: "Expert Support",
    description: "Connect with therapists who receive AI-driven insights to provide more effective guidance during sessions.",
    color: "bg-purple-600 dark:bg-purple-500",
    number: "03"
  },
  {
    icon: <BarChart className="h-8 w-8 text-white" />,
    title: "Track Progress",
    description: "Monitor your emotional well-being over time with daily check-ins and personalized insights.",
    color: "bg-pink-600 dark:bg-pink-500",
    number: "04"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-6 bg-gray-50 dark:bg-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            How MannMitra Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our AI-powered platform adapts to your emotional needs in real-time, providing personalized mental wellness support.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gray-200 dark:bg-gray-700 z-0 transform -translate-x-1/2"></div>
              )}
              
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 relative z-10 border border-gray-100 dark:border-slate-700 h-full">
                <div className="flex flex-col items-center text-center">
                  <div className={`${step.color} p-4 rounded-full mb-6`}>
                    {step.icon}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                  
                  <div className="absolute -top-4 -right-4 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 text-xl font-bold w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800">
                    {step.number}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;