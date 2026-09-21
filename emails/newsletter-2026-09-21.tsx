import { render } from "react-email";
import Hr from "../components/Hr";
import Link from "../components/Link";
import Text from "../components/Text";
import Layout from "../components/Layout";
import Socials from "../components/Socials";
import Button from "../components/Button";
import Heading from "../components/Heading";

interface EmailProps {
  unsubscribeUrl: string;
}

export const Email = ({ unsubscribeUrl }: EmailProps) => (
  <Layout>
    <Heading>
      NN1 Dev Club #13: "Scrubs to scripts" by Diana Silva and "I spared no
      expense" by Ana Rodrigues
    </Heading>
    <Text>
      Last call for our first event after the summer break!{" "}
      <strong>Diana Silva</strong> shares her journey from healthcare to
      software development in “Scrubs to scripts”, while{" "}
      <strong>Ana Rodrigues</strong> celebrates the joy of building personal
      side projects in “I spared no expense”. Come along, meet fellow
      developers, and hang out for a bit. As always, it’s completely free, but
      only a handful of tickets remain. Grab yours before they’re gone!
    </Text>
    <Text>
      🗓️ Thursday, 24/09/2026, 18:00
      <br />
      📍 Vulcan Works, Northampton, NN1 1EW
      <br />
      💰 Free (registration required)
    </Text>
    <Button href="https://nn1.dev/events/13/">Register now</Button>
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

const renderEmailNewsletter_2026_09_21 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2026_09_21 };
