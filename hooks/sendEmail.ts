import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API);

type Props = { sendTo: string; subject: string; html: any };

const sendEmail = async ({ sendTo, subject, html }: Props) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "FundaMentalEduruka <support@support.prahladbiswas.me>",
      to: sendTo,
      subject: subject,
      html: html,
    });

    if (error) {
      return { error };
    }

    return data;
  } catch (error) {
    return error;
  }
};

export default sendEmail;
