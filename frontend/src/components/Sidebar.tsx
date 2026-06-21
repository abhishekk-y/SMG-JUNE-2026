import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  User,
  FileText,
  FolderOpen,
  Receipt,
  GraduationCap,
  Calendar,
  Briefcase,
  Heart,
  Lightbulb,
  BookOpen,
  Megaphone,
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Coffee,
  Home,
  Bus,
  Shirt,
  Smartphone,
  Package,
  ClipboardList,
  CalendarCheck,
  Eye,
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  icon: React.ElementType;
  path?: string;
  subItems?: {
    id: string;
    name: string;
    icon: React.ElementType;
    path: string;
  }[];
}

const navigationItems: MenuItem[] = [
    id: 'dashboard', 
    name: 'Dashboard', 
    icon: LayoutDashboard, 
  },
  {
    id: 'projects',
    name: 'Projects & Work',
    icon: Briefcase,
    subItems: [
      { id: 'service-catalog', name: 'Service Catalog', icon: ClipboardList },
      { id: 'canteen', name: 'Canteen', icon: Coffee },
      { id: 'guest-house', name: 'Guest House', icon: Home },
      { id: 'transport', name: 'Transport', icon: Bus },
      { id: 'uniform', name: 'Uniform', icon: Shirt },
      { id: 'sim-allocation', name: 'SIM Allocation', icon: Smartphone },
      { id: 'asset-requests', name: 'Asset Requests', icon: Package },
      { id: 'general-requests', name: 'General Requests', icon: FileText },
    ],
  },
  {
    id: 'attendance',
    name: 'Attendance',
    icon: Calendar,
    subItems: [
      { id: 'leaves', name: 'Leaves', icon: CalendarCheck },
      { id: 'my-attendance', name: 'My Attendance View', icon: Eye },
    ],
  },
  { 
    id: 'payroll', 
    name: 'Payroll', 
    icon: Receipt, 
  },
  { 
    id: 'training', 
    name: 'Training', 
    icon: GraduationCap, 
  },
  { 
    id: 'documents', 
    name: 'My Documents', 
    icon: FolderOpen, 
  },
  { 
    id: 'profile', 
    name: 'Profile', 
    icon: User, 
  },
  { 
    id: 'welfare', 
    name: 'Employee Welfare', 
    icon: Heart, 
  },
  { 
    id: 'imagine', 
    name: 'SMG Imagine', 
    icon: Lightbulb, 
  },
  { 
    id: 'policies', 
    name: 'Policies', 
    icon: BookOpen, 
  },
  { 
    id: 'announcements', 
    name: 'Announcements', 
    icon: Megaphone, 
  },
  { 
    id: 'notifications', 
    name: 'Notifications', 
    icon: Bell, 
  },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function Sidebar({ activePage, onNavigate, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>(['projects', 'attendance']);

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const onToggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen bg-white transition-all duration-300 shadow-lg ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
      style={{ borderRight: '1px solid var(--smg-border)' }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center px-4" style={{ borderBottom: '1px solid var(--smg-border)' }}>
        {isCollapsed ? (
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-md flex-shrink-0">
            <img src="/Company%20Logo.jpg" alt="SMG Logo" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-md flex-shrink-0">
              <img src="/Company%20Logo.jpg" alt="SMG Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--smg-dark)' }}>SMG Electric</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Employee Portal</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.id}>
              {/* Menu item with dropdown */}
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => !isCollapsed && toggleDropdown(item.id)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all group ${
                      openDropdowns.includes(item.id)
                        ? 'bg-blue-50 text-[#0B4DA2]'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    aria-expanded={openDropdowns.includes(item.id)}
                    aria-label={item.name}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon 
                        size={20} 
                        strokeWidth={2.5} 
                        className={isCollapsed ? 'mx-auto' : ''} 
                      />
                      {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <motion.div
                        animate={{ rotate: openDropdowns.includes(item.id) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    )}
                  </button>

                  {/* Dropdown menu with animation */}
                  <AnimatePresence>
                    {openDropdowns.includes(item.id) && !isCollapsed && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="mt-1 ml-4 space-y-1 overflow-hidden"
                      >
                        {item.subItems.map((subItem) => (
                          <motion.li
                            key={subItem.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <button
                              onClick={() => onNavigate(subItem.id)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
                                activePage === subItem.id
                                  ? 'bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] text-white shadow-md'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#0B4DA2]'
                              }`}
                              aria-label={subItem.name}
                            >
                              <subItem.icon size={16} strokeWidth={2.5} />
                              <span>{subItem.name}</span>
                            </button>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Direct link without dropdown */
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    activePage === item.id
                      ? 'text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#0B4DA2]'
                  }`}
                  style={{
                    background: activePage === item.id ? 'linear-gradient(135deg, var(--smg-royal) 0%, var(--smg-dark) 100%)' : 'transparent',
                  }}
                  aria-label={item.name}
                >
                  <item.icon size={20} strokeWidth={2.5} className={isCollapsed ? 'mx-auto' : ''} />
                  {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer - Company Info */}
      {!isCollapsed && (
        <div className="px-4 py-3" style={{ borderTop: '1px solid var(--smg-border)' }}>
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-3">
            <p className="text-xs text-gray-600 mb-1">Powered by</p>
            <p className="text-sm text-[#0B4DA2]">SMG Electric Scooter Ltd</p>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={onToggleCollapse}
        className="h-14 flex items-center justify-center hover:bg-gray-50 transition-colors"
        style={{ borderTop: '1px solid var(--smg-border)' }}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight size={20} style={{ color: 'var(--smg-royal)' }} />
        ) : (
          <div className="flex items-center gap-2" style={{ color: 'var(--smg-royal)' }}>
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Collapse</span>
          </div>
        )}
      </button>
    </aside>
  );
}
