import nodemailer from "nodemailer";

const buildTransporter = () => {
  if (!process.env.SMTP_HOST) {
    return nodemailer.createTransport({ jsonTransport: true });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = buildTransporter();
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || "Smart Attendance <noreply@smartattendance.local>",
    to,
    subject,
    html,
    text
  });
  return info;
};

export const sendAttendanceAlert = (user, percentage) =>
  sendEmail({
    to: user.email,
    subject: "Attendance alert",
    text: `Your attendance is ${percentage}%. Please improve it to stay above 75%.`,
    html: `<p>Hello ${user.name},</p><p>Your attendance is <strong>${percentage}%</strong>. Please improve it to stay above 75%.</p>`
  });
