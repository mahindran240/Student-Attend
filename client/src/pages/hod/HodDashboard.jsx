import { BarChart3, Download, FileSpreadsheet, GraduationCap, Layers3, UserPlus, UsersRound } from "lucide-react";
import AttendanceChart from "../../components/AttendanceChart.jsx";
import DataTable from "../../components/DataTable.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import StatCard from "../../components/StatCard.jsx";
import api from "../../services/api.js";
import { exportAttendanceExcel, exportAttendancePdf } from "../../services/exportService.js";
import useApi from "../../hooks/useApi.js";

export default function HodDashboard() {
  const overview = useApi(() => api.get("/dashboard/overview"), []);
  const students = useApi(() => api.get("/users/students/list"), []);
  const teachers = useApi(() => api.get("/users/teachers/list"), []);
  const subjects = useApi(() => api.get("/academic/subjects"), []);
  const departments = useApi(() => api.get("/academic/departments"), []);
  const attendance = useApi(() => api.get("/attendance?limit=100"), []);

  if (overview.loading || students.loading || teachers.loading || subjects.loading || departments.loading || attendance.loading) {
    return <LoadingSpinner label="Loading HOD dashboard" />;
  }

  const totals = overview.data?.totals || {};
  const records = attendance.data?.items || [];
  const chartItems = subjects.data?.map((subject) => {
    const subjectRecords = records.filter((record) => record.subjectId?._id === subject._id);
    return {
      subject: subject.name,
      present: subjectRecords.filter((record) => record.status !== "absent").length,
      absent: subjectRecords.filter((record) => record.status === "absent").length
    };
  }) || [];

  return (
    <div className="page-shell">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">HOD Dashboard</h1>
          <p className="page-subtitle">Department analytics, management, reports, and low-attendance monitoring.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={() => exportAttendancePdf("Department Monthly Report", records)}><Download size={18} /> PDF</button>
          <button className="btn-secondary" onClick={() => exportAttendanceExcel("Department Monthly Report", records)}><FileSpreadsheet size={18} /> Excel</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={GraduationCap} label="Students" value={totals.students || 0} />
        <StatCard icon={UsersRound} label="Teachers" value={totals.teachers || 0} />
        <StatCard icon={Layers3} label="Subjects" value={totals.subjects || 0} />
        <StatCard icon={BarChart3} label="Attendance" value={`${overview.data?.attendance?.percentage || 0}%`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="panel">
          <h2 className="section-title">Attendance Analytics</h2>
          <div className="mt-4">
            <AttendanceChart items={chartItems} />
          </div>
        </section>
        <section className="panel">
          <h2 className="section-title">Department Analytics</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="surface-muted flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Departments</dt><dd className="font-semibold">{totals.departments || 0}</dd></div>
            <div className="surface-muted flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Active Users</dt><dd className="font-semibold">{totals.users || 0}</dd></div>
            <div className="surface-muted flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Pending Leaves</dt><dd className="font-semibold">{totals.pendingLeaves || 0}</dd></div>
            <div className="surface-muted flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Semesters</dt><dd className="font-semibold">8</dd></div>
          </dl>
        </section>
      </div>

      <section className="panel">
        <div className="mb-4 flex items-center gap-2"><UserPlus size={18} className="text-ocean" /><h2 className="section-title">Student Management</h2></div>
        <DataTable
          rows={students.data || []}
          columns={[
            { key: "name", label: "Name", render: (row) => row.user?.name },
            { key: "rollNumber", label: "Roll No." },
            { key: "department", label: "Department" },
            { key: "semester", label: "Semester" },
            { key: "section", label: "Section" }
          ]}
        />
      </section>

      <section className="panel">
        <h2 className="section-title mb-4">Teacher Management</h2>
        <DataTable
          rows={teachers.data || []}
          columns={[
            { key: "name", label: "Name", render: (row) => row.user?.name },
            { key: "employeeId", label: "Employee ID" },
            { key: "department", label: "Department" },
            { key: "designation", label: "Designation" },
            { key: "subjects", label: "Subjects", render: (row) => row.subjects?.map((subject) => subject.name).join(", ") }
          ]}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="panel">
          <h2 className="section-title mb-4">Subject Management</h2>
          <DataTable rows={subjects.data || []} columns={[{ key: "name", label: "Name" }, { key: "code", label: "Code" }, { key: "semester", label: "Semester" }, { key: "credits", label: "Credits" }]} />
        </section>
        <section className="panel">
          <h2 className="section-title mb-4">Semester Management</h2>
          <DataTable rows={[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => ({ semester, label: `Semester ${semester}`, status: "Active" }))} columns={[{ key: "label", label: "Semester" }, { key: "status", label: "Status", render: (row) => <span className="badge-soft">{row.status}</span> }]} />
        </section>
      </div>

      <section className="panel">
        <h2 className="section-title mb-4">Low Attendance Students</h2>
        <DataTable
          rows={overview.data?.lowAttendance || []}
          empty="No low-attendance students found."
          columns={[
            { key: "student", label: "Student", render: (row) => row.student?.user?.name },
            { key: "roll", label: "Roll No.", render: (row) => row.student?.rollNumber },
            { key: "department", label: "Department", render: (row) => row.student?.department },
            { key: "percentage", label: "Attendance", render: (row) => `${row.stats?.percentage || 0}%` }
          ]}
        />
      </section>
    </div>
  );
}
