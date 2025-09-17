import { AlertTriangle, Users, Brain, TrendingDown } from "lucide-react";

const SIHProblemSection = () => {
  const problems = [
    {
      icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
      title: "Rising Mental Health Crisis",
      description:
        "Anxiety, depression, burnout, and academic stress are significantly increasing among college students nationwide.",
    },
    {
      icon: <TrendingDown className="h-12 w-12 text-orange-500" />,
      title: "Gap in Mental Health Support",
      description:
        "Major shortage of accessible, scalable, and stigma-free psychological intervention systems in higher education.",
    },
    {
      icon: <Users className="h-12 w-12 text-yellow-500" />,
      title: "Under-utilized Counseling Centers",
      description:
        "Students avoid campus counseling due to fear of judgment, lack of awareness, or inadequate resources.",
    },
    {
      icon: <Brain className="h-12 w-12 text-blue-500" />,
      title: "No Data-Driven Framework",
      description:
        "Absence of centralized mental health monitoring and evidence-based policy framework within institutions.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-red-50 dark:bg-red-900/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            The Mental Health Crisis in Higher Education
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            As identified by the Government of Jammu & Kashmir Higher Education
            Department, colleges face unprecedented mental health challenges
            requiring immediate technological intervention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded-lg">
                  {problem.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                    {problem.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {problem.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SIHProblemSection;
