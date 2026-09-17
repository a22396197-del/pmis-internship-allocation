import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Target, Users, MapPin, CheckCircle, Award } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-blue-950 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-800/80 border border-blue-700/60 text-xs font-semibold text-amber-300 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prime Minister's Internship Scheme • Hackathon Prototype</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            AI-Powered <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 bg-clip-text text-transparent">Internship Allocation</span> Engine
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Bridging youth potential and industry opportunities with transparent, multi-constraint AI matching, resume NLP intelligence, and affirmative geographic fairness.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-base shadow-lg shadow-orange-900/30 transition transform hover:-translate-y-0.5"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-base backdrop-blur-sm transition"
            >
              <span>Sign In to Portal</span>
            </Link>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto border-t border-slate-800/80">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-300">40%</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Skills Alignment</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">20%</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Education & CGPA</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">100%</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Transparent Score</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-400">Fairness</p>
              <p className="text-xs text-slate-400 font-medium mt-1">Regional Balancing</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 User Roles Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Designed for Seamless Collaboration</h2>
          <p className="text-sm text-slate-500 mt-2">Connecting candidates, top enterprises, and national administrators in one ecosystem.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Student Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">For Students</h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Upload your resume for instant NLP skill extraction, receive explainable match scores, and apply to top industry opportunities across India.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 mb-6">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Resume PDF analysis</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Transparent 0–100 match breakdown</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Real-time application tracker</li>
            </ul>
            <Link to="/login" className="text-sm font-semibold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1">
              Explore as Student &rarr;
            </Link>
          </div>

          {/* Company Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">For Companies</h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Define internship requirements, tap into a verified talent pool, and view AI-ranked candidates with transparent multi-factor compatibility.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 mb-6">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Post internship vacancies</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> AI candidate ranking feed</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> One-click shortlisting & review</li>
            </ul>
            <Link to="/login" className="text-sm font-semibold text-amber-800 hover:text-amber-900 inline-flex items-center gap-1">
              Explore as Company &rarr;
            </Link>
          </div>

          {/* Admin Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">For Administrators</h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Oversee nationwide statistics, monitor skill demand vs. supply gaps, and execute batch Gale-Shapley allocations with geographic affirmative quotas.
            </p>
            <ul className="text-xs text-slate-600 space-y-2 mb-6">
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> State-wise student analytics</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Skill demand vs. supply gaps</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Automated fairness allocation runner</li>
            </ul>
            <Link to="/login" className="text-sm font-semibold text-purple-800 hover:text-purple-900 inline-flex items-center gap-1">
              Explore as Admin &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Matching Model Architecture Callout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              The Intelligence Layer
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-3">The 6-Pillar Transparent Scoring Model</h2>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Unlike opaque black-box AI systems, our engine provides a deterministic, explainable 0–100 score calculated on six verified dimensions:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-amber-300">40%</p>
              <p className="text-xs font-bold text-white mt-1">Skills</p>
              <p className="text-[11px] text-slate-400 mt-1">Jaccard & Semantic</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-emerald-400">20%</p>
              <p className="text-xs font-bold text-white mt-1">Education</p>
              <p className="text-[11px] text-slate-400 mt-1">Degree & CGPA</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-blue-400">15%</p>
              <p className="text-xs font-bold text-white mt-1">Preference</p>
              <p className="text-[11px] text-slate-400 mt-1">Career Interests</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-purple-400">10%</p>
              <p className="text-xs font-bold text-white mt-1">Location</p>
              <p className="text-[11px] text-slate-400 mt-1">City/State/Remote</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-rose-400">10%</p>
              <p className="text-xs font-bold text-white mt-1">Experience</p>
              <p className="text-[11px] text-slate-400 mt-1">Projects & Tenure</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-teal-300">5%</p>
              <p className="text-xs font-bold text-white mt-1">Industry</p>
              <p className="text-[11px] text-slate-400 mt-1">Domain Synergy</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
