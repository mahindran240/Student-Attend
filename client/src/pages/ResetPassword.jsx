import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import api from "../services/api.js";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    const { data } = await api.post(`/auth/reset-password/${token}`, { password });
    toast.success(data.message);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-mist px-4 py-10 dark:bg-slate-950">
      <form onSubmit={submit} className="panel w-full max-w-md">
        <p className="badge-soft mb-4">Secure reset</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Reset Password</h1>
        <input className="input mt-6" type="password" minLength={8} placeholder="New password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <button className="btn-primary mt-4 w-full">Update Password</button>
        <Link className="mt-4 block text-sm font-semibold text-ocean transition hover:text-teal-900 dark:hover:text-teal-200" to="/login">Return to login</Link>
      </form>
    </div>
  );
}
