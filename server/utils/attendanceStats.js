export const summarizeAttendance = (records) => {
  const total = records.length;
  const present = records.filter((record) => record.status === "present" || record.status === "late").length;
  const absent = records.filter((record) => record.status === "absent").length;
  const percentage = total ? Math.round((present / total) * 100) : 0;
  return { total, present, absent, percentage };
};

export const groupBySubject = (records) => {
  const map = new Map();
  records.forEach((record) => {
    const key = record.subjectId?._id?.toString() || record.subjectId?.toString();
    const name = record.subjectId?.name || "Subject";
    if (!map.has(key)) map.set(key, { subject: name, total: 0, present: 0, absent: 0, percentage: 0 });
    const item = map.get(key);
    item.total += 1;
    if (record.status === "present" || record.status === "late") item.present += 1;
    if (record.status === "absent") item.absent += 1;
    item.percentage = Math.round((item.present / item.total) * 100);
  });
  return Array.from(map.values());
};
