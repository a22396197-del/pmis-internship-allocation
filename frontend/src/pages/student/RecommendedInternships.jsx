import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ScoreBreakdownModal } from '../../components/matching/ScoreBreakdownModal';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  Coins, 
  Clock, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Send,
  ShieldCheck,
  Compass,
  Check,
  Filter,
  Briefcase,
  Gift
} from 'lucide-react';

export const RecommendedInternships = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, NEAR_ME, ELIGIBLE
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);
  const [appliedMap, setAppliedMap] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  const fetchRecommendations = async () => {
    try {
      const [recsRes, appsRes] = await Promise.all([
        api.get('/matching/recommendations'),
        api.get('/applications/my')
      ]);
      setRecommendations(recsRes.data);

      const map = {};
      appsRes.data.forEach(app => {
        map[app.internship_id] = app.status;
      });
      setAppliedMap(map);
    } catch (err) {
      console.error('Failed to load recommendations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleApply = async (internshipId) => {
    setSubmittingId(internshipId);
    try {
      await api.post('/applications', { internship_id: internshipId });
      setAppliedMap(prev => ({ ...prev, [internshipId]: 'APPLIED' }));
      alert('Application submitted successfully! It has been recorded in the database.');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to submit application');
    } finally {
      setSubmittingId(null);
    }
  };

  const filtered = recommendations.filter(rec => {
    const matchesSearch = !search || 
      rec.title.toLowerCase().includes(search.toLowerCase()) ||
      rec.company_name.toLowerCase().includes(search.toLowerCase()) ||
      rec.required_skills.some(s => s.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'NEAR_ME') {
      return rec.is_near_me;
    }
    if (activeTab === 'ELIGIBLE') {
      return rec.is_eligible;
    }
    return true;
  });

  const nearMeCount = recommendations.filter(r => r.is_near_me).length;
  const eligibleCount = recommendations.filter(r => r.is_eligible).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Verified PMIS Corporate Drives
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Current Ongoing Internships & Eligibility
          </h1>
          <p className="text-xs text-slate-500">
            Real enterprise opportunities accredited under the Prime Minister's Internship Scheme.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by role, skills or company..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Filter Tabs: All vs Near Me vs Eligible */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/60 rounded-xl max-w-xl">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === 'ALL'
              ? 'bg-white text-blue-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Active Opportunities ({recommendations.length})
        </button>

        <button
          onClick={() => setActiveTab('NEAR_ME')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
            activeTab === 'NEAR_ME'
              ? 'bg-white text-purple-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-purple-600" />
          <span>Near Me / Remote ({nearMeCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('ELIGIBLE')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
            activeTab === 'ELIGIBLE'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Eligible to Apply ({eligibleCount})</span>
        </button>
      </div>

      {/* Authenticity Guarantee Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <div>
            <span className="font-bold text-emerald-900">100% Real & Verified Industry Postings:</span>
            <span className="text-emerald-800 ml-1">
              All listings are official corporate partner programs with guaranteed stipends, verified vacancies, and real application tracking.
            </span>
          </div>
        </div>
      </div>

      {/* Internship Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rec) => {
          const isApplied = !!appliedMap[rec.internship_id];
          const isSubmitting = submittingId === rec.internship_id;

          return (
            <div
              key={rec.internship_id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                
                {/* Header with Title and Verification Pill */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 text-[11px] font-bold border border-blue-100">
                        {rec.company_name}
                      </span>
                      {rec.is_verified_partner && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{rec.title}</h3>
                  </div>

                  {/* Transparent Match Score */}
                  <button
                    onClick={() => setSelectedBreakdown(rec)}
                    className="flex-shrink-0 text-center p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 transition group"
                    title="Inspect 6-factor score breakdown"
                  >
                    <span className="block text-xl font-extrabold text-amber-800 leading-none group-hover:scale-105 transition">
                      {rec.match_score}%
                    </span>
                    <span className="block text-[9px] font-bold uppercase text-amber-900 tracking-tight mt-0.5">
                      Match Score
                    </span>
                  </button>
                </div>

                {/* Location & Eligibility Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    rec.is_eligible 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {rec.is_eligible ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {rec.is_eligible ? 'Eligible to Apply' : 'Conditional Match'}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                    <MapPin className="w-3 h-3" />
                    {rec.location_tag}
                  </span>
                </div>

                {/* Details Pills */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Coins className="w-3.5 h-3.5 text-emerald-600" />
                    ₹{rec.stipend_amount.toLocaleString()}/mo
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {rec.duration_months} Months
                  </span>
                  <span>{rec.vacancies} Vacancies</span>
                </div>

                {/* Skills Analysis: Matched vs Missing */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Competencies Analysis</p>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {rec.matched_skills?.length || 0}/{rec.required_skills?.length || 0} matched
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {/* Matched Skills */}
                    {rec.matched_skills?.map((sk, i) => (
                      <span
                        key={`matched-${i}`}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold"
                        title="You have this required skill"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>{sk}</span>
                      </span>
                    ))}

                    {/* Missing Skills */}
                    {rec.missing_skills?.map((sk, i) => (
                      <span
                        key={`missing-${i}`}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-semibold"
                        title="Skill required to qualify for this role"
                      >
                        <AlertCircle className="w-3 h-3 text-rose-500" />
                        <span>{sk} (Required)</span>
                      </span>
                    ))}
                  </div>

                  {/* Missing Skills Guidance Notice */}
                  {rec.missing_skills?.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Skills Required to Qualify:</span>
                        <span className="ml-1">
                          You currently do not have <strong>{rec.missing_skills.join(', ')}</strong> listed in your profile. Learn these skills or upload an updated resume to qualify.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Work Responsibilities (What work I should do) */}
                {rec.responsibilities?.length > 0 && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-blue-700" />
                      <span>Work to be Done During Internship</span>
                    </p>
                    <ul className="space-y-1 text-slate-600">
                      {rec.responsibilities.map((duty, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{duty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Student Benefits (What is the benefit for me) */}
                {rec.benefits?.length > 0 && (
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80 text-xs space-y-1.5">
                    <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Benefits & Credentials for You</span>
                    </p>
                    <ul className="space-y-1 text-emerald-900">
                      {rec.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                          <Check className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Eligibility Criteria Breakdown */}
                {rec.eligibility_reasons?.length > 0 && (
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 space-y-0.5">
                    <span className="font-bold text-slate-700 block mb-0.5">Eligibility Benchmarks:</span>
                    {rec.eligibility_reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Bottom Card Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedBreakdown(rec)}
                  className="text-xs font-semibold text-blue-900 hover:text-blue-700 underline"
                >
                  Why you matched &rarr;
                </button>

                {isApplied ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Applied ({appliedMap[rec.internship_id]})</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleApply(rec.internship_id)}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting Application...' : 'Apply Now'}</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-500">No internships found matching your current filter.</p>
        </div>
      )}

      {/* Transparent Breakdown Modal */}
      {selectedBreakdown && (
        <ScoreBreakdownModal
          isOpen={!!selectedBreakdown}
          onClose={() => setSelectedBreakdown(null)}
          breakdown={selectedBreakdown.score_breakdown}
          title={selectedBreakdown.title}
          companyName={selectedBreakdown.company_name}
        />
      )}

    </div>
  );
};
