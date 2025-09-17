import React, { useState } from "react";
import { useStore } from "../lib/store-anonymous"; // Using anonymous store
import { Smile, Meh, Frown, BarChart } from "lucide-react";

export default function MoodTracker() {
  const [notes, setNotes] = useState("");
  const { moodEntries, addMoodEntry } = useStore();

  const handleMoodSubmit = (mood: number) => {
    addMoodEntry(mood, notes);
    setNotes("");
  };

  const getMoodIcon = (mood: number) => {
    switch (mood) {
      case 1:
        return <Frown className="h-6 w-6 text-red-500" />;
      case 2:
        return <Meh className="h-6 w-6 text-yellow-500" />;
      case 3:
        return <Smile className="h-6 w-6 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-100 dark:border-slate-700">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Daily Mood Check-in
      </h2>

      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          How are you feeling today?
        </p>
        <div className="flex justify-center space-x-4">
          {[1, 2, 3].map((mood) => (
            <button
              key={mood}
              onClick={() => handleMoodSubmit(mood)}
              className="p-4 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {getMoodIcon(mood)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about your mood (optional)"
          className="w-full bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200"
          rows={3}
        />
      </div>

      <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
          <BarChart className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Mood History
        </h3>
        <div className="space-y-2">
          {moodEntries
            .slice(-5)
            .reverse()
            .map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg"
              >
                <div className="flex items-center">
                  {getMoodIcon(entry.mood)}
                  <span className="ml-2 text-gray-600 dark:text-gray-300">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </div>
                {entry.notes && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                    {entry.notes}
                  </span>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
