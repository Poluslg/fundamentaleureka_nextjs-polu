import nodemailer, { type Transporter } from "nodemailer";

type Props = { sendTo: string; subject: string; html: string };

let transporter: Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_EMAIL;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error("SMTP is not configured");
  }

  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) === 587 ? false : true,
    auth: { user, pass },
  });

  return transporter;
}

const sendEmail = async ({ sendTo, subject, html }: Props) => {
  try {
    return await getTransporter().sendMail({
      from: `"FundaMentalEureka" <${process.env.SMTP_EMAIL}>`,
      to: sendTo,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send email:", error instanceof Error ? error.message : error);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
