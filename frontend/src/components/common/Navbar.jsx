import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Award, User, LogOut, Building2, ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Tricolor top indicator */}
      <div className="h-1 w-full flex">
        <div className="w-1/3 bg-orange-500"></div>
        <div className="w-1/3 bg-slate-100"></div>
        <div className="w-1/3 bg-emerald-600"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-white shadow-md group-hover:bg-blue-800 transition">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">AI Internship Engine</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">PMIS Prototype</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Prime Minister's Internship Scheme</p>
            </div>
          </Link>

          {/* User Nav */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Role Badge */}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : user.role === 'COMPANY'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {user.role === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5" />}
                  {user.role === 'COMPANY' && <Building2 className="w-3.5 h-3.5" />}
                  {user.role === 'STUDENT' && <Award className="w-3.5 h-3.5" />}
                  {user.role}
                </span>

                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-slate-800 leading-none">
                    {user.profile?.full_name || user.profile?.company_name || user.email.split('@')[0]}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{user.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-blue-900 px-3 py-2 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-sm transition"
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
