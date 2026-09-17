import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ScoreBreakdownModal } from '../../components/matching/ScoreBreakdownModal';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Award, 
  Building2,
  Calendar,
  Sparkles,
  Check,
  X,
  Coins,
  MapPin,
  Briefcase,
  Gift
} from 'lucide-react';

export const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total_applied: 0,
    total_got: 0,
    total_attended: 0,
    total_rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchData = async () => {
    try {
      const [appsRes, statsRes] = await Promise.all([
        api.get('/applications/my'),
        api.get('/applications/stats')
      ]);
      setApplications(appsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load applications data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDecision = async (applicationId, decision) => {
    const confirmMsg = decision === 'ACCEPT' 
      ? 'Do you want to ACCEPT and ATTEND this internship? This will confirm your seat.' 
      : 'Are you sure you want to DECLINE / REJECT this internship offer?';
    
    if (!window.confirm(confirmMsg)) return;

    setActionLoadingId(applicationId);
    try {
      await api.put(`/applications/${applicationId}/decision`, { decision });
      alert(decision === 'ACCEPT' 
        ? 'Congratulations! You have accepted this internship offer. Your attendance is recorded.' 
        : 'You have declined this internship offer.');
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to record your decision');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ATTENDED':
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-sm">
            <Check className="w-3.5 h-3.5" /> Attended / Offer Accepted
          </span>
        );
      case 'ALLOCATED':
      case 'OFFERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> Offer Received (Action Needed)
          </span>
        );
      case 'REJECTED_BY_STUDENT':
      case 'DECLINED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 border border-slate-300">
            <X className="w-3.5 h-3.5 text-slate-500" /> Rejected by Candidate
          </span>
        );
      case 'SHORTLISTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Award className="w-3.5 h-3.5 text-blue-600" /> Shortlisted for Review
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Not Selected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-500" /> Under Evaluation
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-900" />
          <span>My Internship Applications & Offer Tracker</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete lifecycle tracker of the internships you applied for, received offers for, attended, and declined.
        </p>
      </div>

      {/* 4 KPI Counters: Applied, Got, Attended, Rejected */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Applied */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Applied</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats.total_applied}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Submitted drives</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Internships Got (Offered / Allocated) */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm bg-gradient-to-br from-amber-50/50 to-white flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Internships You Got</p>
            <p className="text-3xl font-extrabold text-amber-700 mt-1">{stats.total_got}</p>
            <p className="text-[11px] text-amber-900 mt-0.5">Allocated via PMIS</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Internships Attended */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Internships Attended</p>
            <p className="text-3xl font-extrabold text-emerald-700 mt-1">{stats.total_attended}</p>
            <p className="text-[11px] text-emerald-900 mt-0.5">Accepted & in progress</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Internships Rejected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Internships Rejected</p>
            <p className="text-3xl font-extrabold text-slate-700 mt-1">{stats.total_rejected}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Declined / not taken</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
            <X className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-sm text-slate-500">You have not submitted any applications yet.</p>
          <a
            href="/student/recommendations"
            className="inline-block mt-3 px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-lg"
          >
            Explore Active Internships &rarr;
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const isAllocated = app.status === 'ALLOCATED' || app.status === 'OFFERED';
            const isActionBusy = actionLoadingId === app.id;

            return (
              <div
                key={app.id}
                className={`bg-white rounded-2xl border shadow-sm transition overflow-hidden ${
                  isAllocated 
                    ? 'border-amber-400 ring-2 ring-amber-200 shadow-md' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Celebratory Banner for Allocated Internships */}
                {isAllocated && (
                  <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-3 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-200 flex-shrink-0 animate-bounce" />
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider">
                          Official Internship Seat Allocated!
                        </p>
                        <p className="text-[11px] text-amber-100">
                          The PMIS Gale-Shapley engine has allocated you to this enterprise opportunity. Please confirm your decision.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleDecision(app.id, 'ACCEPT')}
                        disabled={isActionBusy}
                        className="px-4 py-1.5 rounded-xl bg-white text-emerald-900 font-extrabold text-xs shadow hover:bg-emerald-50 transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>{isActionBusy ? 'Processing...' : 'Accept & Attend'}</span>
                      </button>

                      <button
                        onClick={() => handleDecision(app.id, 'REJECT')}
                        disabled={isActionBusy}
                        className="px-3 py-1.5 rounded-xl bg-amber-800/60 hover:bg-amber-800 text-white font-semibold text-xs transition flex items-center gap-1 disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline / Reject</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-4">
                  
                  {/* Top Details */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                          {app.company_name || 'Corporate Partner'}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Applied: {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{app.internship_title}</h3>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(app.status)}
                    </div>
                  </div>

                  {/* Stipend, Duration, Location Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1 border-t border-slate-100">
                    {app.stipend_amount && (
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Coins className="w-3.5 h-3.5 text-emerald-600" />
                        ₹{app.stipend_amount.toLocaleString()} / month
                      </span>
                    )}
                    {app.duration_months && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {app.duration_months} Months Duration
                      </span>
                    )}
                    {app.company_city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-purple-600" />
                        {app.company_city}
                      </span>
                    )}
                    <button
                      onClick={() => setSelectedBreakdown({
                        score_breakdown: app.score_breakdown,
                        title: app.internship_title,
                        company_name: app.company_name
                      })}
                      className="text-blue-900 hover:text-blue-700 underline font-semibold ml-auto"
                    >
                      AI Match Score: {app.match_score}% (Inspect Calculation)
                    </button>
                  </div>

                  {/* Work Responsibilities & Benefits Accordion/Sections */}
                  <div className="grid md:grid-cols-2 gap-3 pt-2">
                    
                    {/* Work to be done */}
                    {app.responsibilities?.length > 0 && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                        <p className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-blue-700" />
                          <span>Work to be Done During Internship</span>
                        </p>
                        <ul className="space-y-1 text-slate-600">
                          {app.responsibilities.slice(0, 3).map((r, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px]">
                              <span className="text-blue-600 font-bold">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Benefits for student */}
                    {app.benefits?.length > 0 && (
                      <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80 text-xs">
                        <p className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1.5">
                          <Gift className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Student Benefits & Certification</span>
                        </p>
                        <ul className="space-y-1 text-emerald-900">
                          {app.benefits.slice(0, 3).map((b, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px]">
                              <Check className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

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
