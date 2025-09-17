import {
  Brain,
  MessageSquare,
  Video,
  ClipboardCheck,
  BookOpen,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: (
      <MessageSquare className="h-10 w-10 text-red-600 dark:text-red-400" />
    ),
    title: "Vent It Out",
    description:
      "Safe space to express emotions through text or voice. AI analyzes your feelings and provides personalized coping strategies with crisis detection.",
    link: "/vent-it-out",
    color: "from-red-500 to-red-600 dark:from-red-400 dark:to-red-500",
    hoverColor:
      "group-hover:from-red-400 group-hover:to-red-500 dark:group-hover:from-red-300 dark:group-hover:to-red-400",
  },
  {
    icon: <Brain className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
    title: "AI-Guided First-Aid Support",
    description:
      "Interactive chat bot offering immediate coping strategies and professional referrals when needed. Available 24/7 for college students.",
    link: "/ai-assistance",
    color: "from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500",
    hoverColor:
      "group-hover:from-blue-400 group-hover:to-blue-500 dark:group-hover:from-blue-300 dark:group-hover:to-blue-400",
  },
  {
    icon: <Video className="h-10 w-10 text-purple-600 dark:text-purple-400" />,
    title: "Confidential Booking System",
    description:
      "Secure appointment scheduling with on-campus counselors and mental health professionals. Regional language support included.",
    link: "/teletherapy",
    color:
      "from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500",
    hoverColor:
      "group-hover:from-purple-400 group-hover:to-purple-500 dark:group-hover:from-purple-300 dark:group-hover:to-purple-400",
  },
  {
    icon: <BookOpen className="h-10 w-10 text-green-600 dark:text-green-400" />,
    title: "Psychoeducational Resource Hub",
    description:
      "Curated videos, relaxation audio, and mental wellness guides in regional languages, designed for Indian college students.",
    link: "/wellness",
    color: "from-green-500 to-green-600 dark:from-green-400 dark:to-green-500",
    hoverColor:
      "group-hover:from-green-400 group-hover:to-green-500 dark:group-hover:from-green-300 dark:group-hover:to-green-400",
  },
  {
    icon: <Users className="h-10 w-10 text-pink-600 dark:text-pink-400" />,
    title: "Peer Support Platform",
    description:
      "Moderated peer-to-peer support forum with trained student volunteers. Safe space for college mental health discussions.",
    link: "/stress-relief",
    color: "from-pink-500 to-pink-600 dark:from-pink-400 dark:to-pink-500",
    hoverColor:
      "group-hover:from-pink-400 group-hover:to-pink-500 dark:group-hover:from-pink-300 dark:group-hover:to-pink-400",
  },
  {
    icon: (
      <ClipboardCheck className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
    ),
    title: "Anonymous Admin Dashboard",
    description:
      "Data analytics for college authorities to recognize mental health trends and plan targeted interventions across campus.",
    link: "/assessment",
    color:
      "from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500",
    hoverColor:
      "group-hover:from-indigo-400 group-hover:to-indigo-500 dark:group-hover:from-indigo-300 dark:group-hover:to-indigo-400",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-20 px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
            Digital Psychological Intervention Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Addressing mental health challenges in higher education with a
            comprehensive, scalable, and stigma-free intervention system
            designed for college students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link to={feature.link} key={index} className="group">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl p-6 transition-all duration-300 h-full border border-gray-100 dark:border-slate-700 hover:border-transparent dark:hover:border-transparent relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>

                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 p-3 rounded-lg inline-block mb-4">
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>

                  <div className="mt-6 inline-flex items-center text-teal-600 dark:text-teal-400 font-medium">
                    Learn more
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
