import { ContactSchema } from "@workspace/types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { sendMail } from "../lib/mail";

export const contactRoute = createTRPCRouter({
  send: publicProcedure.input(ContactSchema).mutation(async ({ input }) => {
    await sendMail({
      to: process.env.TO_EMAIL ?? process.env.SMTP_USER!,
      replyTo: input.email,
      subject: `[Contact Form] ${input.subject} — ${input.name}${input.organization ? ` (${input.organization})` : ""}`,
      text: `Name: ${input.name}\nEmail: ${input.email}\nOrganization: ${input.organization ?? "N/A"}\n\n${input.message}`,
    });

    return { success: true };
  }),
});
