import { Download, FileSpreadsheet, Pencil, QrCode, Search, Trash2, UserCheck, UsersRound } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import DataTable from "../../components/DataTable.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import StatCard from "../../components/StatCard.jsx";
import api from "../../services/api.js";
import { exportAttendanceExcel, exportAttendancePdf } from "../../services/exportService.js";
import useApi from "../../hooks/useApi.js";

export default function TeacherDashboard() {
  const overview = useApi(() => api.get("/dashboard/overview"), []);
  const students = useApi(() => api.get("/users/students/list"), []);
  const attendance = useApi(() => api.get("/attendance?limit=50"), []);
  const leaves = useApi(() => api.get("/leaves?status=pending"), []);
  const [query, setQuery] = useState("");
  const [qr, setQr] = useState("");
  const [form, setForm] = useState({ studentId: "", subjectId: "", date: new Date().toISOString().slice(0, 10), status: "present", remarks: "" });

  const filteredStudents = useMemo(() => {
    const list = students.data || [];
    return list.filter((student) => `${student.user?.name} ${student.rollNumber}`.toLowerCase().includes(query.toLowerCase()));
  }, [students.data, query]);

  if (overview.loading || students.loading || attendance.loading) return <LoadingSpinner label="Loading teacher dashboard" />;

  const subjectId = overview.data?.profile?.subjects?.[0]?._id || filteredStudents[0]?.subjects?.[0]?._id || "";

  const markAttendance = async (event) => {
    event.preventDefault();
    await api.post("/attendance", { ...form, subjectId: form.subjectId || subjectId });
    toast.success("Attendance saved");
    const refreshed = await api.get("/attendance?limit=50");
    attendance.setData(refreshed.data);
  };

  const removeAttendance = async (id) => {
    await api.delete(`/attendance/${id}`);
    toast.success("Attendance deleted");
    attendance.setData({ ...attendance.data, items: attendance.data.items.filter((item) => item._id !== id) });
  };

  const generateQr = async () => {
    const { data } = await api.post("/attendance/qr", {
      subjectId,
      department: overview.data?.profile?.department,
      semester: 6,
      section: "A"
    });
    setQr(data.qrCode);
  };

  const reviewLeave = async (id, status) => {
    await api.patch(`/leaves/${id}/review`, { status, reviewNote: `Leave ${status} by teacher.` });
    toast.success(`Leave ${status}`);
    leaves.setData(leaves.data.filter((item) => item._id !== id));
  };

  const records = attendance.data?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <p className="text-sm text-slate-500">Manage students, attendance, QR sessions, reports, and leave requests.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => exportAttendancePdf("Teacher Attendance Report", records)}><Download size={18} /> PDF</button>
          <button className="btn-secondary" onClick={() => exportAttendanceExcel("Teacher Attendance Report", records)}><FileSpreadsheet size={18} /> Excel</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={UsersRound} label="Students" value={overview.data?.totalStudents || 0} />
        <StatCard icon={UserCheck} label="Subjects" value={overview.data?.totalSubjects || 0} />
        <StatCard icon={Pencil} label="Marked Today" value={overview.data?.todayMarked || 0} />
        <StatCard icon={QrCode} label="Pending Leaves" value={overview.data?.pendingLeaves || 0} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="panel">
          <h2 className="font-semibold">Mark Attendance</h2>
          <form className="mt-4 grid gap-3 md:grid-cols-5" onSubmit={markAttendance}>
            <select className="input md:col-span-2" value={form.studentId} onChange={(event) => setForm({ ...form, studentId: event.target.value })} required>
              <option value="">Select student</option>
              {filteredStudents.map((student) => <option key={student._id} value={student._id}>{student.user?.name} ({student.rollNumber})</option>)}
            </select>
            <input className="input" type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} required />
            <select className="input" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
            <button className="btn-primary">Save</button>
            <input className="input md:col-span-5" placeholder="Remarks" value={form.remarks} onChange={(event) => setForm({ ...form, remarks: event.target.value })} />
          </form>
        </section>
        <section className="panel">
          <h2 className="font-semibold">QR Attendance</h2>
          <button className="btn-primary mt-4 w-full" onClick={generateQr}><QrCode size={18} /> Generate QR</button>
          <div className="mt-4 grid min-h-48 place-items-center rounded-md bg-slate-50 p-4 dark:bg-slate-950">
            {qr ? <img src={qr} alt="QR attendance code" className="h-40 w-40" /> : <QRCodeSVG value="Smart Attendance QR Ready" size={160} />}
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">Student List</h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input className="input pl-10" placeholder="Search students" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
        </div>
        <DataTable
          rows={filteredStudents}
          columns={[
            { key: "name", label: "Name", render: (row) => row.user?.name },
            { key: "rollNumber", label: "Roll No." },
            { key: "semester", label: "Semester" },
            { key: "section", label: "Section" },
            { key: "department", label: "Department" }
          ]}
        />
      </section>

      <section className="panel">
        <h2 className="mb-4 font-semibold">Attendance Reports</h2>
        <DataTable
          rows={records}
          columns={[
            { key: "student", label: "Student", render: (row) => row.studentId?.user?.name },
            { key: "subject", label: "Subject", render: (row) => row.subjectId?.name },
            { key: "date", label: "Date", render: (row) => new Date(row.date).toLocaleDateString() },
            { key: "status", label: "Status", render: (row) => <span className="capitalize">{row.status}</span> },
            { key: "actions", label: "Actions", render: (row) => <button className="text-red-600" onClick={() => removeAttendance(row._id)} aria-label="Delete attendance"><Trash2 size={18} /></button> }
          ]}
        />
      </section>

      <section className="panel">
        <h2 className="mb-4 font-semibold">Approve Leave Requests</h2>
        <div className="grid gap-3">
          {(leaves.data || []).map((leave) => (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-slate-50 p-3 dark:bg-slate-950" key={leave._id}>
              <div>
                <p className="font-medium">{leave.student?.user?.name}</p>
                <p className="text-sm text-slate-500">{leave.reason}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={() => reviewLeave(leave._id, "rejected")}>Reject</button>
                <button className="btn-primary" onClick={() => reviewLeave(leave._id, "approved")}>Approve</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
