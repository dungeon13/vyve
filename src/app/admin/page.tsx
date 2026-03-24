"use client";

import { useEffect, useState } from "react";
import { BarChart3, Users, CheckCircle, Share2, TrendingUp, RefreshCw } from "lucide-react";

interface OverviewData {
  total_quizzes: number;
  total_scores: number;
  total_users: number;
  recent_scores: {
    composite_score: number;
    financial_score: number;
    career_score: number;
    health_score: number;
    created_at: string;
  }[];
}

interface MetricData {
  metric: string;
  value: number;
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [quizRate, setQuizRate] = useState<MetricData | null>(null);
  const [shareRate, setShareRate] = useState<MetricData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewRes, quizRes, shareRes] = await Promise.all([
        fetch("/api/engagement?metric=overview"),
        fetch("/api/engagement?metric=quiz_completion_rate"),
        fetch("/api/engagement?metric=share_rate"),
      ]);

      setOverview(await overviewRes.json());
      setQuizRate(await quizRes.json());
      setShareRate(await shareRes.json());
    } catch (err) {
      console.error("Failed to fetch metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Vyve Dashboard</h1>
            <p className="text-gray-500 mt-1">Engagement & metrics at a glance</p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl
              text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer
              disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            label="Total Quiz Completions"
            value={overview?.total_quizzes ?? 0}
            icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
            loading={loading}
          />
          <KPICard
            label="Registered Users"
            value={overview?.total_users ?? 0}
            icon={<Users className="w-5 h-5 text-blue-500" />}
            loading={loading}
          />
          <KPICard
            label="Quiz Completion Rate"
            value={`${quizRate?.value ?? 0}%`}
            target=">70%"
            icon={<BarChart3 className="w-5 h-5 text-purple-500" />}
            loading={loading}
          />
          <KPICard
            label="Share Rate"
            value={`${shareRate?.value ?? 0}%`}
            target=">15%"
            icon={<Share2 className="w-5 h-5 text-amber-500" />}
            loading={loading}
          />
        </div>

        {/* Recent Scores */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-vyve-indigo" />
            Recent Scores
          </h2>
          {overview?.recent_scores && overview.recent_scores.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Time</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-500">Composite</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-500">Financial</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-500">Career</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-500">Health</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.recent_scores.map((score, idx) => (
                    <tr key={idx} className="border-b border-gray-50">
                      <td className="py-2 px-2 text-gray-600">
                        {new Date(score.created_at).toLocaleString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-2 px-2 text-center font-semibold text-vyve-indigo">
                        {score.composite_score}
                      </td>
                      <td className="py-2 px-2 text-center text-emerald-600">{score.financial_score}</td>
                      <td className="py-2 px-2 text-center text-blue-600">{score.career_score}</td>
                      <td className="py-2 px-2 text-center text-rose-600">{score.health_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No scores yet. Share the quiz link to start collecting data.</p>
          )}
        </div>

        {/* The 3 Numbers That Matter */}
        <div className="mt-8 bg-vyve-indigo rounded-2xl p-6 text-white">
          <h2 className="text-lg font-semibold mb-4">The 3 Numbers That Matter (90-Day Targets)</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-vyve-amber">{quizRate?.value ?? 0}%</p>
              <p className="text-sm text-white/60 mt-1">Quiz Completion</p>
              <p className="text-xs text-white/40">Target: &gt;70%</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-vyve-amber">{shareRate?.value ?? 0}%</p>
              <p className="text-sm text-white/60 mt-1">Share Rate</p>
              <p className="text-xs text-white/40">Target: &gt;15%</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-vyve-amber">-</p>
              <p className="text-sm text-white/60 mt-1">D7 Return</p>
              <p className="text-xs text-white/40">Target: &gt;30%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({
  label,
  value,
  target,
  icon,
  loading,
}: {
  label: string;
  value: string | number;
  target?: string;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        {icon}
        {target && <span className="text-xs text-gray-400">Target: {target}</span>}
      </div>
      <p className={`text-3xl font-bold text-gray-900 ${loading ? "animate-pulse" : ""}`}>
        {loading ? "..." : value}
      </p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}
