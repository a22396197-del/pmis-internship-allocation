import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ScoreBreakdownModal } from '../../components/matching/ScoreBreakdownModal';
import { 
  Users, 
  ArrowLeft, 
  Sparkles, 
  MapPin, 
  GraduationCap, 
  CheckCircle2, 
  Award,
  Filter
} from 'lucide-react';

export const CandidatePool = () => {
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);
  const [minScoreFilter, setMinScoreFilter] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [intRes, candRes] = await Promise.all([
          api.get(`/internships/${id}`),
          api.get(`/internships/${id}/candidates`)
        ]);
        setInternship(intRes.data);
        setCandidates(candRes.data);
      } catch (err) {
        console.error('Failed to load candidate pool', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const filteredCandidates = candidates.filter(c => c.match_score >= minScoreFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      <Link
        to="/company/internships"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Internships</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
              AI Candidate Ranking Pool
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{internship?.title}</h1>
          <p className="text-xs text-slate-500">
            Vacancies: {internship?.vacancies} • Required Skills: {internship?.required_skills?.join(', ')}
          </p>
        </div>

        {/* Filter by score */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 font-medium">Min Match Score:</span>
          <select
            value={minScoreFilter}
            onChange={(e) => setMinScoreFilter(Number(e.target.value))}
            className="bg-transparent font-bold text-blue-900 focus:outline-none"
          >
            <option value={0}>All Candidates</option>
            <option value={50}>50% & above</option>
            <option value={70}>70% & above</option>
            <option value={85}>85% & above (Top Matches)</option>
          </select>
        </div>
      </div>

      {/* Candidate List */}
      <div className="space-y-3">
        {filteredCandidates.map((cand, idx) => (
          <div
            key={cand.student_id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                  #{idx + 1}
                </span>
                <h3 className="text-base font-bold text-slate-900">{cand.full_name}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-medium">
                  {cand.education_level}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  {cand.field_of_study || 'Technology'} (CGPA: {cand.cgpa_or_percentage})
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {cand.home_city}, {cand.home_state}
                </span>
              </div>

              {/* Skills badges */}
              <div className="flex flex-wrap gap-1 pt-1">
                {cand.skills?.slice(0, 6).map((sk, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Match Score & Action */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedBreakdown({
                  score_breakdown: cand.score_breakdown,
                  title: cand.full_name,
                  companyName: `${internship.title} Matching`
                })}
                className="text-center p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 transition"
                title="Click to view transparent explainability breakdown"
              >
                <span className="block text-xl font-extrabold text-amber-800 leading-none">
                  {cand.match_score}%
                </span>
                <span className="block text-[9px] font-bold uppercase text-amber-900 tracking-tight mt-0.5">
                  Match Score
                </span>
              </button>

              <button
                onClick={() => alert(`Candidate ${cand.full_name} shortlisted for review!`)}
                className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition"
              >
                Shortlist
              </button>
            </div>
          </div>
        ))}

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">No candidates found matching threshold {minScoreFilter}%.</p>
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
