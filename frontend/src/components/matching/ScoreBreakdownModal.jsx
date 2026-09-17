import React from 'react';
import { X, CheckCircle2, AlertCircle, MapPin, Briefcase, GraduationCap, Sparkles, Building } from 'lucide-react';

export const ScoreBreakdownModal = ({ isOpen, onClose, breakdown, title, companyName }) => {
  if (!isOpen || !breakdown) return null;

  const total = breakdown.total_score || 0;
  const details = breakdown.details || {};

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getProgressBarColor = (pct) => {
    if (pct >= 75) return 'bg-emerald-500';
    if (pct >= 50) return 'bg-blue-500';
    if (pct >= 25) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const criteria = [
    {
      label: "Skills Alignment",
      weight: "40%",
      score: breakdown.skills_score,
      max: 40,
      icon: Sparkles,
      desc: details.matched_skills?.length > 0 
        ? `Matched: ${details.matched_skills.join(', ')}` 
        : 'Skills require alignment'
    },
    {
      label: "Education & Qualifications",
      weight: "20%",
      score: breakdown.education_score,
      max: 20,
      icon: GraduationCap,
      desc: details.candidate_cgpa 
        ? `Candidate CGPA: ${details.candidate_cgpa} (Min Required: ${details.min_required_cgpa || 6.0})`
        : 'Degree criteria evaluated'
    },
    {
      label: "Candidate Career Preference",
      weight: "15%",
      score: breakdown.preference_score,
      max: 15,
      icon: Briefcase,
      desc: 'Semantic compatibility with candidate aspirational interests'
    },
    {
      label: "Location Compatibility",
      weight: "10%",
      score: breakdown.location_score,
      max: 10,
      icon: MapPin,
      desc: details.location_reason || 'Geographic compatibility'
    },
    {
      label: "Projects & Practical Experience",
      weight: "10%",
      score: breakdown.experience_score,
      max: 10,
      icon: CheckCircle2,
      desc: 'Hands-on projects and relevant domain tenure'
    },
    {
      label: "Industry Interest",
      weight: "5%",
      score: breakdown.industry_score,
      max: 5,
      icon: Building,
      desc: details.industry_reason || 'Domain category interest'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
                AI Transparent Explainability
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{title || "Internship Match Breakdown"}</h3>
            <p className="text-xs text-slate-500">{companyName || "Prime Minister's Internship Scheme"}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Score Banner */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">Overall Match Compatibility</p>
            <p className="text-sm text-slate-200 mt-0.5">Calculated using transparent AI multi-constraint scoring</p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-amber-300">{total}</span>
            <span className="text-sm font-semibold text-blue-200">/ 100</span>
          </div>
        </div>

        {/* Weighted Parameter List */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {criteria.map((item, idx) => {
            const pct = Math.round((item.score / item.max) * 100);
            const Icon = item.icon;
            return (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-800">{item.label}</span>
                      <span className="ml-2 text-xs font-medium text-slate-500">Weight: {item.weight}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900">{item.score}</span>
                    <span className="text-xs text-slate-500"> / {item.max} pts</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(pct)}`}
                    style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                  ></div>
                </div>

                <p className="text-xs text-slate-500 mt-1.5">{item.desc}</p>
              </div>
            );
          })}

          {/* Missing Skills Warning if any */}
          {details.missing_skills && details.missing_skills.length > 0 && (
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-xs">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Opportunity for Upskilling:</span>
              </div>
              <p>
                Candidate does not currently show: <span className="font-semibold">{details.missing_skills.join(', ')}</span>.
                Adding these can elevate the candidate's match score.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
          >
            Close Breakdown
          </button>
        </div>

      </div>
    </div>
  );
};
