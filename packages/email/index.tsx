import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
import Email from "./emails/notion-magic-link";

export type SendEmailProps = Pick<
  sendgrid.MailDataRequired,
  "from" | "to" | "subject"
>;

/**
 * TODO: Revisit this function when we have a real email template and know what we want to send.
 *
 * @param data
 * @returns
 */
export const sendEmail = async (data: SendEmailProps) => {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

  // TODO: Use the real email template when finished developing
  const html = render(<Email loginCode={"some-random-string"} />);

  return await sendgrid
    .send({
      ...data,
      html,
    })
    .then(() => {
      console.log(`✅ Successfully sent email!`);
      return true;
    })
    .catch((error) => {
      console.error(
        `❌ An error occurred when attempting to send an email: ${error}`,
      );
      return false;
    });
};
