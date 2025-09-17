import React, { useState, useEffect } from "react";
import { useAuthStore } from "../lib/auth-store";
import {
  Users,
  AlertTriangle,
  TrendingUp,
  Activity,
  Brain,
  MessageCircle,
  Clock,
  Shield,
  UserCheck,
  BarChart3,
  Settings,
  Download,
  PieChart,
  Target,
  Zap,
  Bell,
  Filter,
  Calendar,
  Search,
} from "lucide-react";
import EmotionTrendsCharts from "./EmotionTrendsCharts";
import RealTimeEmotionDashboard from "./RealTimeEmotionDashboard";
import AdvancedAnalytics from "./AdvancedAnalytics";
import BookingManagement from "./BookingManagement";

// Mock data for admin dashboard
const mockDashboardData = {
  totalUsers: 2847,
  activeUsers: 1205,
  crisisAlerts: 23,
  avgResponseTime: "2.3 min",
  weeklyGrowth: 12.5,
  monthlyGrowth: 47.8,
  systemHealth: 98.7,
  interventionSuccess: 84.3,
};

const mockCrisisAlerts = [
  {
    id: 1,
    student: "Student #2847",
    severity: "High",
    trigger: "Suicide ideation detected",
    time: "5 min ago",
    status: "Active",
    counselor: "Dr. Smith",
  },
  {
    id: 2,
    student: "Student #2831",
    severity: "Critical",
    trigger: "Self-harm indicators",
    time: "12 min ago",
    status: "Responded",
    counselor: "Dr. Johnson",
  },
  {
    id: 3,
    student: "Student #2819",
    severity: "Medium",
    trigger: "High stress pattern",
    time: "23 min ago",
    status: "Monitored",
    counselor: "Counselor Lee",
  },
];

const mockRecentActivities = [
  { action: "New user registration", time: "2 min ago", type: "user" },
  { action: "Crisis alert resolved", time: "8 min ago", type: "crisis" },
  { action: "Therapy session completed", time: "15 min ago", type: "session" },
  { action: "Assessment completed", time: "23 min ago", type: "assessment" },
  { action: "Counselor logged in", time: "31 min ago", type: "staff" },
];

interface AdminDashboardProps {
  className?: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ className = "" }) => {
  const { user, signOut } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [crisisAlerts, setCrisisAlerts] = useState(mockCrisisAlerts);
  const [activities, setActivities] = useState(mockRecentActivities);

  useEffect(() => {
    // Load demo data immediately for SIH demonstration
    const loadDemoData = () => {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setDashboardData(mockDashboardData);
        setCrisisAlerts(mockCrisisAlerts);
        setActivities(mockRecentActivities);
        setLoading(false);
      }, 800);
    };

    loadDemoData();
  }, []);

  const handleResolveCrisis = (alertId: number) => {
    setCrisisAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: "Resolved" } : alert
      )
    );
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "realtime", label: "Real-time Monitor", icon: Activity },
    { id: "trends", label: "Emotion Trends", icon: TrendingUp },
    { id: "analytics", label: "Advanced Analytics", icon: Brain },
    { id: "bookings", label: "Booking Management", icon: Calendar },
    { id: "crisis", label: "Crisis Management", icon: AlertTriangle },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                MannMitra Admin
              </h1>
              <div className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Live Demo
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {
                    crisisAlerts.filter((alert) => alert.status === "Active")
                      .length
                  }
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <UserCheck className="h-4 w-4 mr-1" />
                <span>Admin User</span>
              </div>
              <button
                onClick={signOut}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Total Users
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardData.totalUsers.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600">
                      +{dashboardData.weeklyGrowth}% this week
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Active Now
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardData.activeUsers.toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-600">
                      {(
                        (dashboardData.activeUsers / dashboardData.totalUsers) *
                        100
                      ).toFixed(1)}
                      % of total
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Crisis Alerts
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardData.crisisAlerts}
                    </p>
                    <p className="text-sm text-red-600">
                      {
                        crisisAlerts.filter(
                          (alert) => alert.status === "Active"
                        ).length
                      }{" "}
                      active
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Avg Response
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {dashboardData.avgResponseTime}
                    </p>
                    <p className="text-sm text-green-600">-15% vs last month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Crisis Alerts & Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Crisis Alerts */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                      Active Crisis Alerts
                    </h3>
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {
                        crisisAlerts.filter(
                          (alert) => alert.status === "Active"
                        ).length
                      }{" "}
                      Active
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {crisisAlerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">
                              {alert.student}
                            </p>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                alert.severity === "Critical"
                                  ? "bg-red-100 text-red-800"
                                  : alert.severity === "High"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {alert.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {alert.trigger}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                            <span>{alert.time}</span>
                            <span>Assigned: {alert.counselor}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          {alert.status === "Active" && (
                            <button
                              onClick={() => handleResolveCrisis(alert.id)}
                              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            >
                              Respond
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Activity className="h-5 w-5 text-blue-600 mr-2" />
                    Recent Activities
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {activities.map((activity, index) => (
                    <div key={index} className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.type === "crisis"
                              ? "bg-red-500"
                              : activity.type === "session"
                              ? "bg-green-500"
                              : activity.type === "user"
                              ? "bg-blue-500"
                              : activity.type === "assessment"
                              ? "bg-purple-500"
                              : "bg-gray-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 text-green-600 mr-2" />
                System Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {dashboardData.systemHealth}%
                  </div>
                  <div className="text-sm text-gray-500">System Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {dashboardData.interventionSuccess}%
                  </div>
                  <div className="text-sm text-gray-500">
                    Intervention Success
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {dashboardData.avgResponseTime}
                  </div>
                  <div className="text-sm text-gray-500">Avg Response Time</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Monitor Tab */}
        {activeTab === "realtime" && <RealTimeEmotionDashboard />}

        {/* Emotion Trends Tab */}
        {activeTab === "trends" && <EmotionTrendsCharts />}

        {/* Advanced Analytics Tab */}
        {activeTab === "analytics" && <AdvancedAnalytics />}

        {/* Booking Management Tab */}
        {activeTab === "bookings" && <BookingManagement />}

        {/* Crisis Management Tab */}
        {activeTab === "crisis" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Crisis Management Center
              </h3>
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>Crisis management features coming soon...</p>
                <p className="text-sm">
                  This will include escalation protocols, emergency contacts,
                  and intervention tracking.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                System Settings
              </h3>
              <div className="text-center py-8 text-gray-500">
                <Settings className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>Settings panel coming soon...</p>
                <p className="text-sm">
                  This will include system configuration, user management, and
                  alert thresholds.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
