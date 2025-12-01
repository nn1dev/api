import { render } from "@react-email/render";
import Layout from "../components/Layout.tsx";
import Text from "../components/Text.tsx";
import Link from "../components/Link.tsx";
import Socials from "../components/Socials.tsx";

interface EmailProps {
  ticketUrl: string;
}

export const Email = ({ ticketUrl }: EmailProps) => (
  <Layout>
    <Text>
Thank you for joining our event yesterday, we really appreciate your involvement! If you have a minute, <Link href="https://nn1.dev/feedback/">please share your feedback</Link> (anonymously if you wish). It helps us improve, and positive feedback is welcome too 😉      <br />
      <br />
We’ll be back on 25 September with another “Hack & Share” session, where every one of you can share what you’re passionate about. There will be a series of six short (max 15 min) presentations from community members. <Link href="https://nn1.dev/events/8/">Book your ticket now</Link>, and let us know if you’d like to present something—we still have a few speaker slots available.
      <br />
      <br />
If you like what we do, <Link href="https://opencollective.com/nn1-dev">please consider supporting us on our Open Collective page</Link>. Every penny raised beyond what we need for the event will be donated to a local charity chosen by our community members.
    </Text>
    <Text>
      NN1 Dev Club Crew,
      <br />
      Pawel & Darren
    </Text>
    <Socials />
  </Layout>
);

Email.PreviewProps = {
  ticketUrl: "https://nn1.dev/events/5/123",
} as EmailProps;

const renderEmailEvent_7_2025_05_30 = async ({ ticketUrl }: EmailProps) => ({
  html: await render(<Email ticketUrl={ticketUrl} />),
  text: await render(<Email ticketUrl={ticketUrl} />, { plainText: true }),
});

export default Email;
export { renderEmailEvent_7_2025_05_30 };
