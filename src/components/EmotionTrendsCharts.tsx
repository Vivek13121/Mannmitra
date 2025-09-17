import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { Calendar, TrendingUp, Clock, BarChart3 } from "lucide-react";

// Mock data for emotion trends over the past 4 weeks
const weeklyEmotionData = [
  {
    week: "Week 1",
    date: "2025-08-10",
    anxiety: 65,
    stress: 78,
    depression: 35,
    anger: 25,
    happiness: 45,
    neutral: 55,
    totalSessions: 234,
  },
  {
    week: "Week 2",
    date: "2025-08-17",
    anxiety: 72,
    stress: 85,
    depression: 42,
    anger: 30,
    happiness: 38,
    neutral: 48,
    totalSessions: 267,
  },
  {
    week: "Week 3",
    date: "2025-08-24",
    anxiety: 89,
    stress: 95,
    depression: 58,
    anger: 45,
    happiness: 28,
    neutral: 42,
    totalSessions: 312,
  },
  {
    week: "Week 4",
    date: "2025-08-31",
    anxiety: 95,
    stress: 102,
    depression: 67,
    anger: 52,
    happiness: 22,
    neutral: 35,
    totalSessions: 345,
  },
];

// Mock data for daily emotion patterns (24-hour heatmap)
const dailyPatternData = [
  { hour: "00:00", anxiety: 15, stress: 12, depression: 8, sessions: 23 },
  { hour: "01:00", anxiety: 12, stress: 10, depression: 6, sessions: 18 },
  { hour: "02:00", anxiety: 10, stress: 8, depression: 5, sessions: 12 },
  { hour: "03:00", anxiety: 8, stress: 6, depression: 4, sessions: 8 },
  { hour: "04:00", anxiety: 6, stress: 5, depression: 3, sessions: 5 },
  { hour: "05:00", anxiety: 8, stress: 7, depression: 4, sessions: 8 },
  { hour: "06:00", anxiety: 15, stress: 18, depression: 8, sessions: 25 },
  { hour: "07:00", anxiety: 25, stress: 28, depression: 12, sessions: 42 },
  { hour: "08:00", anxiety: 35, stress: 42, depression: 18, sessions: 65 },
  { hour: "09:00", anxiety: 45, stress: 52, depression: 22, sessions: 78 },
  { hour: "10:00", anxiety: 52, stress: 58, depression: 25, sessions: 85 },
  { hour: "11:00", anxiety: 58, stress: 65, depression: 28, sessions: 92 },
  { hour: "12:00", anxiety: 48, stress: 55, depression: 25, sessions: 75 },
  { hour: "13:00", anxiety: 42, stress: 48, depression: 22, sessions: 68 },
  { hour: "14:00", anxiety: 55, stress: 62, depression: 28, sessions: 82 },
  { hour: "15:00", anxiety: 62, stress: 72, depression: 32, sessions: 95 },
  { hour: "16:00", anxiety: 68, stress: 78, depression: 35, sessions: 102 },
  { hour: "17:00", anxiety: 65, stress: 75, depression: 32, sessions: 98 },
  { hour: "18:00", anxiety: 58, stress: 68, depression: 28, sessions: 88 },
  { hour: "19:00", anxiety: 52, stress: 62, depression: 25, sessions: 82 },
  { hour: "20:00", anxiety: 48, stress: 55, depression: 22, sessions: 75 },
  { hour: "21:00", anxiety: 45, stress: 52, depression: 20, sessions: 72 },
  { hour: "22:00", anxiety: 38, stress: 45, depression: 18, sessions: 65 },
  { hour: "23:00", anxiety: 25, stress: 32, depression: 12, sessions: 45 },
];

// Mock data for emotion distribution
const emotionDistribution = [
  { name: "Stress", value: 28, color: "#ef4444" },
  { name: "Anxiety", value: 24, color: "#f97316" },
  { name: "Depression", value: 15, color: "#3b82f6" },
  { name: "Anger", value: 12, color: "#dc2626" },
  { name: "Neutral", value: 13, color: "#6b7280" },
  { name: "Happiness", value: 8, color: "#10b981" },
];

// Mock data for peak usage times (exam periods, etc.)
const peakUsageData = [
  {
    period: "Regular Days",
    avgSessions: 45,
    stressLevel: 35,
    anxietyLevel: 28,
    color: "#10b981",
  },
  {
    period: "Assignment Due",
    avgSessions: 78,
    stressLevel: 65,
    anxietyLevel: 58,
    color: "#f59e0b",
  },
  {
    period: "Exam Week",
    avgSessions: 125,
    stressLevel: 95,
    anxietyLevel: 89,
    color: "#ef4444",
  },
  {
    period: "Holidays",
    avgSessions: 25,
    stressLevel: 18,
    anxietyLevel: 15,
    color: "#8b5cf6",
  },
];

interface EmotionTrendsChartsProps {
  className?: string;
}

const EmotionTrendsCharts: React.FC<EmotionTrendsChartsProps> = ({
  className = "",
}) => {
  const [selectedChart, setSelectedChart] = useState<
    "trends" | "heatmap" | "distribution" | "peaks"
  >("trends");

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

  const HeatmapCell = ({
    hour,
    intensity,
    sessions,
  }: {
    hour: string;
    intensity: number;
    sessions: number;
  }) => {
    const getIntensityColor = (intensity: number) => {
      if (intensity < 20) return "bg-green-100 text-green-800";
      if (intensity < 40) return "bg-yellow-100 text-yellow-800";
      if (intensity < 60) return "bg-orange-100 text-orange-800";
      if (intensity < 80) return "bg-red-100 text-red-800";
      return "bg-red-200 text-red-900";
    };

    return (
      <div
        className={`p-2 rounded text-center text-xs font-medium ${getIntensityColor(
          intensity
        )} hover:scale-105 transition-transform cursor-pointer`}
        title={`${hour}: ${sessions} sessions, ${intensity} stress level`}
      >
        <div>{hour}</div>
        <div className="font-bold">{sessions}</div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Chart Navigation */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
            Anonymous Emotion Trends
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedChart("trends")}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedChart === "trends"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <BarChart3 className="h-4 w-4 inline mr-1" />
              Trends
            </button>
            <button
              onClick={() => setSelectedChart("heatmap")}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedChart === "heatmap"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Clock className="h-4 w-4 inline mr-1" />
              Heatmap
            </button>
            <button
              onClick={() => setSelectedChart("distribution")}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedChart === "distribution"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Distribution
            </button>
            <button
              onClick={() => setSelectedChart("peaks")}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedChart === "peaks"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Peak Times
            </button>
          </div>
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-6">
        {selectedChart === "trends" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Weekly Emotion Trends
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyEmotionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="stress"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="anxiety"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="depression"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="anger"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="happiness"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-red-600 font-bold text-lg">+47%</div>
                <div className="text-red-700">Stress increase</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="text-orange-600 font-bold text-lg">+46%</div>
                <div className="text-orange-700">Anxiety increase</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-blue-600 font-bold text-lg">+91%</div>
                <div className="text-blue-700">Depression increase</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-green-600 font-bold text-lg">-51%</div>
                <div className="text-green-700">Happiness decrease</div>
              </div>
            </div>
          </div>
        )}

        {selectedChart === "heatmap" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              24-Hour Usage Heatmap
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Peak usage times throughout the day (darker = more activity)
            </p>
            <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
              {dailyPatternData.map((data, index) => (
                <HeatmapCell
                  key={index}
                  hour={data.hour}
                  intensity={data.stress}
                  sessions={data.sessions}
                />
              ))}
            </div>
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">
                Hourly Stress Patterns
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyPatternData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="stress"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#fef2f2"
                    />
                    <Area
                      type="monotone"
                      dataKey="anxiety"
                      stackId="1"
                      stroke="#f97316"
                      fill="#fff7ed"
                    />
                    <Area
                      type="monotone"
                      dataKey="depression"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#eff6ff"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {selectedChart === "distribution" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Emotion Distribution
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Overall Distribution
                </h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={emotionDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {emotionDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Top Concerns</h4>
                <div className="space-y-3">
                  {emotionDistribution.map((emotion, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: emotion.color }}
                        ></div>
                        <span className="font-medium text-gray-900">
                          {emotion.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {emotion.value}%
                        </div>
                        <div className="text-xs text-gray-500">of sessions</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedChart === "peaks" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Peak Usage Analysis
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Activity patterns during different academic periods
            </p>
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="avgSessions"
                    fill="#3b82f6"
                    name="Avg Sessions"
                  />
                  <Bar
                    dataKey="stressLevel"
                    fill="#ef4444"
                    name="Stress Level"
                  />
                  <Bar
                    dataKey="anxietyLevel"
                    fill="#f97316"
                    name="Anxiety Level"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {peakUsageData.map((period, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: period.color }}
                    ></div>
                    <h4 className="font-medium text-gray-900">
                      {period.period}
                    </h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sessions:</span>
                      <span className="font-medium">{period.avgSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stress:</span>
                      <span className="font-medium text-red-600">
                        {period.stressLevel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Anxiety:</span>
                      <span className="font-medium text-orange-600">
                        {period.anxietyLevel}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionTrendsCharts;
