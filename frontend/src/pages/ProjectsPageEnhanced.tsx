import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Calendar,
  Filter,
  Search,
  Plus,
  MoreVertical,
  X,
  Mail,
  Phone,
  Award,
  TrendingUp,
  IndianRupee,
  Edit,
  Download,
  Target,
  FileText,
  Activity
} from 'lucide-react';
import { getProjects, createProject, downloadPDF } from '../services/api';

export const ProjectsPage = ({ initialSelectedId, onNavigate }: { initialSelectedId?: string, onNavigate?: any }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', department: '', status: 'Planning', priority: 'Medium', budget: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    getProjects()
      .then(data => setDbProjects(data))
      .catch(console.error);
  }, []);



  const handleAddProject = async () => {
    if (!newProject.name) return alert('Project name is required');
    setIsSubmitting(true);
    try {
      const added = await createProject({ ...newProject, startDate: new Date().toISOString() });
      setDbProjects([added, ...dbProjects]);
      setShowAddModal(false);
      setNewProject({ name: '', department: '', status: 'Planning', priority: 'Medium', budget: '' });
      alert('Project added successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to add project');
    } finally {
      setIsSubmitting(false);
    }
  };

  

  useEffect(() => {
    if (initialSelectedId) {
      // Find project in fetched list
      const target = dbProjects.find(p => p._id === initialSelectedId || p.id === initialSelectedId);
      if (target) {
        setSelectedProject(target);
      }
    }
  }, [initialSelectedId, dbProjects]);

  // Merge DB projects, mapping DB fields to UI fields
  const allProjects = dbProjects.map(p => ({
      id: p._id,
      name: p.name,
      status: p.status || 'Planning',
      progress: p.progress || 0,
      team: p.teamMembers?.length || 1,
      deadline: p.endDate || '2025-12-31',
      priority: p.priority || 'Medium',
      tasksSummary: { total: 10, completed: 0 },
      description: p.description || 'No description provided',
      startDate: p.startDate || new Date().toISOString(),
      manager: p.manager?.name || 'Unassigned',
      department: p.department || 'General',
      budget: `₹${p.budget || 0}`,
      spent: '₹0',
      myRole: 'Team Member',
      teamMembers: p.teamMembers || [],
      milestones: [],
      assets: [],
      recentUpdates: [],
      tasks: []
    }));

  const filteredProjects = filterStatus === 'all'
    ? allProjects
    : allProjects.filter(p => p.status.toLowerCase() === filterStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-[#05CD99] text-white';
      case 'In Progress': return 'bg-[#0B4DA2] text-white';
      case 'Planning': return 'bg-[#FFB547] text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-[#EE5D50] bg-red-50';
      case 'Medium': return 'text-[#FFB547] bg-orange-50';
      case 'Low': return 'text-[#05CD99] bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white mb-2">Projects & Work</h1>
            <p className="text-[#87CEEB] opacity-90">Manage and track your project assignments</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-white text-[#0B4DA2] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2">
            <Plus size={20} /> New Project
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in slide-in-from-bottom-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#1B254B]">New Project</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Project Name *</label>
                <input type="text" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none text-sm" placeholder="e.g., Q3 Expansion" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Department</label>
                <input type="text" value={newProject.department} onChange={e => setNewProject({...newProject, department: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none text-sm" placeholder="e.g., Engineering" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
                  <select value={newProject.status} onChange={e => setNewProject({...newProject, status: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none text-sm">
                    <option>Planning</option><option>In Progress</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Priority</label>
                  <select value={newProject.priority} onChange={e => setNewProject({...newProject, priority: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none text-sm">
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Budget (₹)</label>
                <input type="number" value={newProject.budget} onChange={e => setNewProject({...newProject, budget: e.target.value})} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none text-sm" placeholder="e.g., 500000" />
              </div>
              <button onClick={handleAddProject} disabled={isSubmitting || !newProject.name} className="w-full bg-[#0B4DA2] text-white py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors mt-4 disabled:opacity-50">
                {isSubmitting ? 'Adding...' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Briefcase className="text-[#0B4DA2]" size={24} />
            <span className="text-2xl font-bold text-[#1B254B]">{allProjects.length}</span>
          </div>
          <p className="text-sm text-[#A3AED0]">Total Projects</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-[#FFB547]" size={24} />
            <span className="text-2xl font-bold text-[#1B254B]">
              {allProjects.filter(p => p.status === 'In Progress').length}
            </span>
          </div>
          <p className="text-sm text-[#A3AED0]">In Progress</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="text-[#05CD99]" size={24} />
            <span className="text-2xl font-bold text-[#1B254B]">
              {allProjects.filter(p => p.status === 'Completed').length}
            </span>
          </div>
          <p className="text-sm text-[#A3AED0]">Completed</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="text-[#EE5D50]" size={24} />
            <span className="text-2xl font-bold text-[#1B254B]">
              {allProjects.filter(p => p.priority === 'High').length}
            </span>
          </div>
          <p className="text-sm text-[#A3AED0]">High Priority</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3AED0]" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'completed', 'in progress', 'planning'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${filterStatus === status
                    ? 'bg-[#0B4DA2] text-white'
                    : 'bg-gray-100 text-[#A3AED0] hover:bg-gray-200'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer hover:border-[#0B4DA2] hover:-translate-y-1"
            onClick={() => setSelectedProject(project)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-[#1B254B] mb-2">{project.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getPriorityColor(project.priority)}`}>
                    {project.priority} Priority
                  </span>
                </div>
              </div>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  alert('Project Options');
                }}
              >
                <MoreVertical size={20} className="text-[#A3AED0]" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#A3AED0]">Progress</span>
                <span className="text-sm font-bold text-[#1B254B]">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-[#A3AED0] mb-1">
                  <Users size={16} />
                  <span className="text-xs">Team</span>
                </div>
                <p className="font-bold text-[#1B254B]">{project.team}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-[#A3AED0] mb-1">
                  <CheckCircle size={16} />
                  <span className="text-xs">Tasks</span>
                </div>
                <p className="font-bold text-[#1B254B]">{project.tasksSummary.completed}/{project.tasksSummary.total}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-[#A3AED0] mb-1">
                  <Calendar size={16} />
                  <span className="text-xs">Deadline</span>
                </div>
                <p className="font-bold text-[#1B254B] text-xs">{new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setSelectedProject(null)}>
          <div className="bg-white rounded-[24px] max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] p-6 rounded-t-[24px] text-white z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${selectedProject.status === 'Completed' ? 'bg-green-500 text-white' :
                        selectedProject.status === 'In Progress' ? 'bg-blue-500 text-white' :
                          'bg-yellow-500 text-white'
                      }`}>
                      {selectedProject.status}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${selectedProject.priority === 'High' ? 'bg-red-500 text-white' :
                        selectedProject.priority === 'Medium' ? 'bg-orange-500 text-white' :
                          'bg-green-500 text-white'
                      }`}>
                      {selectedProject.priority} Priority
                    </span>
                  </div>
                  <p className="text-blue-100 text-sm mb-3">{selectedProject.description}</p>
                  <div className="flex gap-6 text-sm flex-wrap">
                    <div>
                      <span className="text-blue-200">Manager:</span>
                      <span className="ml-2 font-bold">{selectedProject.manager}</span>
                    </div>
                    <div>
                      <span className="text-blue-200">Department:</span>
                      <span className="ml-2 font-bold">{selectedProject.department}</span>
                    </div>
                    <div>
                      <span className="text-blue-200">My Role:</span>
                      <span className="ml-2 font-bold">{selectedProject.myRole}</span>
                    </div>
                    <div>
                      <span className="text-blue-200">Timeline:</span>
                      <span className="ml-2 font-bold">{selectedProject.startDate} to {selectedProject.deadline}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold">Overall Progress</span>
                  <span className="text-xl font-bold">{selectedProject.progress}%</span>
                </div>
                <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden">
                  <div className="bg-white h-full rounded-full transition-all" style={{ width: `${selectedProject.progress}%` }}></div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Budget Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <p className="text-xs text-blue-600 font-bold mb-1">Total Budget</p>
                  <p className="text-2xl font-bold text-[#1B254B]">{selectedProject.budget}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                  <p className="text-xs text-orange-600 font-bold mb-1">Amount Spent</p>
                  <p className="text-2xl font-bold text-[#1B254B]">{selectedProject.spent}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <p className="text-xs text-green-600 font-bold mb-1">Remaining</p>
                  <p className="text-2xl font-bold text-[#1B254B]">
                    ₹{(parseInt(selectedProject.budget.replace(/[₹,]/g, '')) - parseInt(selectedProject.spent.replace(/[₹,]/g, ''))).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                  <Users size={20} className="text-[#0B4DA2]" />
                  Team Members ({selectedProject.teamMembers.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProject.teamMembers.map((member, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl flex items-center gap-3 border border-gray-200">
                      <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full border-2 border-blue-200" />
                      <div className="flex-1">
                        <p className="font-bold text-[#1B254B] text-sm">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                        <p className="text-xs text-blue-600">{member.email}</p>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 bg-blue-50 text-[#0B4DA2] rounded-lg hover:bg-blue-100 transition-colors" title="Email">
                          <Mail size={14} />
                        </button>
                        <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Call">
                          <Phone size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                  <Target size={20} className="text-[#0B4DA2]" />
                  Project Milestones
                </h3>
                <div className="space-y-3">
                  {selectedProject.milestones.map((milestone, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${milestone.status === 'Completed' ? 'bg-green-500' :
                              milestone.status === 'In Progress' ? 'bg-blue-500' :
                                'bg-gray-300'
                            }`}></div>
                          <div className="flex-1">
                            <p className="font-bold text-[#1B254B] text-sm">{milestone.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{milestone.description}</p>
                            <p className="text-xs text-gray-400 mt-1">Target: {milestone.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${milestone.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              milestone.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {milestone.status}
                          </span>
                          <span className="text-sm font-bold text-[#1B254B]">{milestone.completion}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${milestone.status === 'Completed' ? 'bg-green-500' :
                            milestone.status === 'In Progress' ? 'bg-blue-500' :
                              'bg-gray-300'
                          }`} style={{ width: `${milestone.completion}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assets Assigned */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                  <Award size={20} className="text-[#0B4DA2]" />
                  Assets Assigned ({selectedProject.assets.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProject.assets.map((asset, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl flex items-center justify-between border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Briefcase size={18} className="text-[#0B4DA2]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#1B254B] text-sm">{asset.name}</p>
                          <p className="text-xs text-gray-500">{asset.type} • Qty: {asset.quantity}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${asset.status === 'Active' ? 'bg-green-100 text-green-700' :
                          asset.status === 'In Transit' ? 'bg-yellow-100 text-yellow-700' :
                            asset.status === 'Ordered' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                        }`}>
                        {asset.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Updates */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-[#0B4DA2]" />
                  Recent Updates
                </h3>
                <div className="space-y-3">
                  {selectedProject.recentUpdates.map((update, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border-l-4 border-[#0B4DA2]">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-[#1B254B] mb-1">{update.update}</p>
                          <p className="text-xs text-gray-500">By {update.author}</p>
                        </div>
                        <p className="text-xs text-gray-400 ml-4">{update.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Task Breakdown (if available) */}
              {selectedProject.tasks && selectedProject.tasks.length > 0 && (
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-[#0B4DA2]" />
                    Task Breakdown ({selectedProject.tasks.filter(t => t.status === 'Completed').length}/{selectedProject.tasks.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedProject.tasks.map((task) => (
                      <div key={task.id} className="bg-white p-3 rounded-xl flex items-center justify-between border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${task.status === 'Completed' ? 'bg-green-500' :
                              task.status === 'In Progress' ? 'bg-blue-500' :
                                'bg-gray-300'
                            }`}></div>
                          <div>
                            <p className="font-bold text-[#1B254B] text-sm">{task.name}</p>
                            <p className="text-xs text-gray-500">Assigned to: {task.assignee}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">{task.dueDate}</span>
                          <span className={`text-xs font-bold px-2 py-1 rounded ${task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 rounded-b-[24px] flex gap-3">
              <button onClick={() => window.location.hash = '#/employee/documents'} className="flex-1 bg-[#0B4DA2] text-white py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors flex items-center justify-center gap-2">
                <FileText size={18} />
                View Documents
              </button>
              <button onClick={() => downloadPDF('project', selectedProject.id || selectedProject._id)} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <Download size={18} />
                Download Report
              </button>
              <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors" onClick={() => setSelectedProject(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
