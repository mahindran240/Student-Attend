import { ArrowRight, BarChart3, BellRing, QrCode, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { icon: QrCode, title: "QR Attendance", text: "Fast class check-ins with expiring QR sessions." },
  { icon: BarChart3, title: "Analytics", text: "Subject, monthly, and department attendance insight." },
  { icon: BellRing, title: "Alerts", text: "Automatic low-attendance and leave notifications." },
  { icon: ShieldCheck, title: "Role Security", text: "JWT authentication with student, teacher, and HOD access." }
];

export default function Home() {
  return (
    <div className="bg-mist text-slate-900 dark:bg-slate-950 dark:text-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <Link to="/" className="text-lg font-bold">Smart Attendance</Link>
        <Link to="/login" className="btn-primary">Login <ArrowRight size={16} /></Link>
      </header>
      <section className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-4 inline-flex rounded-md bg-teal-50 px-3 py-1 text-sm font-semibold text-ocean dark:bg-teal-950">Built for modern departments</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">Smart Attendance Management System</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            A complete MERN platform for daily attendance, QR sessions, leave approvals, analytics, exports, and student alerts.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/login">Open Dashboard</Link>
            <a className="btn-secondary" href="#contact">Contact</a>
          </div>
        </div>
        <div className="panel bg-white p-4 shadow-soft dark:bg-slate-900">
          <div className="grid gap-3">
            {["Student attendance 84%", "Web Engineering QR active", "3 leave requests pending", "CSE monthly report ready"].map((item) => (
              <div key={item} className="rounded-md border border-slate-100 bg-slate-50 p-4 font-medium dark:border-slate-800 dark:bg-slate-950">{item}</div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-16 dark:bg-slate-900" id="features">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold">Features</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => (
              <div className="panel" key={title}>
                <Icon className="text-ocean" />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2" id="about">
        <div>
          <h2 className="text-3xl font-bold">About</h2>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
            SAMS helps institutions manage attendance with clean workflows for students, teachers, and HODs while keeping records auditable and easy to export.
          </p>
        </div>
        <form id="contact" className="panel grid gap-3">
          <h2 className="text-2xl font-bold">Contact</h2>
          <input className="input" placeholder="Name" />
          <input className="input" placeholder="Email" />
          <textarea className="input min-h-28" placeholder="Message" />
          <button type="button" className="btn-primary">Send Message</button>
        </form>
      </section>
      <footer className="border-t border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-800">© 2026 Smart Attendance Management System</footer>
    </div>
  );
}
