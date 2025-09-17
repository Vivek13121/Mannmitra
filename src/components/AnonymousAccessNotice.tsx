import { Shield, Users, Eye } from "lucide-react";

const AnonymousAccessNotice = () => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
            Anonymous & Safe Access
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300 mb-2">
            No signup required! Your data is stored locally and protected.
            Perfect for students who need mental health support without
            barriers.
          </p>
          <div className="flex items-center space-x-4 text-xs text-green-600 dark:text-green-400">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>Anonymous Session</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>No Personal Info Required</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Data Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousAccessNotice;
