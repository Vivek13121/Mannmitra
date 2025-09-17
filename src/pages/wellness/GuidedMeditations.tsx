import React from 'react';
import { Play } from 'lucide-react';

interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
}

const meditations: Meditation[] = [
  {
    id: '1',
    title: '5-Minute Meditation for Anxiety',
    description: 'A quick meditation to help calm anxiety and racing thoughts.',
    duration: '5 minutes',
    thumbnailUrl: 'https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=1280',
    videoUrl: 'https://www.youtube.com/watch?v=inpok4MKVLM'
  },
  {
    id: '2',
    title: '10-Minute Body Scan Meditation',
    description: 'Guided body scan meditation for deep relaxation and stress relief.',
    duration: '10 minutes',
    thumbnailUrl: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1280',
    videoUrl: 'https://www.youtube.com/watch?app=desktop&v=uqtIqCKjkuc'
  },
  {
    id: '3',
    title: 'Morning Mindfulness Meditation',
    description: 'Start your day with clarity and positive energy.',
    duration: '15 minutes',
    thumbnailUrl: 'https://images.pexels.com/photos/3094230/pexels-photo-3094230.jpeg?auto=compress&cs=tinysrgb&w=1280',
    videoUrl: 'https://www.youtube.com/watch?v=0y1DrTURM2Q'
  }
];

const GuidedMeditations = () => {
  const handleStartMeditation = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {meditations.map((meditation) => (
        <div
          key={meditation.id}
          className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-700"
        >
          <div className="relative aspect-video bg-gray-100 dark:bg-slate-900 overflow-hidden group">
            <img
              src={meditation.thumbnailUrl}
              alt={meditation.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="h-12 w-12 text-white" />
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              {meditation.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {meditation.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Play className="h-4 w-4 mr-1" />
                {meditation.duration}
              </span>
              <button 
                onClick={() => handleStartMeditation(meditation.videoUrl)}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Start Meditation</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GuidedMeditations;