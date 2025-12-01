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
      Thank you for attending our meetup yesterday. It was full of great
      insights from speakers, valuable conversations, and plenty of good laughs.
      This is the energy that we love, and it's what motivates us to keep doing
      what we do for our local tech community. We have incredibly exciting plans
      for 2026!
    </Text>
    <Text>
      We always look for ways to improve, so your feedback is very important to
      us. Please reply to this message, share your feedback on{" "}
      <Link href="https://chat.nn1.dev/">our Discord server</Link>, or ping us
      on social media and tell us how we're doing.
    </Text>
    <Text>
      If you like what we do, consider supporting us via{" "}
      <Link href="https://opencollective.com/nn1-dev">Open Collective</Link>. It
      is the most transparent way for us to collect donations and for you to
      track what we spend it on. As little as a fiver a month means a lot to us.
      We also have a special sponsor tier for businesses. Looking ahead, we have
      upcoming travel reimbursement costs for speakers travelling from outside
      our area. We'd also like to produce new merch and invest in some audio and
      recording gear. Your contributions help us make it all possible.
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

const renderEmailEvent_9_2025_11_28 = async ({ ticketUrl }: EmailProps) => ({
  html: await render(<Email ticketUrl={ticketUrl} />),
  text: await render(<Email ticketUrl={ticketUrl} />, { plainText: true }),
});

export default Email;
export { renderEmailEvent_9_2025_11_28 };
