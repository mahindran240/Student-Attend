import { BellRing, CalendarCheck, Download, FileText, Settings, UserRound } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import AttendanceChart from "../../components/AttendanceChart.jsx";
import CircularProgress from "../../components/CircularProgress.jsx";
import DataTable from "../../components/DataTable.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import StatCard from "../../components/StatCard.jsx";
import api from "../../services/api.js";
import { exportAttendancePdf } from "../../services/exportService.js";
import useApi from "../../hooks/useApi.js";

export default function StudentDashboard() {
  const { data, loading, error } = useApi(() => api.get("/dashboard/overview"), []);
  const notifications = useApi(() => api.get("/notifications"), []);
  const [leave, setLeave] = useState({ fromDate: "", toDate: "", reason: "" });

  if (loading) return <LoadingSpinner label="Loading student dashboard" />;
  if (error) return <div className="panel text-red-600">{error}</div>;

  const stats = data?.stats || { total: 0, present: 0, absent: 0, percentage: 0 };
  const recentAttendance = data?.recentAttendance || [];

  const submitLeave = async (event) => {
    event.preventDefault();
    await api.post("/leaves", leave);
    toast.success("Leave application submitted");
    setLeave({ fromDate: "", toDate: "", reason: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Student Dashboard</h1>
          <p className="text-sm text-slate-500">Daily, monthly, and subject-wise attendance overview.</p>
        </div>
        <button className="btn-primary" onClick={() => exportAttendancePdf("Student Attendance Report", recentAttendance)}><Download size={18} /> Download PDF</button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={CalendarCheck} label="Total Classes" value={stats.total} />
        <StatCard icon={CalendarCheck} label="Present" value={stats.present} />
        <StatCard icon={BellRing} label="Absent" value={stats.absent} accent="bg-orange-50 text-coral dark:bg-orange-950" />
        <StatCard icon={FileText} label="Pending Leaves" value={data?.pendingLeaves || 0} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <section className="panel">
          <h2 className="font-semibold">Attendance Percentage</h2>
          <CircularProgress value={stats.percentage} />
          {stats.percentage < 75 && <p className="rounded-md bg-orange-50 p-3 text-sm text-orange-700 dark:bg-orange-950 dark:text-orange-200">Attendance is below 75%. Please attend upcoming classes regularly.</p>}
        </section>
        <section className="panel">
          <h2 className="font-semibold">Subject-wise Attendance</h2>
          <div className="mt-4">
            <AttendanceChart items={data?.subjectWise || []} />
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="panel">
          <div className="mb-4 flex items-center gap-2"><UserRound size={18} /><h2 className="font-semibold">Profile</h2></div>
          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Roll Number</dt><dd>{data?.profile?.rollNumber}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Department</dt><dd>{data?.profile?.department}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Semester</dt><dd>{data?.profile?.semester}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Section</dt><dd>{data?.profile?.section}</dd></div>
          </dl>
        </section>
        <section className="panel">
          <div className="mb-4 flex items-center gap-2"><BellRing size={18} /><h2 className="font-semibold">Notifications</h2></div>
          <div className="space-y-3">
            {(notifications.data || []).slice(0, 5).map((item) => (
              <div className="rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-950" key={item._id}>
                <p className="font-medium">{item.title}</p>
                <p className="text-slate-500">{item.message}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel">
        <h2 className="mb-4 font-semibold">Daily and Monthly Attendance</h2>
        <DataTable
          rows={recentAttendance}
          columns={[
            { key: "date", label: "Date", render: (row) => new Date(row.date).toLocaleDateString() },
            { key: "subject", label: "Subject", render: (row) => row.subjectId?.name },
            { key: "status", label: "Status", render: (row) => <span className="capitalize">{row.status}</span> },
            { key: "remarks", label: "Remarks" }
          ]}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <form className="panel" onSubmit={submitLeave}>
          <h2 className="font-semibold">Leave Application</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input className="input" type="date" value={leave.fromDate} onChange={(event) => setLeave({ ...leave, fromDate: event.target.value })} required />
            <input className="input" type="date" value={leave.toDate} onChange={(event) => setLeave({ ...leave, toDate: event.target.value })} required />
          </div>
          <textarea className="input mt-3 min-h-24" placeholder="Reason" value={leave.reason} onChange={(event) => setLeave({ ...leave, reason: event.target.value })} required />
          <button className="btn-primary mt-3">Submit Leave</button>
        </form>
        <section className="panel">
          <div className="flex items-center gap-2"><Settings size={18} /><h2 className="font-semibold">Settings</h2></div>
          <p className="mt-4 text-sm leading-6 text-slate-500">Use the top-right theme control to switch dark mode. Email alerts are sent when attendance needs attention.</p>
        </section>
      </div>
    </div>
  );
}
