import { render } from "react-email";
import Button from "../components/Button";
import Hr from "../components/Hr";
import Link from "../components/Link";
import Text from "../components/Text";
import Layout from "../components/Layout";
import Heading from "../components/Heading";
import Socials from "../components/Socials";

interface EmailProps {
  unsubscribeUrl: string;
}

export const Email = ({ unsubscribeUrl }: EmailProps) => (
  <Layout>
    <Heading>
      #11: "Compiling JavaScript ahead-of-time" by Oliver Medhurst and "Future
      of Work is Async" by Rob Hough
    </Heading>
    <Text>
      A quick reminder about the upcoming meetup with Oliver Medhurst and Rob
      Hough. In addition to top speakers, pizza, beers, and some other snacks,
      we have a little something for every attendee of this meetup. We are
      looking forward to seeing you on 26 March 2026 at 18:00. As always, it's
      free, but we have only 30 spots left. See you there!
    </Text>
    <Text>
      🗓️ Thursday, 26/03/2026, 18:00
      <br />
      📍 Vulcan Works, Northampton, NN1 1EW
      <br />
      💰 Free (registration required)
    </Text>
    <Button href="https://nn1.dev/events/11">Register now</Button>
    <Hr />
    <Text>Questions? Reach out on social media or reply to this email!</Text>
    <Text>
      NN1 Dev Club Crew,
      <br />
      Pawel & Darren
    </Text>
    <Socials />
    <Hr />
    <Text>
      Are you no longer interested? You can{" "}
      <Link href={unsubscribeUrl}>unsubscribe</Link> anytime.
    </Text>
  </Layout>
);

Email.PreviewProps = {
  unsubscribeUrl: "https://nn1.dev",
} as EmailProps;

const renderEmailNewsletter_2026_03_12 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2026_03_12 };
