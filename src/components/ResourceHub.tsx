import React, { useState } from "react";
import { Play, Globe, Clock } from "lucide-react";
import { videoResources, VideoResource } from "../data/resourceData";

const ResourceHub = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<"all" | "EN" | "HI">(
    "all"
  );
  const [selectedVideo, setSelectedVideo] = useState<VideoResource | null>(
    null
  );

  // Curated video resources from the YouTube playlist
  const videoResources: VideoResource[] = [
    {
      id: "1",
      title: "Understanding Mental Health: Breaking the Stigma",
      description:
        "Learn about mental health awareness and how to break stigma in society.",
      thumbnail: "https://img.youtube.com/vi/DxIDKZHW3-E/maxresdefault.jpg",
      duration: "09:19",
      language: "EN",
      videoId: "gy1iH_Gxn0Q",
      category: "Awareness",
    },
    {
      id: "2",
      title: "Stress Management Techniques for Students",
      description:
        "Practical strategies to manage academic and personal stress effectively.",
      thumbnail: "https://img.youtube.com/vi/Bk2-dKH2Ta4/maxresdefault.jpg",
      duration: "08:41",
      language: "EN",
      videoId: "Bk2-dKH2Ta4",
      category: "Coping",
    },
    {
      id: "3",
      title: "मानसिक स्वास्थ्य की जानकारी - Mental Health Awareness",
      description:
        "मानसिक स्वास्थ्य के बारे में जानकारी और इसके महत्व पर चर्चा।",
      thumbnail: "https://img.youtube.com/vi/MaFv-SMgHb0/maxresdefault.jpg",
      duration: "07:01",
      language: "HI",
      videoId: "MaFv-SMgHb0",
      category: "Awareness",
    },
    {
      id: "4",
      title: "4 Ways to Cope With Depression",
      description:
        "Let’s talk about how to fight depression and improve your mental health together. ",
      thumbnail: "https://img.youtube.com/vi/gyQX6bU1NIY/maxresdefault.jpg",
      duration: "05:36",
      language: "EN",
      videoId: "gyQX6bU1NIY",
      category: "Treatment",
    },
    {
      id: "5",
      title: "तनाव प्रबंधन - Stress Management Techniques",
      description: "तनाव को कम करने के लिए प्रभावी तकनीकें और रणनीतियां।",
      thumbnail: "https://img.youtube.com/vi/nlD9HiRiLZ4/maxresdefault.jpg",
      duration: "14:18",
      language: "HI",
      videoId: "nlD9HiRiLZ4",
      category: "Coping",
    },
    {
      id: "6",
      title: "How to Deal With Anxiety - The Step-by-Step Guide",
      description:
        "Learn a 5-step guide to manage anxiety effectively. Discover how to observe, accept, explore, act, and reflect to overcome anxiety with Emma McAdam's expert advice",
      thumbnail: "https://img.youtube.com/vi/PxjxY9VilCs/maxresdefault.jpg",
      duration: "26:47",
      language: "EN",
      videoId: "PxjxY9VilCs",
      category: "Treatment",
    },
  ];

  const filteredVideos = videoResources.filter(
    (video) => selectedLanguage === "all" || video.language === selectedLanguage
  );

  const VideoModal = ({
    video,
    onClose,
  }: {
    video: VideoResource;
    onClose: () => void;
  }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            {video.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="p-4">
          <p className="text-gray-600 dark:text-gray-300">
            {video.description}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          📚 Psychoeducational Resource Hub
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Access curated mental health resources including educational videos to
          improve awareness, reduce stigma, and learn healthy coping strategies.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0">
        {/* Language Filter */}
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <select
            value={selectedLanguage}
            onChange={(e) =>
              setSelectedLanguage(e.target.value as "all" | "EN" | "HI")
            }
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Languages</option>
            <option value="EN">English</option>
            <option value="HI">Hindi</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div
              className="relative group cursor-pointer"
              onClick={() => setSelectedVideo(video)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                <div className="bg-white bg-opacity-0 group-hover:bg-opacity-90 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-all">
                  <Play className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                {video.duration}
              </div>
              <div className="absolute top-2 left-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    video.language === "EN"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {video.language}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
                {video.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                {video.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded text-xs">
                  {video.category}
                </span>
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
                >
                  Watch Now →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default ResourceHub;
