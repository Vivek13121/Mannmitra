import React from "react";
import { useStore } from "../lib/store-anonymous"; // Using anonymous store
import { CheckCircle2, Circle, RefreshCw } from "lucide-react";
import { generateWellnessPlan } from "../lib/ai";

export default function WellnessPlan() {
  const { wellnessPlans, moodEntries, addWellnessPlan, toggleTask } =
    useStore();
  const currentPlan = wellnessPlans[wellnessPlans.length - 1];

  const handleGenerateNewPlan = async () => {
    try {
      const tasks = await generateWellnessPlan(moodEntries);
      addWellnessPlan(tasks);
    } catch (error) {
      console.error("Error generating wellness plan:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-100 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Daily Wellness Plan
        </h2>
        <button
          onClick={handleGenerateNewPlan}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Generate New Plan</span>
        </button>
      </div>

      {currentPlan ? (
        <div className="space-y-4">
          {currentPlan.tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg"
            >
              <button
                onClick={() => toggleTask(currentPlan.id, task.id)}
                className="flex-shrink-0"
              >
                {task.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-400 dark:text-gray-600" />
                )}
              </button>
              <span
                className={`flex-1 text-gray-800 dark:text-gray-200 ${
                  task.completed
                    ? "line-through text-gray-500 dark:text-gray-400"
                    : ""
                }`}
              >
                {task.title}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No wellness plan generated yet.
          </p>
          <button
            onClick={handleGenerateNewPlan}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Generate Your First Plan
          </button>
        </div>
      )}
    </div>
  );
}
