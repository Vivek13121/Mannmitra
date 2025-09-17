import {
  MessageCircle,
  Calendar,
  BookOpen,
  Users,
  BarChart3,
  Shield,
} from "lucide-react";

const SIHSolutionFlow = () => {
  const studentFlow = [
    {
      step: "1",
      icon: <MessageCircle className="h-8 w-8 text-blue-500" />,
      title: "AI-Guided First-Aid Support",
      description:
        "Students can anonymously chat with our AI assistant 24/7 for immediate coping strategies and mental health guidance.",
      color: "bg-blue-500",
    },
    {
      step: "2",
      icon: <Calendar className="h-8 w-8 text-purple-500" />,
      title: "Confidential Booking",
      description:
        "Secure appointment scheduling with on-campus counselors and verified mental health professionals.",
      color: "bg-purple-500",
    },
    {
      step: "3",
      icon: <BookOpen className="h-8 w-8 text-green-500" />,
      title: "Resource Hub Access",
      description:
        "Access curated mental wellness videos, relaxation audio, and guides in regional languages.",
      color: "bg-green-500",
    },
    {
      step: "4",
      icon: <Users className="h-8 w-8 text-pink-500" />,
      title: "Health Assessment",
      description:
        "Complete comprehensive mental health assessments to track your wellbeing and receive personalized recommendations.",
      color: "bg-pink-500",
    },
  ];

  const adminBenefits = [
    {
      icon: <BarChart3 className="h-8 w-8 text-teal-500" />,
      title: "Anonymous Analytics",
      description:
        "Track campus mental health trends without compromising student privacy",
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-500" />,
      title: "Early Intervention",
      description: "Identify mental health spikes before they become crises",
    },
  ];

  return (
    <section className="py-20 px-6 bg-blue-50 dark:bg-blue-900/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Student Interaction Flow */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            How Students Interact with MannMitra
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A seamless, stigma-free journey from first contact to comprehensive
            mental health support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {studentFlow.map((item, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < studentFlow.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 z-0"></div>
              )}

              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 relative z-10">
                <div
                  className={`${item.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto`}
                >
                  {item.step}
                </div>
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white text-center">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Benefits */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-slate-700">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              For College Administrators
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Data-driven insights for evidence-based mental health policy
              framework
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {adminBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded-lg">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SIHSolutionFlow;
