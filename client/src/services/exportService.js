import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const exportAttendancePdf = (title, rows) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 18);
  autoTable(doc, {
    startY: 26,
    head: [["Student", "Subject", "Date", "Status", "Remarks"]],
    body: rows.map((row) => [
      row.studentId?.user?.name || row.student || "Student",
      row.subjectId?.name || row.subject || "Subject",
      row.date ? new Date(row.date).toLocaleDateString() : "",
      row.status || "",
      row.remarks || ""
    ])
  });
  doc.save(`${title.toLowerCase().replaceAll(" ", "-")}.pdf`);
};

export const exportAttendanceExcel = (title, rows) => {
  const worksheet = XLSX.utils.json_to_sheet(
    rows.map((row) => ({
      Student: row.studentId?.user?.name || row.student || "Student",
      Subject: row.subjectId?.name || row.subject || "Subject",
      Date: row.date ? new Date(row.date).toLocaleDateString() : "",
      Status: row.status || "",
      Remarks: row.remarks || ""
    }))
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
  XLSX.writeFile(workbook, `${title.toLowerCase().replaceAll(" ", "-")}.xlsx`);
};
