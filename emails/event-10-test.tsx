import { render } from "react-email";
import Layout from "../components/Layout.tsx";
import Text from "../components/Text.tsx";
import Socials from "../components/Socials.tsx";
import Heading from "../components/Heading.tsx";
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
