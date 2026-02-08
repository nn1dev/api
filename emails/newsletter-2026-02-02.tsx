import { render } from "@react-email/render";
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
      Would you like your JavaScript applications to be as efficient as
      low-level Rust programs? Curious about how to leverage async work to reach
      a real productivity peak? We've got you covered! Oliver Medhurst and Rob
      Hough are the speakers for our next event scheduled for 26th March 2026 at
      18:00. Registration is open and spots are limited to 100. See you there!
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

const renderEmailNewsletter_2026_02_02 = async (props: EmailProps) => ({
  html: await render(<Email {...props} />),
  text: await render(<Email {...props} />, { plainText: true }),
});

export default Email;
export { renderEmailNewsletter_2026_02_02 };
