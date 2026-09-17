import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ScoreBreakdownModal } from '../../components/matching/ScoreBreakdownModal';
import { 
  SlidersHorizontal, 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  MapPin, 
  Clock, 
  Award,
  Sparkles,
  Info
} from 'lucide-react';

export const AllocationManagement = () => {
  const [running, setRunning] = useState(false);
  const [enforceRegional, setEnforceRegional] = useState(true);
  const [lastResult, setLastResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/admin/allocation/history');
      setHistory(res.data);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleRunAllocation = async () => {
    setRunning(true);
    try {
      const res = await api.post(`/admin/allocation/run?enforce_regional_diversity=${enforceRegional}`);
      setLastResult(res.data);
      await fetchHistory();
      alert(`Allocation complete! Allocated ${res.data.total_allocated} candidates.`);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to execute allocation');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full">
            Autonomous Optimization Module
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Fairness & Regional Allocation Engine</h1>
        <p className="text-xs text-slate-500">
          Executes multi-constrained Deferred Acceptance (Gale-Shapley) allocation ensuring vacancy limits, single assignment, and regional affirmative quotas.
        </p>
      </div>

      {/* Configuration & Trigger Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-purple-900" />
          <span>Allocation Parameters & Policy Constraints</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800">Affirmative Regional Diversity Quota</span>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Caps single-state dominance at 50% per company to prevent concentration in tier-1 metro hubs and reserve opportunities for aspirational districts.
                </p>
              </div>
              <input
                type="checkbox"
                checked={enforceRegional}
                onChange={(e) => setEnforceRegional(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-xs font-bold text-slate-800">Algorithm Framework</span>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                Multi-objective Deferred Acceptance (Stable Matching Variant) prioritizing applicants' transparent match score.
              </p>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <span>Execution assigns students to best-fit internships up to available vacancies without duplicates.</span>
          </div>

          <button
            onClick={handleRunAllocation}
            disabled={running}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            <span>{running ? 'Simulating & Allocating...' : 'Execute National Allocation Run'}</span>
          </button>
        </div>
      </div>

      {/* Latest Run Results */}
      {lastResult && (
        <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Run Successful
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Live Allocation Summary</h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-purple-700">{lastResult.total_allocated}</span>
              <span className="text-xs text-slate-500"> / {lastResult.total_vacancies_available} Allocated</span>
            </div>
          </div>

          {/* Metrics Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-purple-50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-purple-900">Candidates Evaluated</span>
              <p className="text-base font-extrabold text-purple-950 mt-0.5">{lastResult.total_candidates_considered}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-emerald-900">Total Allocations</span>
              <p className="text-base font-extrabold text-emerald-950 mt-0.5">{lastResult.total_allocated}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-blue-900">Fill Rate</span>
              <p className="text-base font-extrabold text-blue-950 mt-0.5">{lastResult.allocation_rate_pct}%</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-amber-900">Avg Match Score</span>
              <p className="text-base font-extrabold text-amber-950 mt-0.5">{lastResult.average_match_score}%</p>
            </div>
          </div>

          {/* Allocation Table */}
          <div className="overflow-x-auto pt-4">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Candidate</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3">Enterprise</th>
                  <th className="p-3">Match Score</th>
                  <th className="p-3 text-right">Explainability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lastResult.allocations?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-semibold text-slate-900">{item.student_name}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {item.student_state}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-blue-900">{item.internship_title}</td>
                    <td className="p-3">{item.company_name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                        {item.match_score}%
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedBreakdown({
                          score_breakdown: item.score_breakdown,
                          title: item.internship_title,
                          companyName: `${item.student_name} Allocation`
                        })}
                        className="text-purple-700 hover:text-purple-900 font-bold underline"
                      >
                        Breakdown &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Historical Runs Log */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-500" />
          <span>Past Batch Allocation Runs</span>
        </h3>

        {history.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No previous allocation runs recorded.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {history.map((run) => (
              <div key={run.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">
                    Run on {new Date(run.run_date).toLocaleString()}
                  </span>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Evaluated: {run.total_candidates_considered} • Allocated: {run.total_allocated} candidates
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">
                  {run.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transparent Breakdown Modal */}
      {selectedBreakdown && (
        <ScoreBreakdownModal
          isOpen={!!selectedBreakdown}
          onClose={() => setSelectedBreakdown(null)}
          breakdown={selectedBreakdown.score_breakdown}
          title={selectedBreakdown.title}
          companyName={selectedBreakdown.companyName}
        />
      )}

    </div>
  );
};
