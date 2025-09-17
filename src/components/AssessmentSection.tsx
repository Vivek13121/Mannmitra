import React from "react";
import {
  ClipboardCheck,
  Brain,
  Heart,
  TrendingUp,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AssessmentSection = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleStartAssessment = () => {
    // Direct navigation - no authentication required
    navigate("/assessment");
  };

  return (
    <section
      className={`py-12 px-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 transition-all duration-500 ${
        isExpanded ? "py-20" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Compact Preview */}
        {!isExpanded && (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full">
                <ClipboardCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Mental Health Assessment
              </h2>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Take our comprehensive assessment to understand your well-being
              and receive personalized recommendations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleStartAssessment}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Start Assessment</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setIsExpanded(true)}
                className="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium transition-colors duration-300"
              >
                <span>Learn More</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Expanded View */}
        {isExpanded && (
          <div className="space-y-8">
            <div className="text-center">
              <button
                onClick={() => setIsExpanded(false)}
                className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-500 mb-4 transition-colors duration-300"
              >
                <ChevronUp className="h-4 w-4" />
                <span>Show Less</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-full">
                    <ClipboardCheck className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                    Mental Health Assessment
                  </h2>
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Take our comprehensive mental health assessment to understand
                  your current well-being and receive personalized
                  recommendations tailored to your needs.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Scientifically-backed assessment questions
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Personalized mental health recommendations
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Track your progress over time
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleStartAssessment}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span>Start Assessment</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              <div className="relative">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 border border-gray-100 dark:border-slate-700">
                  <div className="text-center mb-6">
                    <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full inline-block mb-4">
                      <ClipboardCheck className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      Quick & Comprehensive
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      10 carefully selected questions covering key mental health
                      areas
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
                          Stress Assessment
                        </span>
                        <span className="text-xs text-indigo-600 dark:text-indigo-400">
                          3 questions
                        </span>
                      </div>
                      <div className="w-full bg-indigo-200 dark:bg-indigo-800 rounded-full h-2">
                        <div
                          className="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full"
                          style={{ width: "30%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                          Anxiety Evaluation
                        </span>
                        <span className="text-xs text-purple-600 dark:text-purple-400">
                          2 questions
                        </span>
                      </div>
                      <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                        <div
                          className="bg-purple-600 dark:bg-purple-400 h-2 rounded-full"
                          style={{ width: "20%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          Depression Screening
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                          2 questions
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                        <div
                          className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                          style={{ width: "20%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-800 dark:text-green-300">
                          Overall Wellbeing
                        </span>
                        <span className="text-xs text-green-600 dark:text-green-400">
                          3 questions
                        </span>
                      </div>
                      <div className="w-full bg-green-200 dark:bg-green-800 rounded-full h-2">
                        <div
                          className="bg-green-600 dark:bg-green-400 h-2 rounded-full"
                          style={{ width: "30%" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Takes approximately 5-7 minutes to complete
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AssessmentSection;
