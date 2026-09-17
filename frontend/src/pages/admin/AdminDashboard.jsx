import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  Award, 
  SlidersHorizontal, 
  Sparkles, 
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [skillData, setSkillData] = useState([]);
  const [geoData, setGeoData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const [statsRes, skillRes, geoRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/analytics/skills'),
        api.get('/admin/analytics/geographic')
      ]);
      setStats(statsRes.data);
      setSkillData(skillRes.data.skills_comparison || []);
      setGeoData(geoRes.data.state_distribution || []);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  const hasStudents = (stats?.total_students || 0) > 0;
  const hasCompanies = (stats?.total_companies || 0) > 0;
  const hasInternships = (stats?.total_internships || 0) > 0;
  const hasApplications = (stats?.total_applications || 0) > 0;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-blue-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-xs font-semibold text-purple-300 border border-purple-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>National Oversight & Monitoring Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Prime Minister's Internship Scheme
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Real-time analytics computed directly from the PostgreSQL relational database
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/allocation"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Fairness Allocation Engine</span>
          </Link>
        </div>
      </div>

      {/* Database Empty State Warning */}
      {(!hasStudents && !hasCompanies && !hasInternships) && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-blue-700 flex-shrink-0" />
          <div>
            <p className="font-bold text-sm">Clean Production Database Active</p>
            <p className="text-slate-600 mt-0.5">
              No students registered yet. No companies registered yet. No internships available yet.
              All statistics below represent real database queries and will update automatically as users register and post opportunities.
            </p>
          </div>
        </div>
      )}

      {/* Real KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-slate-500">Students</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats?.total_students || 0}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {hasStudents ? 'Registered candidates' : 'No students registered yet.'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-slate-500">Companies</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{stats?.total_companies || 0}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {hasCompanies ? 'Partner enterprises' : 'No companies registered yet.'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-slate-500">Total Vacancies</p>
          <p className="text-2xl font-black text-blue-600 mt-1">{stats?.total_vacancies || 0}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {hasInternships ? `${stats?.total_internships} listings` : 'No internships available.'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-slate-500">Applications</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{stats?.total_applications || 0}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {hasApplications ? 'Submitted applications' : 'No applications yet.'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-slate-500">Allocated</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats?.total_allocated || 0}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {stats?.total_allocated ? `${stats?.allocation_rate}% fill rate` : '0 assigned'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase text-slate-500">Avg Match Score</p>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {stats?.average_match_score ? `${stats.average_match_score}%` : '—'}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {stats?.average_match_score ? 'Calculated by AI' : 'No applications yet.'}
          </p>
        </div>
      </div>

      {/* Analytics Recharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Skill Demand vs Supply Gap Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-900" />
              <span>Skill Demand vs. Talent Supply Gap</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Derived from database records of required vs. verified candidate skills
            </p>
          </div>

          <div className="h-72 w-full pt-4">
            {skillData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="skill" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="demand" name="Industry Demand" fill="#EA580C" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="supply" name="Candidate Supply" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6 text-center">
                <BarChart3 className="w-8 h-8 text-slate-300 mb-2" />
                <p className="font-semibold text-slate-600">No skill data available yet.</p>
                <p className="text-slate-400 mt-0.5">Charts will populate dynamically when companies post roles and students add skills.</p>
              </div>
            )}
          </div>
        </div>

        {/* Geographic State-wise Student Participation Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-900" />
              <span>Geographic Distribution (State-wise)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Representation of candidates and internship locations across Indian states
            </p>
          </div>

          <div className="h-72 w-full pt-4">
            {geoData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={geoData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="region" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="students" name="Students Registered" fill="#9333EA" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="internships" name="Internship Opportunities" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6 text-center">
                <Users className="w-8 h-8 text-slate-300 mb-2" />
                <p className="font-semibold text-slate-600">No geographic data available yet.</p>
                <p className="text-slate-400 mt-0.5">State distributions will appear when students and companies specify their locations.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
