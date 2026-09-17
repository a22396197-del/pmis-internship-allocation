import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ScoreBreakdownModal } from '../../components/matching/ScoreBreakdownModal';
import { 
  Sparkles, 
  Upload, 
  FileText, 
  CheckCircle, 
  MapPin, 
  Coins, 
  Award,
  ChevronRight,
  AlertCircle,
  ShieldCheck,
  Check,
  Compass
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [totalRecsCount, setTotalRecsCount] = useState(0);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total_applied: 0,
    total_got: 0,
    total_attended: 0,
    total_rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, recsRes, appsRes, statsRes] = await Promise.all([
          api.get('/students/profile'),
          api.get('/matching/recommendations'),
          api.get('/applications/my'),
          api.get('/applications/stats')
        ]);
        setProfile(profRes.data);
        setTotalRecsCount(recsRes.data?.length || 0);
        setRecommendations(recsRes.data.slice(0, 3));
        setApplications(appsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  const skillsCount = (profile?.skills?.length || 0) + (profile?.extracted_skills?.length || 0);
  const isResumeUploaded = !!profile?.resume_file_path;
  const isProfileComplete = !!(profile?.education_level && profile?.home_city && skillsCount > 0);
  const shortlistedCount = applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'ALLOCATED').length;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/80 text-xs font-semibold text-amber-300 border border-blue-700/60 mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Registered Candidate</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {profile?.full_name || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-sm text-blue-200 mt-1">
              {profile?.education_level ? (
                `${profile.education_level} ${profile.field_of_study ? `in ${profile.field_of_study}` : ''} ${profile.home_city ? `• ${profile.home_city}, ${profile.home_state}` : ''}`
              ) : (
                'Profile pending completion'
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/student/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-md transition"
            >
              <Upload className="w-4 h-4" />
              <span>{isResumeUploaded ? 'Manage Profile & Resume' : 'Upload Resume / Complete Profile'}</span>
            </Link>
          </div>
        </div>
      </div>

      {!isProfileComplete && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span><strong>Profile Incomplete:</strong> Complete your profile and add your skills to receive accurate AI match recommendations.</span>
          </div>
          <Link to="/student/profile" className="font-bold underline text-amber-950">Complete Now &rarr;</Link>
        </div>
      )}

      {/* KPI Offer Lifecycle Tracker Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Applied */}
        <Link to="/student/applications" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Applied</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.total_applied}</span>
            <FileText className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-xs text-slate-500 mt-1">Submitted applications</p>
        </Link>

        {/* Internships Got (Allocated) */}
        <Link to="/student/applications" className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm bg-gradient-to-br from-amber-50/40 to-white hover:border-amber-400 transition">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Internships You Got</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-amber-700">{stats.total_got}</span>
            <Award className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-xs text-amber-900 mt-1">Allocated by PMIS engine</p>
        </Link>

        {/* Internships Attended */}
        <Link to="/student/applications" className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm bg-gradient-to-br from-emerald-50/40 to-white hover:border-emerald-400 transition">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Internships Attended</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-emerald-700">{stats.total_attended}</span>
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-xs text-emerald-900 mt-1">Accepted & in progress</p>
        </Link>

        {/* Internships Rejected */}
        <Link to="/student/applications" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Internships Rejected</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-slate-700">{stats.total_rejected}</span>
            <AlertCircle className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500 mt-1">Declined or not selected</p>
        </Link>

      </div>

      {/* Top AI Matched Internships Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Recommended Opportunities</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Dynamically evaluated against real company postings in the database</p>
          </div>
          {totalRecsCount > 0 && (
            <Link
              to="/student/recommendations"
              className="text-xs font-bold text-blue-900 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All Opportunities ({totalRecsCount})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-sm font-semibold text-slate-700">No internships available.</p>
            <p className="text-xs text-slate-500 mt-1">
              {!isProfileComplete 
                ? 'Complete your profile to receive recommendations.' 
                : 'No open internship listings currently match your criteria.'}
            </p>
            <Link
              to="/student/profile"
              className="inline-block mt-3 px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-lg"
            >
              Update Profile & Skills
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.internship_id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{rec.title}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {rec.company_name}
                    </span>
                    {rec.is_verified_partner && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Partner
                      </span>
                    )}
                  </div>

                  {/* Location & Eligibility Tag Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rec.is_eligible 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {rec.is_eligible ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {rec.is_eligible ? 'Eligible to Apply' : 'Conditional'}
                    </span>

                    {rec.location_tag && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                        <Compass className="w-3 h-3 text-purple-600" />
                        {rec.location_tag}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Coins className="w-3.5 h-3.5 text-emerald-600" />
                      ₹{rec.stipend_amount.toLocaleString()}/mo
                    </span>
                    <span className="flex items-center gap-1">
                      {rec.duration_months} Months
                    </span>
                    <span>{rec.vacancies} Vacancies</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {rec.required_skills.slice(0, 4).map((sk, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedBreakdown(rec)}
                    className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition text-center"
                    title="View AI calculation breakdown"
                  >
                    <span className="block text-base font-black text-amber-700">{rec.match_score}%</span>
                    <span className="block text-[10px] font-bold text-amber-900 uppercase">Match Score</span>
                  </button>

                  <Link
                    to="/student/recommendations"
                    className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs transition whitespace-nowrap"
                  >
                    View & Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
