import { ContactSchema } from "@workspace/types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import nodemailer from "nodemailer";

export const contactRoute = createTRPCRouter({
  send: publicProcedure.input(ContactSchema).mutation(async ({ input }) => {
    // Rate-limit & CAPTCHA check should happen before this
    // Example using SMTP via nodemailer:
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mail = {
      from: input.email,
      to: process.env.TO_EMAIL,
      subject: `Contact from ${input.name} in represent of ${input.organization ?? ""} <${input.subject}>`,
      text: `${input.message}\n\n---\nfrom: ${input.name} <${input.email}>`,
    };

    await transporter.sendMail(mail);

    return { success: true };
  }),
});
