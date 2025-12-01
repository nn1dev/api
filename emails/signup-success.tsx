import * as React from "react";
import { render } from "@react-email/render";
import Layout from "../components/Layout.tsx";
import Text from "../components/Text.tsx";
import Link from "../components/Link.tsx";
import Button from "../components/Button.tsx";
import Socials from "../components/Socials.tsx";

interface EmailSignupSuccessProps {
  ticketUrl: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventInviteUrlIcal: string;
  eventInviteUrlGoogle: string;
}

export const EmailSignupSuccess = ({
  ticketUrl,
  eventName,
  eventDate,
  eventLocation,
  eventInviteUrlIcal,
  eventInviteUrlGoogle,
}: EmailSignupSuccessProps) => (
  <Layout>
    <Text>
      Thanks for signing up for the upcoming NN1 Dev Club event,{" "}
      <strong>{eventName}</strong>. We can't wait to see you! Here is handy
      information about the event and a link to your ticket.
    </Text>
    <Button href={ticketUrl}>Go to your ticket</Button>

    <Text>
      🗓️ {eventDate}
      <br />
      📍 {eventLocation}
      <br />
      <br />
      Add it to your calendar: <Link href={eventInviteUrlIcal}>
        iCalendar
      </Link>{" "}
      or <Link href={eventInviteUrlGoogle}>Google Calendar</Link>
    </Text>

    <Text>Questions? Reach out on social media or reply to this email!</Text>
    <Socials />
  </Layout>
);

EmailSignupSuccess.PreviewProps = {
  ticketUrl: "https://nn1.dev",
  eventName:
    '#2: "Design Secrets for Developers" by Thomas Reeve and "Type-safe localization of Unsplash.com" by Oliver Ash',
  eventDate: "Wednesday, 27/03/2024, 18:00",
  eventLocation: "Vulcan Works, 34-38 Guildhall Rd, Northampton, NN1 1EW",
  eventInviteUrlIcal: "#",
  eventInviteUrlGoogle: "#",
} as EmailSignupSuccessProps;

const renderEmailSignupSuccess = async (props: EmailSignupSuccessProps) => ({
  html: await render(<EmailSignupSuccess {...props} />),
  text: await render(<EmailSignupSuccess {...props} />, { plainText: true }),
});

export default EmailSignupSuccess;
export { renderEmailSignupSuccess };
