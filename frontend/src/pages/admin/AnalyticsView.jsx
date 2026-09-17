import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BarChart3, Building2, MapPin, PieChart as PieIcon } from 'lucide-react';
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

export const AnalyticsView = () => {
  const [industries, setIndustries] = useState([]);
  const [geoData, setGeoData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [indRes, geoRes] = await Promise.all([
          api.get('/admin/analytics/industries'),
          api.get('/admin/analytics/geographic')
        ]);
        setIndustries(indRes.data.industry_breakdown || []);
        setGeoData(geoRes.data.state_distribution || []);
      } catch (err) {
        console.error('Failed to load analytics', err);
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
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-900" />
          <span>National Analytics & Insights</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed metrics across industrial domains and regional distribution for policy evaluation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Industry Sector Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <span>Industry Sector Opportunities</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Distribution of internships across industrial sectors</p>
          </div>

          <div className="h-72 w-full pt-4">
            {industries.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industries} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="industry" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="internships" name="Internships" fill="#EA580C" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="companies" name="Companies" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No industry data available yet
              </div>
            )}
          </div>
        </div>

        {/* State representation */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>State & Regional Participation</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Candidate registrations by state</p>
          </div>

          <div className="h-72 w-full pt-4">
            {geoData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={geoData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="region" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="students" name="Students" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No geographic data available yet
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
