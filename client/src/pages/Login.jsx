import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const demoRoles = [
  { role: "student", label: "Student Demo" },
  { role: "teacher", label: "Teacher Demo" },
  { role: "hod", label: "HOD Demo" }
];

export default function Login() {
  const { enterDemoMode, login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "student@sams.edu", password: "Password@123" });

  const submit = async (event) => {
    event.preventDefault();
    try {
      const user = await login(form.email, form.password);
      navigate(`/${user.role}`, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const openDemo = (role) => {
    const demoUser = enterDemoMode(role);
    if (demoUser) navigate(`/${demoUser.role}`, { replace: true });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-mist px-4 py-10 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-4">
        <form onSubmit={submit} className="panel w-full">
          <p className="badge-soft mb-4">Welcome back</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Login</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Use student@sams.edu, teacher@sams.edu, or hod@sams.edu with Password@123 after seeding.</p>
          <label className="mt-6 block text-sm font-medium">Email</label>
          <input className="input mt-2" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <label className="mt-4 block text-sm font-medium">Password</label>
          <input className="input mt-2" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          <button className="btn-primary mt-6 w-full" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
          <div className="mt-4 flex justify-between text-sm">
            <Link className="font-semibold text-ocean transition hover:text-teal-900 dark:hover:text-teal-200" to="/forgot-password">Forgot password?</Link>
            <Link className="font-medium text-slate-500 transition hover:text-slate-900 dark:hover:text-white" to="/">Back home</Link>
          </div>
        </form>

        <section className="demo-access panel w-full">
          <div>
            <p className="badge-soft mb-3">Demo Access</p>
            <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">Explore dashboards instantly</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Preview each role without using a real account.</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {demoRoles.map(({ role, label }) => (
              <button key={role} type="button" className="btn-demo" onClick={() => openDemo(role)}>
                {label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
