import QRCode from "qrcode";

export const createQrPayload = ({ subjectId, teacherId, department, semester, section }) => ({
  subjectId,
  teacherId,
  department,
  semester,
  section,
  issuedAt: Date.now(),
  expiresAt: Date.now() + 10 * 60 * 1000
});

export const generateQrCode = async (payload) => QRCode.toDataURL(JSON.stringify(payload));
