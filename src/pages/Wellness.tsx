import React from "react";
import { useLocation, Link, Routes, Route, Navigate } from "react-router-dom";
import GuidedMeditations from "./wellness/GuidedMeditations";
import SelfCareTips from "./wellness/SelfCareTips";
import ResourceHub from "../components/ResourceHub";

const Wellness = () => {
  const location = useLocation();
  const isGuidedMeditations = location.pathname.includes("guided-meditations");
  const isSelfCareTips = location.pathname.includes("self-care-tips");
  const isResourceHub = location.pathname.includes("resource-hub");

  return (
    <main className="min-h-screen py-20 px-6 bg-gradient-to-b from-green-50 to-white dark:from-green-900/20 dark:to-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
            Mindfulness & Wellness
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover peace of mind through guided meditations, daily self-care
            practices, and educational resources.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-4 mb-12">
          <Link
            to="/wellness/guided-meditations"
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              isGuidedMeditations
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-slate-700"
            }`}
          >
            Guided Meditations
          </Link>
          <Link
            to="/wellness/self-care-tips"
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              isSelfCareTips
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-slate-700"
            }`}
          >
            Self-Care Tips
          </Link>
          <Link
            to="/wellness/resource-hub"
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              isResourceHub
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-slate-700"
            }`}
          >
            📚 Resource Hub
          </Link>
        </div>

        <Routes>
          <Route
            path="/"
            element={<Navigate to="/wellness/guided-meditations" replace />}
          />
          <Route path="/guided-meditations" element={<GuidedMeditations />} />
          <Route path="/self-care-tips" element={<SelfCareTips />} />
          <Route path="/resource-hub" element={<ResourceHub />} />
        </Routes>
      </div>
    </main>
  );
};

export default Wellness;
