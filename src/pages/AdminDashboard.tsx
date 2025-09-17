import React, { useState, useEffect } from "react";
import { useAuthStore } from "../lib/auth-store";
import { supabase } from "../lib/supabase";
import AdminLogin from "../components/AdminLogin";
import EmotionTrendsCharts from "../components/EmotionTrendsCharts";
import RealTimeEmotionDashboard from "../components/RealTimeEmotionDashboard";
import AdvancedAnalytics from "../components/AdvancedAnalytics";
import BookingManagement from "../components/BookingManagement";
import {
  AlertTriangle,
  Users,
  TrendingUp,
  Activity,
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Phone,
  ExternalLink,
} from "lucide-react";

interface DashboardSummary {
  total_sessions_today: number;
  unique_users_today: number;
  crisis_alerts_pending: number;
  crisis_alerts_today: number;
  avg_sentiment_today: number;
  most_common_emotion_today: string;
}

interface CrisisAlert {
  id: string;
  anonymous_user_id: string;
  severity: "low" | "medium" | "high" | "critical";
  emotion_detected: string;
  confidence_score: number;
  keywords_detected: string[];
  content_snippet: string;
  detected_at: string;
  status: "pending" | "acknowledged" | "resolved" | "escalated";
  notes?: string;
}

interface EmotionTrend {
  date: string;
  primary_emotion: string;
  session_count: number;
  avg_confidence: number;
  crisis_count: number;
  avg_sentiment: number;
}

interface UsageStats {
  hour: string;
  unique_users: number;
  total_sessions: number;
  avg_session_duration: number;
  crisis_sessions: number;
}

const AdminDashboard: React.FC = () => {
  const { user, loading: authLoading, initialize } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardSummary, setDashboardSummary] =
    useState<DashboardSummary | null>(null);
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([]);
  const [emotionTrends, setEmotionTrends] = useState<EmotionTrend[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStats[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [alertFilter, setAlertFilter] = useState<
    "all" | "pending" | "high-risk"
  >("all");
  const [activeTab, setActiveTab] = useState("overview");

  // Define available tabs
  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "realtime", label: "Real-time Monitor", icon: Activity },
    { id: "trends", label: "Emotion Trends", icon: TrendingUp },
    { id: "analytics", label: "Advanced Analytics", icon: AlertCircle },
    { id: "bookings", label: "Booking Management", icon: Calendar },
    { id: "crisis", label: "Crisis Management", icon: AlertTriangle },
  ];

  useEffect(() => {
    // Initialize auth store
    initialize();
  }, []);

  useEffect(() => {
    // For demo purposes, load demo data immediately
    console.log("Loading admin dashboard...");
    loadDemoData();
  }, []);

  const checkAdminAccess = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", user?.id)
        .eq("is_active", true)
        .single();

      if (error) {
        // If table doesn't exist or user not found, create a demo mode
        console.warn("Admin access check failed:", error);
        setError(
          "Admin access not configured. Running in demo mode for development."
        );
        await loadDemoData();
        return;
      }

      if (!adminUser) {
        setError("Access denied: You do not have admin privileges");
        setLoading(false);
        return;
      }

      await loadDashboardData();
    } catch (error) {
      console.error("Admin access check failed:", error);
      setError(
        "Failed to verify admin access. Running in demo mode for development."
      );
      await loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = async () => {
    console.log("Loading demo data...");
    try {
      // Load demo data for development/testing
      setDashboardSummary({
        total_sessions_today: 42,
        unique_users_today: 28,
        crisis_alerts_pending: 3,
        crisis_alerts_today: 5,
        avg_sentiment_today: -0.2,
        most_common_emotion_today: "stressed",
      });

      setCrisisAlerts([
        {
          id: "demo1",
          anonymous_user_id: "user_demo_001",
          severity: "high",
          emotion_detected: "anxiety",
          confidence_score: 0.85,
          keywords_detected: ["overwhelmed", "panic"],
          content_snippet:
            "Feeling overwhelmed with exams and having panic attacks...",
          detected_at: new Date().toISOString(),
          status: "pending",
        },
        {
          id: "demo2",
          anonymous_user_id: "user_demo_002",
          severity: "critical",
          emotion_detected: "despair",
          confidence_score: 0.92,
          keywords_detected: ["hopeless", "worthless"],
          content_snippet:
            "Everything feels hopeless and I feel completely worthless...",
          detected_at: new Date(Date.now() - 3600000).toISOString(),
          status: "pending",
        },
      ]);

      setEmotionTrends([
        {
          date: new Date().toISOString().split("T")[0],
          primary_emotion: "stressed",
          session_count: 15,
          avg_confidence: 0.78,
          crisis_count: 2,
          avg_sentiment: -0.4,
        },
        {
          date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
          primary_emotion: "anxiety",
          session_count: 12,
          avg_confidence: 0.82,
          crisis_count: 1,
          avg_sentiment: -0.3,
        },
      ]);

      setUsageStats([
        {
          hour: new Date().toISOString(),
          unique_users: 5,
          total_sessions: 8,
          avg_session_duration: 180,
          crisis_sessions: 1,
        },
      ]);

      console.log("Demo data loaded successfully");
      setLoading(false);
    } catch (error) {
      console.error("Failed to load demo data:", error);
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      await Promise.all([
        loadDashboardSummary().catch((err) =>
          console.warn("Failed to load summary:", err)
        ),
        loadCrisisAlerts().catch((err) =>
          console.warn("Failed to load alerts:", err)
        ),
        loadEmotionTrends().catch((err) =>
          console.warn("Failed to load trends:", err)
        ),
        loadUsageStats().catch((err) =>
          console.warn("Failed to load usage stats:", err)
        ),
      ]);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setError("Some dashboard data could not be loaded");
    }
  };

  const loadDashboardSummary = async () => {
    const { data, error } = await supabase.rpc("get_admin_dashboard_summary");
    if (error) throw error;
    setDashboardSummary(data);
  };

  const loadCrisisAlerts = async () => {
    let query = supabase
      .from("crisis_alerts")
      .select("*")
      .order("detected_at", { ascending: false })
      .limit(50);

    if (alertFilter === "pending") {
      query = query.eq("status", "pending");
    } else if (alertFilter === "high-risk") {
      query = query.in("severity", ["high", "critical"]);
    }

    const { data, error } = await query;
    if (error) throw error;
    setCrisisAlerts(data || []);
  };

  const loadEmotionTrends = async () => {
    const { data, error } = await supabase
      .from("admin_emotion_trends")
      .select("*")
      .limit(100);
    if (error) throw error;
    setEmotionTrends(data || []);
  };

  const loadUsageStats = async () => {
    const { data, error } = await supabase
      .from("admin_usage_stats")
      .select("*")
      .limit(168); // 7 days * 24 hours
    if (error) throw error;
    setUsageStats(data || []);
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("crisis_alerts")
        .update({
          status: "acknowledged",
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: user?.id,
        })
        .eq("id", alertId);

      if (error) throw error;
      await loadCrisisAlerts();
    } catch (error) {
      console.error("Failed to acknowledge alert:", error);
    }
  };

  const resolveAlert = async (alertId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from("crisis_alerts")
        .update({
          status: "resolved",
          notes: notes,
        })
        .eq("id", alertId);

      if (error) throw error;
      await loadCrisisAlerts();
    } catch (error) {
      console.error("Failed to resolve alert:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-100 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-100 border-orange-200";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      default:
        return "text-blue-600 bg-blue-100 border-blue-200";
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: { [key: string]: string } = {
      happy: "text-green-600 bg-green-100",
      sad: "text-blue-600 bg-blue-100",
      angry: "text-red-600 bg-red-100",
      anxious: "text-purple-600 bg-purple-100",
      stressed: "text-orange-600 bg-orange-100",
      neutral: "text-gray-600 bg-gray-100",
    };
    return colors[emotion] || "text-gray-600 bg-gray-100";
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-700">
            {authLoading ? "Authenticating..." : "Loading admin dashboard..."}
          </span>
        </div>
      </div>
    );
  }

  if (error && error.includes("Please log in")) {
    return <AdminLogin />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Dashboard Access Issue
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          {error.includes("demo mode") && (
            <div className="bg-blue-50 p-3 rounded mb-4">
              <p className="text-sm text-blue-700">
                This is a demo version of the admin dashboard for development
                purposes.
              </p>
            </div>
          )}
          <button
            onClick={() => {
              setError(null);
              if (user) {
                checkAdminAccess();
              } else {
                loadDemoData();
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                MannMitra Mental Health Monitoring
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadDemoData}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Active Users Today
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardSummary?.unique_users_today || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Sessions Today
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardSummary?.total_sessions_today || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Crisis Alerts
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardSummary?.crisis_alerts_pending || 0}
                    </p>
                    <p className="text-xs text-gray-500">
                      {dashboardSummary?.crisis_alerts_today || 0} today
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Avg Sentiment
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardSummary?.avg_sentiment_today
                        ? (dashboardSummary.avg_sentiment_today > 0
                            ? "+"
                            : "") +
                          dashboardSummary.avg_sentiment_today.toFixed(2)
                        : "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Most common:{" "}
                      {dashboardSummary?.most_common_emotion_today || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Crisis Overview */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  Recent Crisis Alerts
                </h2>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {crisisAlerts.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p>No crisis alerts found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {crisisAlerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(
                                alert.severity
                              )}`}
                            >
                              {alert.severity.toUpperCase()}
                            </span>
                            <span className="text-sm text-gray-700">
                              {alert.emotion_detected} -{" "}
                              {(alert.confidence_score * 100).toFixed(1)}%
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(alert.detected_at).toLocaleString()}
                          </span>
                        </div>
                        {alert.content_snippet && (
                          <p className="text-sm text-gray-600 mt-2 italic">
                            "{alert.content_snippet}..."
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    Crisis Alert Management
                  </h2>
                  <div className="flex items-center space-x-4">
                    <select
                      value={alertFilter}
                      onChange={(e) => setAlertFilter(e.target.value as any)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Alerts</option>
                      <option value="pending">Pending Only</option>
                      <option value="high-risk">High Risk Only</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {crisisAlerts.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p>No crisis alerts found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {crisisAlerts.map((alert) => (
                      <div key={alert.id} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(
                                  alert.severity
                                )}`}
                              >
                                {alert.severity.toUpperCase()}
                              </span>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded ${getEmotionColor(
                                  alert.emotion_detected
                                )}`}
                              >
                                {alert.emotion_detected}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(alert.detected_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>Confidence:</strong>{" "}
                              {(alert.confidence_score * 100).toFixed(1)}%
                            </p>
                            {alert.keywords_detected.length > 0 && (
                              <p className="text-sm text-gray-700 mb-2">
                                <strong>Keywords:</strong>{" "}
                                {alert.keywords_detected.join(", ")}
                              </p>
                            )}
                            {alert.content_snippet && (
                              <p className="text-sm text-gray-600 italic">
                                "{alert.content_snippet}..."
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col space-y-2 ml-4">
                            {alert.status === "pending" && (
                              <>
                                <button
                                  onClick={() => acknowledgeAlert(alert.id)}
                                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                  Acknowledge
                                </button>
                                <button
                                  onClick={() => {
                                    const notes = prompt("Resolution notes:");
                                    if (notes) resolveAlert(alert.id, notes);
                                  }}
                                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                >
                                  Resolve
                                </button>
                              </>
                            )}
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded text-center ${
                                alert.status === "resolved"
                                  ? "bg-green-100 text-green-800"
                                  : alert.status === "acknowledged"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {alert.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Crisis Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                    Emotion Trends (Last 7 Days)
                  </h2>
                </div>
                <div className="p-6">
                  {emotionTrends.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No emotion data available
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {emotionTrends.slice(0, 10).map((trend, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded ${getEmotionColor(
                                trend.primary_emotion
                              )}`}
                            >
                              {trend.primary_emotion}
                            </span>
                            <span className="text-sm text-gray-600">
                              {new Date(trend.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {trend.session_count} sessions
                            </p>
                            <p className="text-xs text-gray-500">
                              {trend.crisis_count} crisis
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Clock className="h-5 w-5 text-green-500 mr-2" />
                    Usage Statistics
                  </h2>
                </div>
                <div className="p-6">
                  {usageStats.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No usage data available
                    </p>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            {usageStats.reduce(
                              (sum, stat) => sum + stat.unique_users,
                              0
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            Total Unique Users
                          </p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {usageStats.reduce(
                              (sum, stat) => sum + stat.total_sessions,
                              0
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            Total Sessions
                          </p>
                        </div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">
                          {usageStats.reduce(
                            (sum, stat) => sum + stat.crisis_sessions,
                            0
                          )}
                        </p>
                        <p className="text-sm text-gray-600">Crisis Sessions</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
