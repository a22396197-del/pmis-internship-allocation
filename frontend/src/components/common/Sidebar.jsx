import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  UserCheck, 
  Sparkles, 
  Briefcase, 
  FileText, 
  BarChart3, 
  PlusCircle, 
  Users, 
  SlidersHorizontal,
  Compass
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/student/profile', icon: UserCheck, label: 'My Profile & Resume' },
    { to: '/student/recommendations', icon: Sparkles, label: 'AI Matches' },
    { to: '/student/explore', icon: Compass, label: 'Explore Internships' },
    { to: '/student/applications', icon: FileText, label: 'Applications' },
  ];

  const companyLinks = [
    { to: '/company/dashboard', icon: LayoutDashboard, label: 'Company Overview' },
    { to: '/company/post-internship', icon: PlusCircle, label: 'Post Internship' },
    { to: '/company/internships', icon: Briefcase, label: 'Manage Postings' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'National KPIs' },
    { to: '/admin/allocation', icon: SlidersHorizontal, label: 'Fairness Allocation' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Deep Analytics' },
  ];

  const links = user.role === 'ADMIN' ? adminLinks : user.role === 'COMPANY' ? companyLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col p-4">
      <div className="space-y-1">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          {user.role} Portal
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-900 font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Scheme Quick Info Note */}
      <div className="mt-auto p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl border border-blue-100 text-xs text-blue-900">
        <p className="font-bold flex items-center gap-1 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          Matching Engine Active
        </p>
        <p className="text-slate-600 leading-relaxed text-[11px]">
          Multi-factor scoring: Skills (40%), Edu (20%), Pref (15%), Loc (10%), Exp (10%), Ind (5%).
        </p>
      </div>
    </aside>
  );
};
