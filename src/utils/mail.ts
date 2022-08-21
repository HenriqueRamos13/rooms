import * as mail from "@sendgrid/mail";

mail.setApiKey(process.env.SENDGRID_API_KEY!);

interface MailOptions {
  to: string;
  subject: string;
}

const SGRID = async (message: string, obj: MailOptions) =>
  await mail.send({
    to: obj.to,
    from: process.env.SENDGRID_EMAIL!,
    subject: obj.subject,
    text: message,
    html: message,
  });

export default SGRID;
