import { Bell, BookOpen, GraduationCap, LayoutDashboard, LogOut, Menu, Moon, Sun, UserRound, UsersRound, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const roleLinks = {
  student: [{ to: "/student", label: "Student Dashboard", icon: GraduationCap }],
  teacher: [{ to: "/teacher", label: "Teacher Dashboard", icon: BookOpen }],
  hod: [{ to: "/hod", label: "HOD Dashboard", icon: UsersRound }]
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const links = [{ to: `/${user.role}`, label: "Overview", icon: LayoutDashboard }, ...(roleLinks[user.role] || [])];

  return (
    <div className="min-h-screen bg-mist text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/60 bg-white/80 p-5 shadow-soft backdrop-blur-2xl transition-all duration-300 dark:border-slate-800/70 dark:bg-slate-950/82 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-teal-600 to-blue-600 text-white shadow-lg shadow-teal-700/20"><GraduationCap size={22} /></span>
            <div>
              <p className="font-bold tracking-tight text-slate-950 dark:text-white">SAMS</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Smart attendance</p>
            </div>
          </div>
          <button className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden" onClick={() => setOpen(false)} aria-label="Close sidebar"><X size={20} /></button>
        </div>
        <nav className="mt-8 space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to + label} to={to} className={({ isActive }) => `group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all duration-300 ${isActive ? "bg-gradient-to-r from-teal-50 to-blue-50 text-ocean shadow-sm ring-1 ring-teal-100 dark:from-teal-950/70 dark:to-blue-950/50 dark:text-teal-200 dark:ring-teal-900/60" : "text-slate-600 hover:translate-x-1 hover:bg-white/70 hover:text-slate-950 hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white"}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/60 bg-white/72 px-4 shadow-sm backdrop-blur-2xl dark:border-slate-800/70 dark:bg-slate-950/72 lg:px-8">
          <button className="rounded-xl p-2 text-slate-600 transition hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden" onClick={() => setOpen(true)} aria-label="Open sidebar"><Menu size={22} /></button>
          <div className="hidden lg:block">
            <p className="text-sm text-slate-500">Signed in as</p>
            <p className="font-semibold tracking-tight text-slate-950 dark:text-white">{user.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary px-3" onClick={toggleTheme} aria-label="Toggle dark mode">{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button className="btn-secondary px-3" aria-label="Notifications"><Bell size={18} /></button>
            <span className="hidden items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 text-sm font-semibold capitalize text-slate-700 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100 sm:flex"><UserRound size={16} />{user.role}</span>
            <button className="btn-primary px-3" onClick={logout}><LogOut size={18} /><span className="hidden sm:inline">Logout</span></button>
          </div>
        </header>
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
