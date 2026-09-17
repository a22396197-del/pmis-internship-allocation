import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  PlusCircle, 
  Briefcase, 
  Users, 
  Award, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export const CompanyDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, statsRes] = await Promise.all([
          api.get('/companies/profile'),
          api.get('/companies/dashboard-stats')
        ]);
        setProfile(profRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Failed to load company dashboard', err);
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

  return (
    <div className="space-y-6 pb-12">
      
      {/* Company Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-xs font-semibold text-amber-300 border border-amber-500/30 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>PMIS Corporate Partner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {profile?.company_name || 'Enterprise Recruiter'}
          </h1>
          <p className="text-sm text-blue-200 mt-1">
            Industry: {profile?.industry} • {profile?.location_city}, {profile?.location_state}
          </p>
        </div>

        <div>
          <Link
            to="/company/post-internship"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Internship</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Postings</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats?.active_internships || 0}</span>
            <Briefcase className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-xs text-slate-500 mt-1">Open for applicant matching</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Vacancies</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-amber-600">{stats?.total_vacancies || 0}</span>
            <Users className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-xs text-slate-500 mt-1">Pledged to the PM Scheme</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Applicants</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-purple-600">{stats?.total_applications || 0}</span>
            <Award className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-xs text-slate-500 mt-1">AI scored and ranked</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Allocated Candidates</p>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold text-emerald-600">{stats?.total_allocated || 0}</span>
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <p className="text-xs text-slate-500 mt-1">Matches accepted</p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900">Manage Internship Postings</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Review vacancies, update required skill sets, and inspect ranked candidates matched by the AI engine.
          </p>
          <Link
            to="/company/internships"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700 pt-2"
          >
            <span>Go to Internship Postings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900">Post New PMIS Vacancy</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Specify technical skills, education thresholds, stipend, and locations to immediately attract matched students.
          </p>
          <Link
            to="/company/post-internship"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 pt-2"
          >
            <span>Create New Role</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};
