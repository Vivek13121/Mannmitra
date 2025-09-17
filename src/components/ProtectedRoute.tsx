import React, { ReactNode } from "react";
import { useAuthStore } from "../lib/auth-store";
import { Lock, User, Shield } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  onShowAuth: () => void;
  featureName?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  onShowAuth,
  featureName = "this feature",
}) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800 px-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Please sign in to access {featureName}. All MannMitra features
              require authentication to ensure privacy and personalized support.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={onShowAuth}
              className="w-full bg-gradient-to-r from-teal-600 to-blue-500 hover:from-teal-500 hover:to-blue-400 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Sign In / Sign Up</span>
            </button>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              <Shield className="h-4 w-4 inline mr-1" />
              Your privacy and data security are our top priority
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Why Sign In?
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 text-left">
              <li>• Personalized mental health assessments</li>
              <li>• Secure and confidential data storage</li>
              <li>• AI-powered insights tailored to you</li>
              <li>• Progress tracking over time</li>
              <li>• Anonymous crisis support when needed</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
