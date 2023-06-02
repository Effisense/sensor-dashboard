import { User } from "@clerk/nextjs/server";

type BecomeCustomerEmailProps = {
  organizationName: string;
  sender: User;
};

/**
 * Composes an email to the Effisense team with the sender's organization name and email address.
 * @param props is an object containing the sender's organization name and the currently logged in user.
 * @returns a string to be used as `href` in a link.
 */
const becomeCustomerEmail = ({
  organizationName,
  sender,
}: BecomeCustomerEmailProps) => {
  const senderEmailAddress = sender.emailAddresses[0]?.emailAddress;

  const to = "hello@effisense.no";
  const subject = `[${organizationName}] Jeg vil bli kunde hos Effisense!`;
  const body = `Hei, jeg vil bli kunde hos Effisense!

  Jeg jobber i ${organizationName}.

  Min registrerte e-postadresse på Effisense er ${senderEmailAddress}.
  `.replaceAll("\n", "%0D%0A");

  return `mailto:${to}?subject=${subject}&body=${body}`;
};

export default becomeCustomerEmail;
