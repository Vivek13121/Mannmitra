import React, { useState } from "react";
import {
  Brain,
  CheckCircle,
  AlertTriangle,
  Heart,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  text: string;
  type: "likert" | "multiple";
  options: string[];
  category: "stress" | "anxiety" | "depression" | "wellbeing";
}

interface AssessmentResult {
  totalScore: number;
  maxScore: number;
  level: "low" | "moderate" | "high";
  category: string;
  recommendations: string[];
  resources: string[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "Over the past two weeks, how often have you felt down, depressed, or hopeless?",
    type: "likert",
    options: [
      "Not at all",
      "Several days",
      "More than half the days",
      "Nearly every day",
    ],
    category: "depression",
  },
  {
    id: 2,
    text: "How often do you feel nervous, anxious, or on edge?",
    type: "likert",
    options: [
      "Not at all",
      "Several days",
      "More than half the days",
      "Nearly every day",
    ],
    category: "anxiety",
  },
  {
    id: 3,
    text: "How well are you able to control the important things in your life?",
    type: "likert",
    options: ["Very well", "Fairly well", "Not very well", "Not at all well"],
    category: "stress",
  },
  {
    id: 4,
    text: "Over the past two weeks, how often have you had trouble falling or staying asleep?",
    type: "likert",
    options: [
      "Not at all",
      "Several days",
      "More than half the days",
      "Nearly every day",
    ],
    category: "wellbeing",
  },
  {
    id: 5,
    text: "How often do you feel overwhelmed by your daily responsibilities?",
    type: "likert",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    category: "stress",
  },
  {
    id: 6,
    text: "Over the past two weeks, how often have you had little interest or pleasure in doing things?",
    type: "likert",
    options: [
      "Not at all",
      "Several days",
      "More than half the days",
      "Nearly every day",
    ],
    category: "depression",
  },
  {
    id: 7,
    text: "How often do you worry about things that might happen in the future?",
    type: "likert",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    category: "anxiety",
  },
  {
    id: 8,
    text: "How satisfied are you with your current social relationships?",
    type: "likert",
    options: [
      "Very satisfied",
      "Satisfied",
      "Neutral",
      "Dissatisfied",
      "Very dissatisfied",
    ],
    category: "wellbeing",
  },
  {
    id: 9,
    text: "How often do you feel that you cannot cope with all the things you have to do?",
    type: "likert",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
    category: "stress",
  },
  {
    id: 10,
    text: "Over the past month, how would you rate your overall mental health?",
    type: "likert",
    options: ["Excellent", "Very good", "Good", "Fair", "Poor"],
    category: "wellbeing",
  },
];

const MentalHealthAssessment = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const calculateResults = () => {
    const totalScore = Object.values(answers).reduce(
      (sum, score) => sum + score,
      0
    );
    const maxScore = questions.length * 4; // Assuming max 4 points per question
    const percentage = (totalScore / maxScore) * 100;

    let level: "low" | "moderate" | "high";
    let category: string;
    let recommendations: string[];
    let resources: string[];

    if (percentage <= 30) {
      level = "low";
      category = "Low Risk - Good Mental Health";
      recommendations = [
        "Continue maintaining your current healthy habits",
        "Join campus wellness programs and activities",
        "Practice regular self-care and stress management",
        "Stay connected with supportive friends and family",
        "Consider mindfulness or meditation practices for prevention",
      ];
      resources = [
        "Campus wellness center programs",
        "Peer support groups",
        "Daily mindfulness exercises",
        "Gratitude journaling",
        "Regular physical activity programs",
      ];
    } else if (percentage <= 60) {
      level = "moderate";
      category = "Moderate Risk - Early Intervention Recommended";
      recommendations = [
        "Schedule appointment with campus counseling center",
        "Participate in stress management workshops",
        "Consider joining peer support programs",
        "Practice evidence-based stress reduction techniques",
        "Maintain regular sleep and eating schedules",
        "Connect with trusted campus support persons",
      ];
      resources = [
        "On-campus counseling services",
        "Government mental health helplines",
        "Cognitive Behavioral Therapy (CBT) programs",
        "Campus stress reduction workshops",
        "Student support services",
        "Regional language counseling support",
      ];
    } else {
      level = "high";
      category = "High Risk - Immediate Professional Support Required";
      recommendations = [
        "URGENT: Contact campus counseling center immediately",
        "Call government mental health crisis helpline",
        "Reach out to trusted friends, family, or faculty",
        "Consider visiting nearest government health facility",
        "Focus on immediate safety and basic self-care",
        "Follow up with licensed mental health professional within 24 hours",
      ];
      resources = [
        "National Mental Health Helpline: 1800-599-0019",
        "Campus emergency counseling services",
        "Government health centers with mental health units",
        "Licensed psychiatrists and clinical psychologists",
        "Crisis intervention services",
        "Jammu & Kashmir Mental Health Emergency Services",
      ];
    }

    setResult({
      totalScore,
      maxScore,
      level,
      category,
      recommendations,
      resources,
    });
    setShowResults(true);
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResult(null);
  };

  const handleAIAssistance = () => {
    navigate("/ai-assistance");
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / questions.length) * 100;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 dark:text-green-400";
      case "moderate":
        return "text-yellow-600 dark:text-yellow-400";
      case "high":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "low":
        return (
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        );
      case "moderate":
        return (
          <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
        );
      case "high":
        return (
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        );
      default:
        return <Brain className="h-8 w-8 text-gray-600 dark:text-gray-400" />;
    }
  };

  if (showResults && result) {
    return (
      <main className="min-h-screen py-20 px-6 bg-gradient-to-b from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 border border-gray-100 dark:border-slate-700">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {getLevelIcon(result.level)}
              </div>
              <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
                Assessment Complete
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Your Mental Health Assessment Results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Your Score
                </h3>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2 text-purple-600 dark:text-purple-400">
                    {Math.round((result.totalScore / result.maxScore) * 100)}%
                  </div>
                  <p
                    className={`text-lg font-medium ${getLevelColor(
                      result.level
                    )}`}
                  >
                    {result.category}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Risk Level
                </h3>
                <div className="flex items-center justify-center space-x-3">
                  {getLevelIcon(result.level)}
                  <span
                    className={`text-2xl font-semibold capitalize ${getLevelColor(
                      result.level
                    )}`}
                  >
                    {result.level} Risk
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                  <Heart className="h-6 w-6 mr-2 text-purple-600 dark:text-purple-400" />
                  Personalized Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800"
                    >
                      <p className="text-gray-700 dark:text-gray-300">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                  <Brain className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                  Recommended Resources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.resources.map((resource, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
                    >
                      <p className="text-gray-700 dark:text-gray-300">
                        {resource}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {result.level === "high" && (
              <div className="mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mr-2" />
                  <h4 className="text-lg font-semibold text-red-800 dark:text-red-300">
                    Important Notice
                  </h4>
                </div>
                <p className="text-red-700 dark:text-red-300 mb-4">
                  Your assessment indicates you may benefit from professional
                  mental health support. Please consider reaching out to a
                  mental health professional or crisis support service.
                </p>
                <div className="space-y-2 text-sm text-red-600 dark:text-red-400">
                  <p>
                    <strong>Crisis Helpline:</strong> 1800-180-2005 (24/7)
                  </p>
                  <p>
                    <strong>PGIMER Emergency:</strong> 0172-2756565
                  </p>
                  <p>
                    <strong>GMSH-16 Emergency:</strong> 0172-2701201
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={resetAssessment}
                className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-gray-300 dark:hover:bg-slate-600 flex items-center space-x-2"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Take Assessment Again</span>
              </button>
              <button
                onClick={handleAIAssistance}
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>Get AI Support</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <main className="min-h-screen py-20 px-6 bg-gradient-to-b from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
            Mental Health Assessment
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            This assessment will help evaluate your current mental well-being
            and provide personalized recommendations.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 border border-gray-100 dark:border-slate-700">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(getProgressPercentage())}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
              {currentQ.text}
            </h2>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQ.id, index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                    answers[currentQ.id] === index
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                      : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 text-gray-700 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-600"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        answers[currentQ.id] === index
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {answers[currentQ.id] === index && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-gray-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <button
              onClick={nextQuestion}
              disabled={answers[currentQ.id] === undefined}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>
                {currentQuestion === questions.length - 1
                  ? "Complete Assessment"
                  : "Next"}
              </span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                Important Disclaimer
              </h4>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                This assessment is for informational purposes only and is not a
                substitute for professional medical advice, diagnosis, or
                treatment. If you're experiencing a mental health crisis, please
                contact emergency services or a mental health crisis line
                immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MentalHealthAssessment;
