import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, loading } = useAuth();
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

  return (
    <div className="grid min-h-screen place-items-center bg-mist px-4 dark:bg-slate-950">
      <form onSubmit={submit} className="panel w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Login</h1>
        <p className="mt-2 text-sm text-slate-500">Use student@sams.edu, teacher@sams.edu, or hod@sams.edu with Password@123 after seeding.</p>
        <label className="mt-6 block text-sm font-medium">Email</label>
        <input className="input mt-2" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <label className="mt-4 block text-sm font-medium">Password</label>
        <input className="input mt-2" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <button className="btn-primary mt-6 w-full" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
        <div className="mt-4 flex justify-between text-sm">
          <Link className="text-ocean" to="/forgot-password">Forgot password?</Link>
          <Link className="text-slate-500" to="/">Back home</Link>
        </div>
      </form>
    </div>
  );
}
