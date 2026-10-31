import React, { useState } from 'react';
import { Outlet, useLocation, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Home, Heart } from 'lucide-react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { CommandPalette } from '../ui/CommandPalette';
import { AIAssistantModal } from '../ui/AIAssistantModal';
import { ToastContainer } from '../ui/ToastContainer';
import { useApp } from '../../context/AppContext';

export const AppLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const { state } = useApp();
  const { currentUser } = state;
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Breadcrumbs generation
  const pathParts = location.pathname.split('/').filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          />

          {/* Breadcrumbs Bar */}
          <div className="px-4 sm:px-6 py-2.5 bg-white/40 dark:bg-slate-900/40 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center text-xs text-slate-500 dark:text-slate-400">
            <Link
              to={`/${currentUser.role}/dashboard`}
              className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>SIGCE</span>
            </Link>
            {pathParts.map((part, index) => {
              const routeTo = `/${pathParts.slice(0, index + 1).join('/')}`;
              const isLast = index === pathParts.length - 1;
              const formattedName = part
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase());

              return (
                <div key={routeTo} className="flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 mx-1.5 opacity-40" />
                  {isLast ? (
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formattedName}
                    </span>
                  ) : (
                    <Link
                      to={routeTo}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {formattedName}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Page Animated Outlet */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.99 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Footer */}
          <footer className="mt-auto py-5 px-6 border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span>Smt. Indira Gandhi College of Engineering (SIGCE) · Accredited by AICTE & NAAC</span>
            </div>
            <div className="flex items-center gap-1">
              <span>SIGCE ERP v2.0 – Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            </div>
          </footer>
        </div>
      </div>

      {/* Global Interactive Overlays */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <AIAssistantModal />
      <ToastContainer />
    </div>
  );
};
