import React, { useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  BarChart,
  Bar,
  PieChart,
  Pie,
} from "recharts";
import {
  Filter,
  Download,
  Calendar,
  Users,
  Brain,
  AlertTriangle,
} from "lucide-react";

// Mock data for advanced analytics
const emotionRadarData = [
  { emotion: "Stress", current: 85, average: 65, optimal: 30 },
  { emotion: "Anxiety", current: 78, average: 58, optimal: 25 },
  { emotion: "Depression", current: 45, average: 35, optimal: 15 },
  { emotion: "Anger", current: 32, average: 28, optimal: 10 },
  { emotion: "Fear", current: 42, average: 38, optimal: 15 },
  { emotion: "Loneliness", current: 55, average: 45, optimal: 20 },
];

const interventionFunnelData = [
  { name: "Initial Support Requests", value: 1245, fill: "#8884d8" },
  { name: "Assessment Completed", value: 1089, fill: "#83a6ed" },
  { name: "Therapy Recommended", value: 756, fill: "#8dd1e1" },
  { name: "Therapy Started", value: 523, fill: "#82ca9d" },
  { name: "Ongoing Treatment", value: 387, fill: "#a4de6c" },
  { name: "Recovery Progress", value: 245, fill: "#ffc658" },
];

const demographicTreemapData = [
  { name: "Engineering Students", size: 3200, category: "High Stress" },
  { name: "Medical Students", size: 2800, category: "High Stress" },
  { name: "Business Students", size: 2100, category: "Moderate Stress" },
  { name: "Arts Students", size: 1650, category: "Moderate Stress" },
  { name: "Science Students", size: 1420, category: "Moderate Stress" },
  { name: "Law Students", size: 980, category: "High Stress" },
];

const riskScatterData = [
  { stress: 85, anxiety: 78, risk: 90, size: 120, category: "Critical" },
  { stress: 72, anxiety: 65, risk: 75, size: 80, category: "High" },
  { stress: 58, anxiety: 52, risk: 60, size: 65, category: "Moderate" },
  { stress: 45, anxiety: 38, risk: 45, size: 50, category: "Low" },
  { stress: 32, anxiety: 28, risk: 30, size: 35, category: "Low" },
  { stress: 68, anxiety: 72, risk: 82, size: 95, category: "Critical" },
  { stress: 55, anxiety: 48, risk: 58, size: 70, category: "Moderate" },
  { stress: 78, anxiety: 82, risk: 88, size: 110, category: "Critical" },
];

interface AdvancedAnalyticsProps {
  className?: string;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  className = "",
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [selectedDemographic, setSelectedDemographic] = useState("all");

  const CustomRadarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 3 Months</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <select
                value={selectedDemographic}
                onChange={(e) => setSelectedDemographic(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">All Students</option>
                <option value="engineering">Engineering</option>
                <option value="medical">Medical</option>
                <option value="business">Business</option>
                <option value="arts">Arts & Literature</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emotion Radar & Risk Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotion Profile Radar */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-600" />
              Emotion Profile Analysis
            </h3>
            <div className="text-sm text-gray-500">Current vs Baseline</div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={emotionRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="emotion" className="text-sm" />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  className="text-xs"
                />
                <Radar
                  name="Current Level"
                  dataKey="current"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Campus Average"
                  dataKey="average"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Radar
                  name="Optimal Range"
                  dataKey="optimal"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Tooltip content={<CustomRadarTooltip />} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Assessment Scatter */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
              Risk Assessment Matrix
            </h3>
            <div className="text-sm text-gray-500">
              Stress vs Anxiety Correlation
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={riskScatterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="stress"
                  name="Stress Level"
                  unit="%"
                  domain={[0, 100]}
                />
                <YAxis
                  dataKey="anxiety"
                  name="Anxiety Level"
                  unit="%"
                  domain={[0, 100]}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [value + "%", name]}
                  labelFormatter={(label: any) => `Risk Score: ${label}%`}
                />
                <Scatter name="Students" dataKey="risk" fill="#8884d8">
                  {riskScatterData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.category === "Critical"
                          ? "#ef4444"
                          : entry.category === "High"
                          ? "#f97316"
                          : entry.category === "Moderate"
                          ? "#eab308"
                          : "#10b981"
                      }
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Intervention Funnel & Demographic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intervention Success Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Intervention Success Pipeline
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={interventionFunnelData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Conversion Rate (Request → Recovery):
              </span>
              <span className="font-medium text-green-600">19.7%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Assessment Completion Rate:</span>
              <span className="font-medium text-blue-600">87.5%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Therapy Engagement Rate:</span>
              <span className="font-medium text-purple-600">69.2%</span>
            </div>
          </div>
        </div>

        {/* Demographic Risk Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Student Demographics & Risk
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicTreemapData}
                  dataKey="size"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {demographicTreemapData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.category === "High Stress" ? "#ef4444" : "#fbbf24"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">
                High Stress Programs
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-600">
                Moderate Stress Programs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🎯 AI-Generated Insights & Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Critical Findings
            </h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>
                • Engineering students show 34% higher stress than average
              </li>
              <li>• Peak crisis hours: 2PM-6PM during exam weeks</li>
              <li>• 23% increase in anxiety indicators over past month</li>
              <li>• Early intervention reduces severe cases by 67%</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Recommended Actions
            </h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Deploy additional counselors during peak hours</li>
              <li>• Launch targeted stress management for Engineering</li>
              <li>• Implement proactive outreach for high-risk students</li>
              <li>• Enhance weekend support services availability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
