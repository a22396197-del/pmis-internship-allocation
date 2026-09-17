import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { PlusCircle, Building2, Briefcase, Coins, MapPin, Sparkles, ArrowLeft } from 'lucide-react';

export const PostInternship = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    required_skills: '',
    min_education_level: 'B.Tech',
    preferred_locations: '',
    industry: 'IT & Software',
    min_cgpa: 6.0,
    vacancies: 2,
    stipend_amount: 12000,
    duration_months: 6
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skills = form.required_skills.split(',').map(s => s.trim()).filter(Boolean);
      const locations = form.preferred_locations.split(',').map(l => l.trim()).filter(Boolean);

      const payload = {
        title: form.title,
        description: form.description,
        required_skills: skills,
        min_education_level: form.min_education_level,
        preferred_locations: locations,
        industry: form.industry,
        min_cgpa: parseFloat(form.min_cgpa),
        vacancies: parseInt(form.vacancies),
        stipend_amount: parseFloat(form.stipend_amount),
        duration_months: parseInt(form.duration_months)
      };

      await api.post('/internships', payload);
      alert('Internship created successfully!');
      navigate('/company/internships');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to post internship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      <button
        onClick={() => navigate('/company/dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Dashboard</span>
      </button>

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Post New Internship Opportunity</h1>
        <p className="text-xs text-slate-500 mt-1">
          Define role specifications, required skills, and location preferences to match with candidates nationwide.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Internship Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Embedded Firmware Engineer Intern"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role Description & Objectives</label>
            <textarea
              required
              rows="4"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe tasks, mentorship, and practical learning opportunities..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Required Skills (comma separated) - Weight: 40%
            </label>
            <input
              type="text"
              required
              value={form.required_skills}
              onChange={(e) => setForm({ ...form, required_skills: e.target.value })}
              placeholder="e.g. Python, React, PostgreSQL, Docker"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Minimum Qualification Level</label>
            <select
              value={form.min_education_level}
              onChange={(e) => setForm({ ...form, min_education_level: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            >
              <option value="Any">Any Qualification</option>
              <option value="Diploma">Diploma / Polytechnic</option>
              <option value="B.Tech">B.Tech / B.E.</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's / M.Tech / MCA</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Minimum Benchmark CGPA</label>
            <input
              type="number"
              step="0.1"
              value={form.min_cgpa}
              onChange={(e) => setForm({ ...form, min_cgpa: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Locations / Remote (comma separated)</label>
            <input
              type="text"
              value={form.preferred_locations}
              onChange={(e) => setForm({ ...form, preferred_locations: e.target.value })}
              placeholder="e.g. Pune, Bengaluru, Remote"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Industry Sector</label>
            <select
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            >
              <option value="IT & Software">IT & Software</option>
              <option value="Automotive & Manufacturing">Automotive & Manufacturing</option>
              <option value="Infrastructure & Heavy Engineering">Infrastructure & Heavy Engineering</option>
              <option value="Electronics & Semiconductors">Electronics & Semiconductors</option>
              <option value="FinTech & Banking">FinTech & Banking</option>
              <option value="Healthcare & Pharma">Healthcare & Pharma</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vacancies</label>
            <input
              type="number"
              min="1"
              value={form.vacancies}
              onChange={(e) => setForm({ ...form, vacancies: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Monthly Stipend (₹)</label>
            <input
              type="number"
              min="0"
              value={form.stipend_amount}
              onChange={(e) => setForm({ ...form, stipend_amount: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration (Months)</label>
            <input
              type="number"
              min="1"
              max="12"
              value={form.duration_months}
              onChange={(e) => setForm({ ...form, duration_months: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? 'Publishing...' : 'Publish Internship'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
