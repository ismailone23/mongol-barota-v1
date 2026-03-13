import nodemailer from "nodemailer";
import { TRPCError } from "@trpc/server";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  });
}

export async function sendMail(options: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  html?: string;
}) {
  const transporter = createTransporter();

  try {
    await transporter.verify();
  } catch (error) {
    console.error("[MAIL] SMTP connection failed:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Email service is currently unavailable. Please try again later.",
    });
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      ...options,
    });
    console.log("[MAIL] Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("[MAIL] Failed to send:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to send email. Please try again later.",
    });
  }
}
