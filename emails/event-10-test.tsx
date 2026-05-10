import { render } from "react-email";
import Layout from "../components/Layout";
import Text from "../components/Text";
import Socials from "../components/Socials";
import Heading from "../components/Heading";
import Button from "../components/Button.js";

interface EmailProps {
  ticketUrl: string;
}

export const Email = ({ ticketUrl }: EmailProps) => (
  <Layout>
    <Heading>Event template test</Heading>

    <Button href={ticketUrl}>Open Your Ticket</Button>

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

const renderEmailEventTest = async ({ ticketUrl }: EmailProps) => ({
  html: await render(<Email ticketUrl={ticketUrl} />),
  text: await render(<Email ticketUrl={ticketUrl} />, { plainText: true }),
});

export default Email;
export { renderEmailEventTest };
