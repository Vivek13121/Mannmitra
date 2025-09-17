import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

// Mock real-time emotion data for the last 24 hours
const realtimeEmotionData = [
  { time: "00:00", stress: 12, anxiety: 8, depression: 5, sessions: 15 },
  { time: "01:00", stress: 10, anxiety: 6, depression: 4, sessions: 12 },
  { time: "02:00", stress: 8, anxiety: 5, depression: 3, sessions: 8 },
  { time: "03:00", stress: 6, anxiety: 4, depression: 2, sessions: 5 },
  { time: "04:00", stress: 5, anxiety: 3, depression: 2, sessions: 3 },
  { time: "05:00", stress: 7, anxiety: 5, depression: 3, sessions: 6 },
  { time: "06:00", stress: 15, anxiety: 12, depression: 6, sessions: 18 },
  { time: "07:00", stress: 25, anxiety: 20, depression: 10, sessions: 32 },
  { time: "08:00", stress: 35, anxiety: 28, depression: 15, sessions: 45 },
  { time: "09:00", stress: 42, anxiety: 35, depression: 18, sessions: 55 },
  { time: "10:00", stress: 48, anxiety: 40, depression: 22, sessions: 62 },
  { time: "11:00", stress: 52, anxiety: 45, depression: 25, sessions: 68 },
  { time: "12:00", stress: 45, anxiety: 38, depression: 20, sessions: 58 },
  { time: "13:00", stress: 40, anxiety: 35, depression: 18, sessions: 52 },
  { time: "14:00", stress: 55, anxiety: 48, depression: 28, sessions: 72 },
  { time: "15:00", stress: 62, anxiety: 55, depression: 32, sessions: 82 },
  { time: "16:00", stress: 68, anxiety: 60, depression: 35, sessions: 88 },
  { time: "17:00", stress: 65, anxiety: 58, depression: 32, sessions: 85 },
  { time: "18:00", stress: 58, anxiety: 52, depression: 28, sessions: 78 },
  { time: "19:00", stress: 52, anxiety: 45, depression: 25, sessions: 70 },
  { time: "20:00", stress: 48, anxiety: 42, depression: 22, sessions: 65 },
  { time: "21:00", stress: 45, anxiety: 38, depression: 20, sessions: 60 },
  { time: "22:00", stress: 38, anxiety: 32, depression: 16, sessions: 52 },
  { time: "23:00", stress: 28, anxiety: 22, depression: 12, sessions: 38 },
];

// Weekly comparison data
const weeklyComparisonData = [
  {
    week: "This Week",
    stress: 85,
    anxiety: 78,
    depression: 45,
    anger: 32,
    trend: "up",
    change: "+12%",
  },
  {
    week: "Last Week",
    stress: 76,
    anxiety: 69,
    depression: 38,
    anger: 28,
    trend: "up",
    change: "+8%",
  },
  {
    week: "2 Weeks Ago",
    stress: 70,
    anxiety: 64,
    depression: 35,
    anger: 25,
    trend: "down",
    change: "-3%",
  },
  {
    week: "3 Weeks Ago",
    stress: 72,
    anxiety: 66,
    depression: 36,
    anger: 26,
    trend: "stable",
    change: "0%",
  },
];

interface RealTimeEmotionDashboardProps {
  className?: string;
}

const RealTimeEmotionDashboard: React.FC<RealTimeEmotionDashboardProps> = ({
  className = "",
}) => {
  const currentHour = new Date().getHours();
  const currentData =
    realtimeEmotionData[currentHour] || realtimeEmotionData[0];

  const getPercentageChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey}: {entry.value} sessions
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Current Stress Level
              </p>
              <p className="text-2xl font-bold text-red-600">
                {currentData.stress}
              </p>
              <p className="text-xs text-gray-500">
                Active sessions: {currentData.sessions}
              </p>
            </div>
            <div className="flex items-center text-red-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">
                +{getPercentageChange(currentData.stress, 45).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Current Anxiety Level
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {currentData.anxiety}
              </p>
              <p className="text-xs text-gray-500">Peak: 16:00 - 17:00</p>
            </div>
            <div className="flex items-center text-orange-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">
                +{getPercentageChange(currentData.anxiety, 35).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Depression Indicators
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {currentData.depression}
              </p>
              <p className="text-xs text-gray-500">Weekly average: 24</p>
            </div>
            <div className="flex items-center text-blue-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">
                +{getPercentageChange(currentData.depression, 20).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Crisis Risk Score
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(
                  (currentData.stress +
                    currentData.anxiety +
                    currentData.depression) /
                    3
                )}
              </p>
              <p className="text-xs text-gray-500">
                {Math.round(
                  (currentData.stress +
                    currentData.anxiety +
                    currentData.depression) /
                    3
                ) > 40
                  ? "High Risk"
                  : "Moderate Risk"}
              </p>
            </div>
            <div className="flex items-center text-purple-500">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Monitor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Emotion Flow Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            24-Hour Emotion Flow
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live Data</span>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={realtimeEmotionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="stress"
                stackId="1"
                stroke="#ef4444"
                fill="#fef2f2"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="anxiety"
                stackId="1"
                stroke="#f97316"
                fill="#fff7ed"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="depression"
                stackId="1"
                stroke="#3b82f6"
                fill="#eff6ff"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Comparison */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Weekly Trend Comparison
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="stress"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: "#ef4444", strokeWidth: 2, r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="anxiety"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: "#f97316", strokeWidth: 2, r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="depression"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Weekly Analysis</h4>
            {weeklyComparisonData.slice(0, 2).map((week, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{week.week}</span>
                  <div className="flex items-center space-x-1">
                    {week.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : week.trend === "down" ? (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 bg-gray-400 rounded-full"></div>
                    )}
                    <span
                      className={`text-sm font-medium ${
                        week.trend === "up"
                          ? "text-red-600"
                          : week.trend === "down"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {week.change}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Stress:</span>
                    <span className="ml-1 font-medium text-red-600">
                      {week.stress}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Anxiety:</span>
                    <span className="ml-1 font-medium text-orange-600">
                      {week.anxiety}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Depression:</span>
                    <span className="ml-1 font-medium text-blue-600">
                      {week.depression}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Key Insights */}
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <h5 className="font-medium text-yellow-800 mb-2">
                📊 Key Insights
              </h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Stress levels increased 47% over 4 weeks</li>
                <li>• Peak activity: 4PM - 6PM (exam period)</li>
                <li>• Depression indicators up 25% this week</li>
                <li>• Weekend usage drops 60% (positive sign)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeEmotionDashboard;
