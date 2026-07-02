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
    <div className="min-h-screen bg-mist dark:bg-slate-950">
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-5 transition dark:border-slate-800 dark:bg-slate-900 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-ocean text-white"><GraduationCap size={22} /></span>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">SAMS</p>
              <p className="text-xs text-slate-500">Smart attendance</p>
            </div>
          </div>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close sidebar"><X size={20} /></button>
        </div>
        <nav className="mt-8 space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to + label} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-teal-50 text-ocean dark:bg-teal-950" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open sidebar"><Menu size={22} /></button>
          <div className="hidden lg:block">
            <p className="text-sm text-slate-500">Signed in as</p>
            <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary px-3" onClick={toggleTheme} aria-label="Toggle dark mode">{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button className="btn-secondary px-3" aria-label="Notifications"><Bell size={18} /></button>
            <span className="hidden items-center gap-2 rounded-md bg-slate-100 px-3 py-2 text-sm font-medium capitalize dark:bg-slate-800 sm:flex"><UserRound size={16} />{user.role}</span>
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
