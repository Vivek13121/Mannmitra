import React from 'react';

const staticTips = [
  {
    id: 1,
    tip: "Take a 15-minute break from screens and practice mindful breathing.",
    category: "Digital Wellness"
  },
  {
    id: 2,
    tip: "Drink water mindfully - feel its temperature and observe how it makes you feel.",
    category: "Mindful Eating"
  },
  {
    id: 3,
    tip: "Step outside for a few minutes of fresh air and sunshine.",
    category: "Nature Connection"
  },
  {
    id: 4,
    tip: "Write down three things you're grateful for today.",
    category: "Gratitude"
  },
  {
    id: 5,
    tip: "Do a quick 5-minute stretch to release tension.",
    category: "Physical Wellness"
  },
  {
    id: 6,
    tip: "Listen to your favorite calming song without doing anything else.",
    category: "Music Therapy"
  },
  {
    id: 7,
    tip: "Practice the 5-4-3-2-1 grounding technique when feeling overwhelmed.",
    category: "Mindfulness"
  },
  {
    id: 8,
    tip: "Set boundaries with technology by creating phone-free zones in your home.",
    category: "Digital Wellness"
  },
  {
    id: 9,
    tip: "Take a warm bath or shower and focus on the sensations.",
    category: "Self-Care"
  },
  {
    id: 10,
    tip: "Call or text someone you care about just to check in.",
    category: "Social Connection"
  },
  {
    id: 11,
    tip: "Practice progressive muscle relaxation before bedtime.",
    category: "Sleep Hygiene"
  },
  {
    id: 12,
    tip: "Keep a small plant on your desk and take care of it daily.",
    category: "Nature Connection"
  }
];

const SelfCareTips = () => {
  return (
    <div className="space-y-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Daily Self-Care Tips
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Simple, practical tips to incorporate into your daily routine for better mental wellness.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staticTips.map((tip) => (
          <div
            key={tip.id}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300"
          >
            <span className="text-sm text-green-600 dark:text-green-400 font-medium mb-2 block">
              {tip.category}
            </span>
            <p className="text-gray-800 dark:text-gray-200">
              {tip.tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelfCareTips;