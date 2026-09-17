import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Briefcase, Users, PlusCircle, Trash2, ArrowRight, MapPin, Coins } from 'lucide-react';

export const ManageInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInternships = async () => {
    try {
      const res = await api.get('/internships');
      setInternships(res.data);
    } catch (err) {
      console.error('Failed to load internships', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this internship posting?')) return;
    try {
      await api.delete(`/internships/${id}`);
      fetchInternships();
    } catch (err) {
      alert('Failed to delete internship');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-900" />
            <span>Manage Posted Internships</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review vacancies, candidate pipelines, and view AI-ranked matching pools.
          </p>
        </div>

        <Link
          to="/company/post-internship"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Internship</span>
        </Link>
      </div>

      {internships.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-sm text-slate-500">No internship roles posted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {internships.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {item.status}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{item.industry}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {item.preferred_locations?.join(', ') || 'Remote'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-emerald-600" />
                    ₹{item.stipend_amount.toLocaleString()}/mo
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    {item.allocated_count} / {item.vacancies} Allocated
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/company/internships/${item.id}/candidates`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-sm transition"
                >
                  <Users className="w-4 h-4" />
                  <span>View Ranked Candidates</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Delete Posting"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
