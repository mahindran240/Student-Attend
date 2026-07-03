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
import { useAuth } from "../../context/AuthContext.jsx";

export default function StudentDashboard() {
  const { isDemoMode } = useAuth();
  const demoOverview = {
    profile: {
      rollNumber: "CSE-2026-001",
      department: "Computer Science",
      semester: 6,
      section: "A"
    },
    stats: {
      total: 28,
      present: 24,
      absent: 4,
      percentage: 86
    },
    subjectWise: [
      { subject: "Web Engineering", present: 10, absent: 1, percentage: 91 },
      { subject: "Database Systems", present: 8, absent: 2, percentage: 80 },
      { subject: "Operating Systems", present: 6, absent: 1, percentage: 86 }
    ],
    recentAttendance: [
      { _id: "demo-1", date: "2026-06-30T00:00:00.000Z", subjectId: { name: "Web Engineering" }, status: "present", remarks: "On time" },
      { _id: "demo-2", date: "2026-06-29T00:00:00.000Z", subjectId: { name: "Database Systems" }, status: "absent", remarks: "Medical leave" },
      { _id: "demo-3", date: "2026-06-28T00:00:00.000Z", subjectId: { name: "Operating Systems" }, status: "present", remarks: "On time" },
      { _id: "demo-4", date: "2026-06-27T00:00:00.000Z", subjectId: { name: "Web Engineering" }, status: "present", remarks: "On time" }
    ],
    pendingLeaves: 1
  };
  const demoNotifications = [
    { _id: "demo-notice-1", title: "Welcome", message: "Your attendance dashboard is ready.", type: "success" },
    { _id: "demo-notice-2", title: "Reminder", message: "Submit your leave request before Friday.", type: "info" }
  ];

  const { data, loading, error } = useApi(() => api.get("/dashboard/overview"), [], isDemoMode);
  const notifications = useApi(() => api.get("/notifications"), [], isDemoMode);
  const [leave, setLeave] = useState({ fromDate: "", toDate: "", reason: "" });

  if (loading) return <LoadingSpinner label="Loading student dashboard" />;
  if (error) return <div className="panel border-red-200 bg-red-50/80 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">{error}</div>;

  const displayData = isDemoMode ? demoOverview : data;
  const notificationItems = isDemoMode ? demoNotifications : notifications.data || [];
  const stats = displayData?.stats || { total: 0, present: 0, absent: 0, percentage: 0 };
  const recentAttendance = displayData?.recentAttendance || [];

  const submitLeave = async (event) => {
    event.preventDefault();
    if (isDemoMode) {
      toast.success("Leave application submitted (demo mode)");
      setLeave({ fromDate: "", toDate: "", reason: "" });
      return;
    }

    await api.post("/leaves", leave);
    toast.success("Leave application submitted");
    setLeave({ fromDate: "", toDate: "", reason: "" });
  };

  return (
    <div className="page-shell">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Student Dashboard</h1>
          <p className="page-subtitle">Daily, monthly, and subject-wise attendance overview.</p>
        </div>
        <button className="btn-primary" onClick={() => exportAttendancePdf("Student Attendance Report", recentAttendance)}><Download size={18} /> Download PDF</button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={CalendarCheck} label="Total Classes" value={stats.total} />
        <StatCard icon={CalendarCheck} label="Present" value={stats.present} />
        <StatCard icon={BellRing} label="Absent" value={stats.absent} accent="bg-orange-50 text-coral dark:bg-orange-950" />
        <StatCard icon={FileText} label="Pending Leaves" value={displayData?.pendingLeaves || 0} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <section className="panel">
          <h2 className="section-title">Attendance Percentage</h2>
          <CircularProgress value={stats.percentage} />
          {stats.percentage < 75 && <p className="rounded-2xl border border-orange-200 bg-orange-50/85 p-3 text-sm font-medium text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/45 dark:text-orange-200">Attendance is below 75%. Please attend upcoming classes regularly.</p>}
        </section>
        <section className="panel">
          <h2 className="section-title">Subject-wise Attendance</h2>
          <div className="mt-4">
            <AttendanceChart items={displayData?.subjectWise || []} />
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="panel">
          <div className="mb-4 flex items-center gap-2"><UserRound size={18} className="text-ocean" /><h2 className="section-title">Profile</h2></div>
          <dl className="grid gap-3 text-sm">
            <div className="surface-muted flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Roll Number</dt><dd className="font-semibold">{displayData?.profile?.rollNumber}</dd></div>
            <div className="surface-muted flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Department</dt><dd className="font-semibold">{displayData?.profile?.department}</dd></div>
            <div className="surface-muted flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Semester</dt><dd className="font-semibold">{displayData?.profile?.semester}</dd></div>
            <div className="surface-muted flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Section</dt><dd className="font-semibold">{displayData?.profile?.section}</dd></div>
          </dl>
        </section>
        <section className="panel">
          <div className="mb-4 flex items-center gap-2"><BellRing size={18} className="text-ocean" /><h2 className="section-title">Notifications</h2></div>
          <div className="space-y-3">
            {notificationItems.slice(0, 5).map((item) => (
              <div className="surface-muted text-sm" key={item._id}>
                <p className="font-medium">{item.title}</p>
                <p className="text-slate-500 dark:text-slate-400">{item.message}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel">
        <h2 className="section-title mb-4">Daily and Monthly Attendance</h2>
        <DataTable
          rows={recentAttendance}
          columns={[
            { key: "date", label: "Date", render: (row) => new Date(row.date).toLocaleDateString() },
            { key: "subject", label: "Subject", render: (row) => row.subjectId?.name },
            { key: "status", label: "Status", render: (row) => <span className="badge-soft capitalize">{row.status}</span> },
            { key: "remarks", label: "Remarks" }
          ]}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <form className="panel" onSubmit={submitLeave}>
          <h2 className="section-title">Leave Application</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input className="input" type="date" value={leave.fromDate} onChange={(event) => setLeave({ ...leave, fromDate: event.target.value })} required />
            <input className="input" type="date" value={leave.toDate} onChange={(event) => setLeave({ ...leave, toDate: event.target.value })} required />
          </div>
          <textarea className="input mt-3 min-h-24" placeholder="Reason" value={leave.reason} onChange={(event) => setLeave({ ...leave, reason: event.target.value })} required />
          <button className="btn-primary mt-3">Submit Leave</button>
        </form>
        <section className="panel">
          <div className="flex items-center gap-2"><Settings size={18} className="text-ocean" /><h2 className="section-title">Settings</h2></div>
          <p className="mt-4 text-sm leading-6 text-slate-500">Use the top-right theme control to switch dark mode. Email alerts are sent when attendance needs attention.</p>
        </section>
      </div>
    </div>
  );
}
