import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Sparkles, 
  Plus, 
  Trash2, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Award,
  AlertCircle,
  Save
} from 'lucide-react';

export const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [nlpNotification, setNlpNotification] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  
  // Project form state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', technologies: '', github_url: '' });

  // Experience form state
  const [showExpModal, setShowExpModal] = useState(false);
  const [expForm, setExpForm] = useState({ title: '', organization: '', duration_months: 3, description: '' });

  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/students/profile');
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        full_name: profile.full_name,
        phone: profile.phone,
        education_level: profile.education_level,
        field_of_study: profile.field_of_study,
        institution_name: profile.institution_name,
        graduation_year: profile.graduation_year ? parseInt(profile.graduation_year) : null,
        cgpa_or_percentage: (profile.cgpa_or_percentage !== '' && profile.cgpa_or_percentage !== null && !isNaN(profile.cgpa_or_percentage)) 
          ? parseFloat(profile.cgpa_or_percentage) 
          : null,
        home_city: profile.home_city,
        home_state: profile.home_state,
        preferred_locations: typeof profile.preferred_locations === 'string' 
          ? profile.preferred_locations.split(',').map(s => s.trim()) 
          : profile.preferred_locations,
        career_interests: typeof profile.career_interests === 'string'
          ? profile.career_interests.split(',').map(s => s.trim())
          : profile.career_interests,
        industry_preferences: typeof profile.industry_preferences === 'string'
          ? profile.industry_preferences.split(',').map(s => s.trim())
          : profile.industry_preferences,
        bio: profile.bio
      };

      const res = await api.put('/students/profile', payload);
      setProfile(res.data);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await api.post('/students/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNlpNotification(res.data);
      await fetchProfile();
    } catch (err) {
      alert(err.response?.data?.detail || 'Resume upload and parsing failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    try {
      await api.post('/students/skills', { skill_name: newSkill.trim() });
      setNewSkill('');
      await fetchProfile();
    } catch (err) {
      alert('Failed to add skill');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await api.delete(`/students/skills/${skillId}`);
      await fetchProfile();
    } catch (err) {
      alert('Failed to delete skill');
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const techs = projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean);
      await api.post('/students/projects', {
        title: projectForm.title,
        description: projectForm.description,
        technologies: techs,
        github_url: projectForm.github_url
      });
      setShowProjectModal(false);
      setProjectForm({ title: '', description: '', technologies: '', github_url: '' });
      await fetchProfile();
    } catch (err) {
      alert('Failed to add project');
    }
  };

  const handleDeleteProject = async (projId) => {
    try {
      await api.delete(`/students/projects/${projId}`);
      await fetchProfile();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students/experience', {
        title: expForm.title,
        organization: expForm.organization,
        duration_months: parseInt(expForm.duration_months),
        description: expForm.description
      });
      setShowExpModal(false);
      setExpForm({ title: '', organization: '', duration_months: 3, description: '' });
      await fetchProfile();
    } catch (err) {
      alert('Failed to add experience');
    }
  };

  const handleDeleteExperience = async (expId) => {
    try {
      await api.delete(`/students/experience/${expId}`);
      await fetchProfile();
    } catch (err) {
      alert('Failed to delete experience');
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
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Student Profile & AI Credentials</h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete your profile and upload your resume to maximize your match score under the PM Internship Scheme.
        </p>
      </div>

      {/* NLP Resume Parsing Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Resume Parser (NLP)</span>
            </div>
            <h3 className="text-lg font-bold">Upload Resume (PDF / TXT)</h3>
            <p className="text-xs text-blue-200">
              Our NLP engine automatically extracts your skills, qualifications, and project domains to calculate transparent match scores.
            </p>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleResumeUpload}
              accept=".pdf,.txt"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Analyzing with NLP...' : 'Upload Resume File'}</span>
            </button>
          </div>
        </div>

        {/* NLP Extraction Alert */}
        {nlpNotification && (
          <div className="p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>{nlpNotification.message}! Extracted {nlpNotification.skills_count} skills.</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {nlpNotification.extracted_skills.map((sk, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white/20 text-white font-medium">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile?.resume_file_path && !nlpNotification && (
          <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium">
            <CheckCircle className="w-4 h-4" />
            <span>Active resume on file: {profile.resume_file_path.split('/').pop()}</span>
          </div>
        )}
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleProfileSave} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-900" />
            <span>Personal & Academic Information</span>
          </h2>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+91 9876543210"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Education Level</label>
            <select
              value={profile.education_level || 'B.Tech'}
              onChange={(e) => setProfile({ ...profile, education_level: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            >
              <option value="Diploma">Diploma / Polytechnic</option>
              <option value="B.Tech">B.Tech / B.E.</option>
              <option value="B.Sc">B.Sc</option>
              <option value="BCA">BCA</option>
              <option value="Bachelor's Degree">General Bachelor's Degree</option>
              <option value="M.Tech">M.Tech / Master's</option>
              <option value="MCA">MCA</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Field of Study</label>
            <input
              type="text"
              value={profile.field_of_study || ''}
              onChange={(e) => setProfile({ ...profile, field_of_study: e.target.value })}
              placeholder="e.g. Computer Science, Mechanical"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Institution / College</label>
            <input
              type="text"
              value={profile.institution_name || ''}
              onChange={(e) => setProfile({ ...profile, institution_name: e.target.value })}
              placeholder="e.g. Government Engineering College"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">CGPA / Percentage</label>
            <input
              type="number"
              step="0.1"
              value={profile.cgpa_or_percentage || 7.5}
              onChange={(e) => setProfile({ ...profile, cgpa_or_percentage: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Geographic Information */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-900" />
            <span>Geographic & Location Matching Parameters</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Home City</label>
              <input
                type="text"
                value={profile.home_city || ''}
                onChange={(e) => setProfile({ ...profile, home_city: e.target.value })}
                placeholder="e.g. Jabalpur, Pune"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Home State</label>
              <input
                type="text"
                value={profile.home_state || ''}
                onChange={(e) => setProfile({ ...profile, home_state: e.target.value })}
                placeholder="e.g. Madhya Pradesh, Gujarat"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preferred Locations (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(profile.preferred_locations) ? profile.preferred_locations.join(', ') : (profile.preferred_locations || '')}
                onChange={(e) => setProfile({ ...profile, preferred_locations: e.target.value })}
                placeholder="Bengaluru, Pune, Remote"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Career & Industry Preferences */}
        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-blue-900" />
            <span>Career Interests & Industry Alignment</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Career Interests (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(profile.career_interests) ? profile.career_interests.join(', ') : (profile.career_interests || '')}
                onChange={(e) => setProfile({ ...profile, career_interests: e.target.value })}
                placeholder="Full Stack Web Development, Cloud Systems"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preferred Industries (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(profile.industry_preferences) ? profile.industry_preferences.join(', ') : (profile.industry_preferences || '')}
                onChange={(e) => setProfile({ ...profile, industry_preferences: e.target.value })}
                placeholder="IT & Software, Automotive, FinTech"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

      </form>

      {/* Skills Management Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-900" />
              <span>Skills Portfolio (Weight: 40% in Matching)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Skills extracted from resume and added manually</p>
          </div>

          <form onSubmit={handleAddSkill} className="flex items-center gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g. React, Docker, Python"
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800 transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {profile.skills?.map((sk) => (
            <div
              key={sk.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200 hover:bg-slate-200/70 transition"
            >
              <span>{sk.skill_name}</span>
              <button
                type="button"
                onClick={() => handleDeleteSkill(sk.id)}
                className="text-slate-400 hover:text-rose-600 ml-1"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}

          {(!profile.skills || profile.skills.length === 0) && (
            <p className="text-xs text-slate-400 italic">No skills added yet. Upload your resume or type above.</p>
          )}
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-900" />
              <span>Practical Projects (Weight: 10% in Matching)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Showcase hands-on applications and code repositories</p>
          </div>
          <button
            onClick={() => setShowProjectModal(true)}
            className="px-3 py-1.5 rounded-lg bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800 transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {profile.projects?.map((proj) => (
            <div key={proj.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 relative group">
              <button
                onClick={() => handleDeleteProject(proj.id)}
                className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
              <p className="text-xs text-slate-600 mt-1">{proj.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {proj.technologies?.map((t, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {(!profile.projects || profile.projects.length === 0) && (
            <p className="text-xs text-slate-400 italic">No projects added yet.</p>
          )}
        </div>
      </div>

      {/* Add Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Academic / Practical Project</h3>
            <form onSubmit={handleAddProject} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. IoT Weather Station"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  placeholder="Python, Arduino, React"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  rows="3"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="What was the scope and outcome?"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-blue-900 text-white rounded-lg hover:bg-blue-800"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
